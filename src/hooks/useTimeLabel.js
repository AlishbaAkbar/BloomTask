export function getTimeLabel(dueDate) {
  if (!dueDate) return null
  const now = new Date()
  const due = new Date(dueDate + 'T23:59:59') // end of due day
  const diffMs = due - now
  const diffHrs = diffMs / (1000 * 60 * 60)
  const diffDays = diffMs / (1000 * 60 * 60 * 24)

  if (diffMs < 0) return { text: 'Overdue!', sublabel: 'You missed this one 💔', level: 'overdue', color: '#EF4444', bg: '#FEF2F2', icon: '💔' }
  if (diffHrs <= 6) return { text: `${Math.ceil(diffHrs)}h left!`, sublabel: 'Almost out of time ⏰', level: 'critical', color: '#FF6B9D', bg: '#FFF0F6', icon: '⏰' }
  if (diffHrs <= 24) return { text: 'Due today!', sublabel: 'Complete it today 🔥', level: 'today', color: '#FF8C42', bg: '#FFF7ED', icon: '🔥' }
  if (diffDays <= 2) return { text: `${Math.ceil(diffDays)} days left`, sublabel: 'Coming up soon ⚡', level: 'soon', color: '#F59E0B', bg: '#FFFBEB', icon: '⚡' }
  if (diffDays <= 7) return { text: `${Math.ceil(diffDays)} days left`, sublabel: 'This week ✨', level: 'week', color: '#A78BFA', bg: '#F5F3FF', icon: '✨' }
  return { text: `${Math.ceil(diffDays)} days left`, sublabel: 'Plenty of time 🌸', level: 'calm', color: '#6EE7B7', bg: '#ECFDF5', icon: '🌸' }
}

export function isToday(dateStr) {
  if (!dateStr) return false
  const d = new Date(dateStr)
  const t = new Date()
  return d.toDateString() === t.toDateString()
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
