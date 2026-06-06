# 🌸 BloomTasks

BloomTasks is a beautiful productivity and task management application designed to make organizing daily tasks simple, rewarding, and visually engaging.

It combines task management, smart reminders, productivity rewards, and Google Calendar integration in a modern aesthetic interface.

## ✨ Features

* Create, edit, and delete tasks
* Priority-based task management

  * 🔥 Urgent
  * ⚡ High
  * ✨ Medium
  * 🌸 Low
* Due dates and optional due times
* Google Calendar integration
* Automatic calendar event creation
* Smart reminder scheduling
* Productivity reward system (coins)
* Statistics dashboard
* Responsive and aesthetic UI
* Persistent local storage

## 📅 Google Calendar Integration

Connected tasks are automatically synchronized with Google Calendar.

### Smart Reminders

| Priority  | Reminder Schedule                              |
| --------- | ---------------------------------------------- |
| 🔥 Urgent | 2 hours, 1 day, 2 days before + email reminder |
| ⚡ High    | 4 hours, 1 day, 2 days before + email reminder |
| ✨ Medium  | 8 hours and 2 days before                      |
| 🌸 Low    | 1 day before                                   |

### Calendar Sync Features

* Automatic event creation
* Event updates when tasks are edited
* Event deletion when tasks are removed
* Task completion reflected in calendar

## 🪙 Reward System

| Priority  | Coins Earned |
| --------- | ------------ |
| 🔥 Urgent | 50           |
| ⚡ High    | 30           |
| ✨ Medium  | 20           |
| 🌸 Low    | 10           |

## 🛠 Tech Stack

* React
* Vite
* JavaScript
* Google OAuth 2.0
* Google Calendar API
* Local Storage

## 🚀 Installation

```bash
npm install
npm run dev
```

## 📂 Project Structure

```text
src/
├── App.jsx
├── googleCalendar.js
├── hooks/
├── components/
└── styles/
```

## 🔮 Future Enhancements

* Cloud database integration
* Multi-device synchronization
* AI-powered productivity suggestions
* Team collaboration
* Mobile application

## 👩‍💻 Developer

Alishba Akbar

---

Made with 🌸 using React and Google Calendar API.
