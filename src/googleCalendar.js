/**
 * googleCalendar.js
 * Real Google Calendar API integration.
 * Requires a valid OAuth2 access_token with scope:
 *   https://www.googleapis.com/auth/calendar.events
 */

const CALENDAR_API = 'https://www.googleapis.com/calendar/v3'

/**
 * Creates a real Google Calendar event for a task.
 * Adds pop-up reminders at smart intervals based on priority.
 */
export async function createCalendarEvent(task, accessToken) {
  if (!accessToken) throw new Error('No access token')

  const { title, dueDate, dueTime, priority, category, notes } = task

  // Build start/end — prefer a timed event when `dueTime` exists,
  // otherwise fall back to an all-day event on the due date.
  let start
  let end
  if (dueDate && dueTime) {
    // Create a timed event (default duration 1 hour)
    const timeZone = 'Asia/Karachi'

const startDateTime = `${dueDate}T${dueTime}:00`

const [hours, minutes] = dueTime.split(':').map(Number)
const endObj = new Date(`${dueDate}T${dueTime}:00`)
endObj.setHours(hours + 1, minutes)

const endDate = endObj.toISOString().slice(0, 10)
const endTime = String(endObj.getHours()).padStart(2, '0') + ':' + String(endObj.getMinutes()).padStart(2, '0')

start = {
  dateTime: startDateTime,
  timeZone,
}

end = {
  dateTime: `${endDate}T${endTime}:00`,
  timeZone,
}
  } else {
   if (!dueDate) throw new Error('Due date is required for calendar event')
   start = { date: dueDate }
   end = { date: getNextDate(dueDate) }
  }

  // Smart reminder minutes based on priority
  const reminderMinutes = {
    urgent: [120, 1440, 2880],       // 2h, 1 day, 2 days before
    high:   [240, 1440, 2880],       // 4h, 1 day, 2 days before
    medium: [480, 2880],             // 8h, 2 days before
    low:    [1440],                  // 1 day before
  }

  const overrides = (reminderMinutes[priority] || [1440]).map(minutes => ({
    method: 'popup',
    minutes,
  }))

  // Also add an email reminder for high/urgent
  if (priority === 'urgent' || priority === 'high') {
    overrides.push({ method: 'email', minutes: 2880 }) // 2 days email
  }

  const priorityEmoji = { urgent: '🔥', high: '⚡', medium: '✨', low: '🌸' }
  const emoji = priorityEmoji[priority] || '🌸'

  const event = {
    summary: `${emoji} [BloomTasks] ${title}`,
    description: [
      `📋 Category: ${category}`,
      `⚡ Priority: ${priority.charAt(0).toUpperCase() + priority.slice(1)}`,
      notes ? `📝 Notes: ${notes}` : '',
      '',
      '— Created by BloomTasks 🌸',
    ].filter(Boolean).join('\n'),
    start,
    end,
    colorId: getGoogleColorId(priority),
    reminders: {
      useDefault: false,
      overrides,
    },
  }

  const response = await fetch(`${CALENDAR_API}/calendars/primary/events`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.error?.message || 'Failed to create calendar event')
  }

  return await response.json() // returns the created event with its id
}

/**
 * Updates an existing Google Calendar event when a task is edited.
 */
export async function updateCalendarEvent(eventId, task, accessToken) {
  if (!accessToken || !eventId) return null
  const { title, dueDate, dueTime, priority, category, notes } = task
  const priorityEmoji = { urgent: '🔥', high: '⚡', medium: '✨', low: '🌸' }
  const emoji = priorityEmoji[priority] || '🌸'

  const reminderMinutes = {
    urgent: [120, 1440, 2880],
    high:   [240, 1440, 2880],
    medium: [480, 2880],
    low:    [1440],
  }
  const overrides = (reminderMinutes[priority] || [1440]).map(minutes => ({
    method: 'popup',
    minutes,
  }))

  // Build start/end similar to createCalendarEvent
  let start
  let end
  if (dueDate && dueTime) {
    const timeZone = 'Asia/Karachi'

const startDateTime = `${dueDate}T${dueTime}:00`

const [hours, minutes] = dueTime.split(':').map(Number)
const endObj = new Date(`${dueDate}T${dueTime}:00`)
endObj.setHours(hours + 1, minutes)

const endDate = endObj.toISOString().slice(0, 10)
const endTime = String(endObj.getHours()).padStart(2, '0') + ':' + String(endObj.getMinutes()).padStart(2, '0')

start = {
  dateTime: startDateTime,
  timeZone,
}

end = {
  dateTime: `${endDate}T${endTime}:00`,
  timeZone,
}
  } else {
  if (!dueDate) throw new Error('Due date is required for calendar event')

  start = { date: dueDate }
  end = { date: getNextDate(dueDate) }
}
  const event = {
    summary: `${emoji} [BloomTasks] ${title}`,
    description: [
      `📋 Category: ${category}`,
      `⚡ Priority: ${priority.charAt(0).toUpperCase() + priority.slice(1)}`,
      notes ? `📝 Notes: ${notes}` : '',
      '',
      '— Created by BloomTasks 🌸',
    ].filter(Boolean).join('\n'),
    start,
    end,
    colorId: getGoogleColorId(priority),
    reminders: { useDefault: false, overrides },
  }

  const response = await fetch(`${CALENDAR_API}/calendars/primary/events/${eventId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  })

  if (!response.ok) return null
  return await response.json()
}

/**
 * Deletes a Google Calendar event when a task is deleted.
 */
export async function deleteCalendarEvent(eventId, accessToken) {
  if (!accessToken || !eventId) return

  await fetch(`${CALENDAR_API}/calendars/primary/events/${eventId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

/**
 * Marks the calendar event as completed (adds ✅ prefix).
 */
export async function completeCalendarEvent(eventId, taskTitle, accessToken) {
  if (!accessToken || !eventId) return

  await fetch(`${CALENDAR_API}/calendars/primary/events/${eventId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      summary: `✅ [Done] ${taskTitle}`,
      colorId: '2', // sage green
    }),
  })
}

/**
 * Maps BloomTasks priority to Google Calendar color IDs.
 * https://developers.google.com/calendar/api/v3/reference/colors/get
 */
function getGoogleColorId(priority) {
  const map = {
    urgent: '11', // Tomato red
    high:   '6',  // Tangerine orange
    medium: '1',  // Lavender
    low:    '2',  // Sage green
  }
  return map[priority] || '1'
}

/**
 * Fetches upcoming BloomTasks events from Google Calendar.
 */
export async function fetchBloomTaskEvents(accessToken) {
  if (!accessToken) return []

  const now = new Date().toISOString()
  const thirtyDaysLater = new Date(Date.now() + 30 * 86400000).toISOString()

  const params = new URLSearchParams({
    q: '[BloomTasks]',
    timeMin: now,
    timeMax: thirtyDaysLater,
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: '50',
  })

  const response = await fetch(`${CALENDAR_API}/calendars/primary/events?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) return []
  const data = await response.json()
  return data.items || []
}

function getNextDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() + 1)

  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')

  return `${y}-${m}-${d}`
}