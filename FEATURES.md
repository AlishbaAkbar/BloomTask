# ✨ BloomTasks Features

A comprehensive guide to everything BloomTasks can do.

---

## 🎯 Core Task Management

### ✅ Full CRUD Operations
- **Create** — Add new tasks with title, category, priority, due date, notes, and mood emoji
- **Read** — View all tasks in a beautiful card layout
- **Update** — Edit any task detail (automatically updates Calendar event if synced)
- **Delete** — Remove tasks (automatically deletes Calendar event if synced)

### 🏷️ Task Properties
- **Title** — What you need to do
- **Category** — Work, Personal, Health, Study, Creative, Social, Finance, Travel
- **Priority** — Urgent (🔥), High (⚡), Medium (✨), Low (🌸)
- **Due Date** — When it needs to be done
- **Notes** — Details, inspiration, reminders
- **Mood Emoji** — Personal touch (🌸 ✨ 💕 🌺 🦋 💫 🌷 🎀 🌼 🍓 🌙 🌈)

### 🪙 Gamification System
- **Earn coins** for completing tasks:
  - 🔥 Urgent: 50 coins
  - ⚡ High: 30 coins
  - ✨ Medium: 20 coins
  - 🌸 Low: 10 coins
- **Track total coins** earned
- **Celebration animation** when you complete a task
- **Coins available** shows what you can still earn

---

## 📅 Google Calendar Integration

### Real Calendar Events
When you connect Google Calendar and add a task with a due date:
- ✅ **Automatic event creation** in your Google Calendar
- 🎨 **Color-coded events** by priority (red, orange, purple, green)
- 📋 **Event details** include category, priority, notes
- 🔗 **Event ID stored** so BloomTasks can update/delete it

### Smart Reminders
Pop-up notifications at optimal times based on priority:

| Priority | Reminders |
|----------|-----------|
| 🔥 Urgent | 2 hours, 1 day, 2 days before + email 2 days before |
| ⚡ High | 4 hours, 1 day, 2 days before + email 2 days before |
| ✨ Medium | 8 hours, 2 days before |
| 🌸 Low | 1 day before |

### Two-Way Sync
- **Edit task** → Calendar event updates automatically
- **Delete task** → Calendar event deleted automatically
- **Complete task** → Event marked as `✅ [Done]` in Calendar
- **Uncomplete task** → Event restored to normal

### Calendar Features
- 📅 **All-day events** on the due date
- 🌍 **Timezone aware** — uses your local timezone
- 📧 **Email reminders** for urgent/high priority tasks
- 🔔 **Pop-up notifications** via Google Calendar (desktop & mobile)
- 🎨 **Event naming**: `[Priority Emoji] [BloomTasks] Task Title`

---

## ⏰ Smart Time Tracking

### Dynamic Time Labels
Tasks show how much time is left:
- 💔 **"Overdue!"** — Past the due date
- ⏰ **"3h left!"** — Less than 6 hours remaining
- 🔥 **"Due today!"** — Due within 24 hours
- ⚡ **"2 days left"** — Due within 2 days
- ✨ **"5 days left"** — Due within a week
- 🌸 **"15 days left"** — More than a week away

### Color-Coded Urgency
Time chips change color based on urgency:
- 🔴 Red = Overdue
- 🟠 Orange = Critical (< 6 hours)
- 🟡 Amber = Today
- 🟣 Purple = This week
- 🟢 Green = Future

---

## 📊 Three Main Views

### 1. ✨ Tasks Tab
- **All Tasks** — Active tasks only (not completed)
- **Today 🌸** — Tasks due today
- **Done ✅** — Completed tasks (grayed out)
- Search, filter, and sort tools
- Add new tasks

### 2. ⏰ Alerts Tab (Reminders)
- **Urgent reminders** for tasks due soon
- Sorted by due date (most urgent first)
- Shows time remaining and sync status
- **Today's Mission** banner with all tasks due today
- **How reminders work** explanation panel

### 3. 📊 Stats Tab
- **Overview stats**: Pending, Completed, Coins earned, Coins available
- **Overall progress bar** (% of all tasks completed)
- **By Category breakdown** with progress bars
- **Today's to-do list** with coin totals
- **Google Calendar connection status** with connected account details

---

## 🔍 Filtering & Search

### Search
- 🔍 Search by task title, category, or notes
- Real-time results as you type

### View Filters
- **All Tasks** — Active tasks
- **Today** — Due today only
- **Done** — Completed tasks

### Priority Filter
- All priorities
- 🔥 Urgent only
- ⚡ High only
- ✨ Medium only
- 🌸 Low only

### Sort Options
- 📅 **By Due Date** — Earliest first
- ⚡ **By Priority** — Urgent → High → Medium → Low
- ✨ **By New** — Most recently created first

---

## 🎨 Visual Design

