# 🌸 BloomTasks — Setup Guide

A gorgeous girly task manager with **real** Google Calendar integration.

---

## ⚡ Quick Start (5 minutes)

### Step 1 — Install dependencies

```bash
npm install
```

### Step 2 — Get your Google OAuth Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing) → name it "BloomTasks"
3. Go to **APIs & Services → Library**
4. Search for **"Google Calendar API"** → Enable it
5. Go to **APIs & Services → OAuth consent screen**
   - Choose **External**
   - Fill in app name: "BloomTasks", your email
   - Add scopes: `calendar.events`, `userinfo.email`, `userinfo.profile`
   - Add your email as a **Test User**
   - Save
6. Go to **APIs & Services → Credentials**
   - Click **+ Create Credentials → OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Name: "BloomTasks Web"
   - Under **Authorized JavaScript origins**, add:
     - `http://localhost:5173`  ← for local dev
     - `https://your-app.vercel.app`  ← your deployed URL (add later)
   - Click **Create**
   - Copy the **Client ID** (looks like `123456789-abc...apps.googleusercontent.com`)

### Step 3 — Add your Client ID

Create a `.env` file in the project root:

```env
VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
```

### Step 4 — Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🌸

---

## 🚀 Deploy to Vercel (free, 2 minutes)

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Add environment variable: `VITE_GOOGLE_CLIENT_ID` = your client ID
4. Deploy!
5. Copy your Vercel URL (e.g. `https://bloomtasks.vercel.app`)
6. Go back to Google Cloud Console → Credentials → Edit your OAuth client
7. Add `https://bloomtasks.vercel.app` to **Authorized JavaScript origins**
8. Save — done! ✅

---

## 📅 How Google Calendar Integration Works

When a task has a due date and Calendar is connected:

| Priority | Reminder schedule |
|----------|-------------------|
| 🔥 Urgent | Pop-up at 2 hours, 1 day, 2 days before + email 2 days before |
| ⚡ High | Pop-up at 4 hours, 1 day, 2 days before + email 2 days before |
| ✨ Medium | Pop-up at 8 hours and 2 days before |
| 🌸 Low | Pop-up 1 day before |

Events appear in your Google Calendar as colored blocks:
- 🔴 Red = Urgent
- 🟠 Orange = High  
- 💜 Lavender = Medium
- 🟢 Green = Low

Completing a task marks it `✅ [Done]` in your calendar.
Deleting a task removes it from your calendar.
Editing a task updates the calendar event.

---

## 🪙 Coin System

| Priority | Coins on completion |
|----------|---------------------|
| 🔥 Urgent | 50 coins |
| ⚡ High | 30 coins |
| ✨ Medium | 20 coins |
| 🌸 Low | 10 coins |

---

## 📁 Project Structure

```
bloomtasks/
├── src/
│   ├── App.jsx                    ← Main app + all logic
│   ├── googleCalendar.js          ← Real Google Calendar API calls
│   ├── main.jsx                   ← Entry point + Google OAuth provider
│   ├── index.css                  ← Global styles + animations
│   ├── hooks/
│   │   ├── useLocalStorage.js     ← Persistent state
│   │   └── useTimeLabel.js        ← Smart time labels ("2 days left")
│   └── components/
│       ├── FloatingPetals.jsx     ← Animated background petals
│       ├── TaskCard.jsx           ← Individual task card
│       ├── TaskCard.module.css
│       ├── TaskForm.jsx           ← Add/Edit modal
│       ├── TaskForm.module.css
│       ├── Celebration.jsx        ← Coins celebration popup
│       └── Celebration.module.css
├── .env                           ← Your VITE_GOOGLE_CLIENT_ID (create this!)
├── index.html
├── package.json
└── vite.config.js
```

---

## 🔐 Security Notes

- Your Google OAuth Client ID is **public** (that's fine for web apps)
- The access token is stored in `localStorage` — this is standard for SPAs
- No backend needed — all API calls go directly from browser to Google
- Tokens expire after ~1 hour; users will need to reconnect (you can add token refresh later)

---

## 💡 Troubleshooting

**"redirect_uri_mismatch" error** → Make sure `http://localhost:5173` is in your Authorized JavaScript origins in Google Cloud Console

**"Access blocked" error** → Make sure your Google account is added as a Test User in OAuth consent screen

**Calendar event not created** → Check browser console for errors; token may have expired — click Disconnect and reconnect

---

Made with 🌸 by BloomTasks
