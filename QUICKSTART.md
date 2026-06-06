# ⚡ Quick Start — 5 Minutes to BloomTasks

The absolute fastest way to get BloomTasks running.

---

## What You Need
- ✅ Node.js 16+ installed ([download here](https://nodejs.org))
- ✅ A Google account
- ✅ 5 minutes

---

## Steps

### 1. Install (30 seconds)

```bash
cd bloomtasks
npm install
```

### 2. Get Google Client ID (3 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "BloomTasks"
3. Enable "Google Calendar API"
4. Go to Credentials → Create OAuth Client ID
5. Type: Web application
6. Add authorized origin: `http://localhost:5173`
7. Copy the Client ID (ends with `.apps.googleusercontent.com`)

**Full details**: See `GOOGLE_CALENDAR_SETUP.md`

### 3. Add Client ID (30 seconds)

Create `.env` file:

```env
VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
```

### 4. Run (10 seconds)

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 5. Connect Calendar (1 minute)

1. Click "Connect Google Calendar"
2. Sign in with your Google account
3. Click "Allow" to grant permissions
4. Done! Create a task with a due date
5. Check your Google Calendar — it's there! 📅✨

---

## That's It! 🌸

You now have a fully functional task manager with real Google Calendar integration.

### Next Steps:
- 📖 Read `FEATURES.md` to see everything BloomTasks can do
- 🚀 Read `DEPLOYMENT_GUIDE.md` to deploy to Vercel/Netlify
- 🎨 Customize colors, add features, make it yours!

---

## Troubleshooting

**"Can't find module" error**  
→ Run `npm install` again

**Google sign-in doesn't work**  
→ Make sure:
- Client ID in `.env` is correct
- `http://localhost:5173` is in Authorized JavaScript origins
- Your email is added as a Test User in OAuth consent screen

**Calendar event not created**  
→ Check browser console (F12) for errors. Token might have expired — disconnect and reconnect.

**Environment variable not loading**  
→ Make sure:
- File is named `.env` (with the dot)
- Variable starts with `VITE_` prefix
- Restart dev server after creating `.env`

---

Need more help? Check the full guides:
- 📅 `GOOGLE_CALENDAR_SETUP.md` — Detailed Google Cloud setup
- 🚀 `DEPLOYMENT_GUIDE.md` — Deploy to production
- ✨ `FEATURES.md` — Complete feature list
- 📖 `README.md` — Project overview

Happy blooming! 🌸