### Aesthetic Features
- 🌸 **Floating petals animation** — Cherry blossoms, stars, hearts drifting down
- 🎨 **Gradient backgrounds** — Pink to lavender to peach
- ✨ **Glass-morphism** — Frosted glass cards
- 🌈 **Color-coded priorities** — Left border accent on each task card
- 💫 **Smooth animations** — Cards slide up, buttons have hover effects

### Typography
- **Headings**: DM Serif Display (elegant serif)
- **Body**: Nunito (modern, rounded sans-serif)

### Responsive Design
- 📱 **Mobile-friendly** — Works on phones, tablets, desktops
- 📐 **Flexible grid** — Stats cards adapt to screen size

---

## 🎉 User Experience Features

### Celebration System
When you complete a task:
- 🎉 **Popup animation** with confetti emojis falling
- 🪙 **Coins earned** displayed in large text
- 💕 **"You're blooming!"** encouragement
- ⏱️ **Auto-dismiss** after 2.8 seconds

### Toast Notifications
- ✅ Success: "Task created & synced to Calendar!"
- ✏️ Update: "Task updated!"
- 🗑 Delete: "Task deleted 🌸"
- 📅 Connection: "Welcome! Calendar connected!"
- ❌ Errors: Clear error messages

### Today's Bloom List Banner
When you have tasks due today:
- 🌸 Shows count of tasks due today
- 🪙 Shows total coins you can earn today
- ☀️ Cheerful sun emoji
- Displayed at top of Tasks tab

---

## 💾 Data Persistence

### Local Storage
- ✅ **Tasks persist** between sessions
- 🪙 **Coins persist** — your progress is saved
- 🔑 **Google token stored** — stay signed in (expires after ~1 hour)
- 👤 **User info cached** — name, email, profile picture

### No Backend Required
- All data stored in browser `localStorage`
- Privacy-friendly — your tasks never leave your device (except for Calendar sync)
- Works offline after initial load (except Calendar features)

---

## 🔐 Security & Privacy

### What's Stored Where
- **Browser localStorage**: Tasks, coins, Google access token, user info
- **Google Calendar**: Only tasks with due dates (as calendar events)

### Permissions
BloomTasks requests these Google permissions:
- ✅ `calendar.events` — Create/edit/delete calendar events
- ✅ `userinfo.email` — Display your email
- ✅ `userinfo.profile` — Display your name & profile picture

### Data Control
- 🔓 **Disconnect anytime** — Revoke access from BloomTasks
- 🗑️ **Delete tasks** — Removes them from Calendar too
- 🚫 **No tracking** — No analytics, no data collection

---

## 🚀 Performance

### Optimizations
- ⚡ **Instant UI updates** — Tasks appear immediately (Calendar sync happens in background)
- 💨 **Fast filtering** — All client-side, no network delays
- 🎯 **Smart caching** — User info cached, fewer API calls
- 📦 **Small bundle** — Fast page load

### Offline Support
- ✅ View tasks offline
- ✅ Add/edit/delete tasks offline
- ❌ Calendar sync requires internet (obviously)

---

## 📱 Mobile Experience

### Touch-Friendly
- 👆 Large tap targets (buttons, cards)
- 📲 Mobile-optimized modals
- 🔘 Radio buttons instead of dropdowns for priority/mood selection

### Mobile Calendar Integration
When you sync tasks on mobile:
- 📱 Google Calendar mobile app shows events
- 🔔 Push notifications for reminders
- 📅 Works with other calendar apps that sync with Google Calendar

---

## 🎯 Use Cases

### Perfect For:
- 📝 Personal task management
- 🎯 Goal tracking with rewards (coins)
- 📅 Visual calendar planning
- ⏰ Deadline management with reminders
- 💪 Building productive habits
- 🌸 Adding joy to productivity (girly aesthetic)

### Who It's For:
- 👩‍🎓 Students tracking assignments
- 👩‍💼 Professionals managing projects
- 🧘‍♀️ Anyone who wants a cute, functional task manager
- 💕 People who love pink, gradients, and emojis
- 📆 Calendar power users

---

## 🔮 Future Enhancement Ideas

Potential features you could add:

- 🔄 **Recurring tasks** (daily, weekly, monthly)
- 👥 **Task sharing** (collaborate with friends)
- 🏆 **Achievements & badges** (complete 10 tasks, earn 500 coins, etc.)
- 📊 **Productivity analytics** (completion rate, best category, etc.)
- 🎨 **Theme customization** (blue, green, dark mode)
- 🔔 **Push notifications** (via service worker)
- 📤 **Export/import** (backup as JSON)
- 🎵 **Focus timer** (Pomodoro integration)
- 🛍️ **Coin shop** (spend coins on themes/emojis)
- 📱 **Mobile app** (React Native or PWA)

---

Enjoy blooming! 🌸✨
