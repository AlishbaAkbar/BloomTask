# 📅 Google Calendar API Setup Guide

This guide walks you through setting up Google Calendar integration for BloomTasks.

---

## Why You Need This

BloomTasks uses the **Google Calendar API** to:
- Create calendar events automatically when you add tasks with due dates
- Set smart reminders (pop-up notifications) based on priority
- Update/delete calendar events when you edit/delete tasks
- Mark events as completed when you finish tasks

---

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. At the top, click the project dropdown → **"New Project"**
4. Name it: `BloomTasks` (or any name you like)
5. Click **"Create"**
6. Wait 10-15 seconds for the project to be created
7. Make sure `BloomTasks` is selected in the project dropdown

---

## Step 2: Enable Google Calendar API

1. In the left sidebar, click **"APIs & Services" → "Library"**
   - (Or use the search bar and type "API Library")
2. In the search box, type: `Google Calendar API`
3. Click on **"Google Calendar API"** from the results
4. Click the blue **"Enable"** button
5. Wait a few seconds — you'll see "API enabled" ✅

**Why?** This allows your app to create/read/update/delete calendar events.

---

## Step 3: Configure OAuth Consent Screen

This is the screen users see when they click "Connect Google Calendar."

1. Go to **"APIs & Services" → "OAuth consent screen"**
2. Choose **"External"** (allows anyone to use your app)
3. Click **"Create"**

### Fill in the form:

**App information:**
- **App name**: `BloomTasks` (or your app name)
- **User support email**: Your email address
- **App logo**: (Optional — you can skip this)

**App domain:** (Optional — skip for now)

**Developer contact information:**
- **Email addresses**: Your email

4. Click **"Save and Continue"**

### Scopes (Step 2 of consent screen):

5. Click **"Add or Remove Scopes"**
6. In the filter box, type: `calendar`
7. Check these boxes:
   - ✅ `https://www.googleapis.com/auth/calendar.events` (View and edit events)
   - ✅ `https://www.googleapis.com/auth/userinfo.email` (See your email)
   - ✅ `https://www.googleapis.com/auth/userinfo.profile` (See your personal info)
8. Click **"Update"** at the bottom
9. Click **"Save and Continue"**

### Test users (Step 3):

10. Click **"+ Add Users"**
11. Add your email address (the one you'll use to test the app)
12. Click **"Add"**
13. Click **"Save and Continue"**

### Summary (Step 4):

14. Review everything
15. Click **"Back to Dashboard"**

**Why add test users?** While your app is in "Testing" mode, only test users can connect their Calendar. You can publish it later to make it public.

---

## Step 4: Create OAuth 2.0 Credentials

This is the **Client ID** your app needs to authenticate users.

1. Go to **"APIs & Services" → "Credentials"**
2. Click **"+ Create Credentials"** at the top
3. Select **"OAuth 2.0 Client ID"**

### Configure the OAuth client:

4. **Application type**: Choose **"Web application"**
5. **Name**: `BloomTasks Web Client` (or any name)

6. **Authorized JavaScript origins**:
   - Click **"+ Add URI"**
   - Add: `http://localhost:5173` (for local development)
   - Click **"+ Add URI"** again
   - Add your deployed URL later (e.g., `https://your-app.vercel.app`)

   **Important rules for URIs:**
   - ✅ `http://localhost:5173` (correct for local dev)
   - ✅ `https://bloomtasks.vercel.app` (correct for production)
   - ❌ `http://localhost:5173/` (no trailing slash)
   - ❌ `http://your-app.vercel.app` (production must use `https`)

7. **Authorized redirect URIs**: Leave this empty (not needed for this app)

8. Click **"Create"**

---

## Step 5: Copy Your Client ID

A popup will appear with your credentials:

```
Your Client ID
123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com

Your Client Secret
GOCSPX-aBcDeFgHiJkLmNoPqRsTuVwXyZ
```

1. **Copy the Client ID** (the long string ending in `.apps.googleusercontent.com`)
2. Click **"OK"**

**Important:** 
- ✅ You need the **Client ID**
- ❌ You don't need the Client Secret (browser apps don't use it)

---

## Step 6: Add Client ID to Your App

### For local development:

1. Open your `bloomtasks` folder
2. Create a file named `.env` (note the dot at the start)
3. Paste this:

```env
VITE_GOOGLE_CLIENT_ID=paste_your_client_id_here.apps.googleusercontent.com
```

4. Replace `paste_your_client_id_here` with your actual Client ID

### For deployment (Vercel/Netlify):

1. Go to your Vercel/Netlify project settings
2. Find **"Environment Variables"**
3. Add:
   - **Key**: `VITE_GOOGLE_CLIENT_ID`
   - **Value**: Your Client ID
4. Redeploy your app

---

## Step 7: Test It!

1. Run your app: `npm run dev`
2. Open [http://localhost:5173](http://localhost:5173)
3. Click **"Connect Google Calendar"**
4. You should see the Google sign-in popup
5. Choose your account (must be a Test User you added earlier)
6. Click **"Allow"** to grant permissions
7. You should see "Welcome! Calendar connected!" 🎉

### Test creating a task:

8. Click **"+ New Task"**
9. Fill in:
   - Title: "Test task"
   - Due date: Tomorrow
   - Priority: High
10. Click **"Create Task"**
11. Open [Google Calendar](https://calendar.google.com)
12. You should see: `⚡ [BloomTasks] Test task` on tomorrow's date!

---

## Common Issues & Solutions

### Issue 1: "Access blocked: This app's request is invalid"

**Cause:** Your email isn't added as a Test User.

**Fix:**
1. Go to Google Cloud Console → OAuth consent screen
2. Scroll to "Test users"
3. Click "Add Users"
4. Add your email address

---

### Issue 2: "redirect_uri_mismatch"

**Cause:** Your app URL isn't in Authorized JavaScript origins.

**Fix:**
1. Go to Credentials → Edit your OAuth client
2. Make sure these are added:
   - `http://localhost:5173` (for local dev)
   - Your deployed URL like `https://your-app.vercel.app` (no trailing slash!)
3. Save and try again

---

### Issue 3: "Calendar event not created"

**Cause:** Token expired or insufficient permissions.

**Fix:**
1. In BloomTasks, click your profile picture → "Disconnect"
2. Click "Connect Google Calendar" again
3. Make sure you allow **all permissions** (calendar.events, email, profile)

---

### Issue 4: "Origin not allowed to use this API"

**Cause:** Your deployed URL isn't authorized.

**Fix:**
1. Go to Google Cloud Console → Credentials
2. Edit your OAuth 2.0 Client ID
3. Add your production URL (e.g., `https://bloomtasks.vercel.app`)
4. **Important**: Must start with `https://` (not `http://`)

---

## Publishing Your App (Optional)

Right now, only Test Users can use your app. To let anyone connect:

1. Go to **OAuth consent screen**
2. Click **"Publish App"**
3. Click **"Confirm"**
4. (Optional) Submit for Google verification if you want the "Verified" badge

**Note:** Unverified apps show a warning screen but work fine for personal use.

---

## Security Notes

✅ **Safe to share:**
- Your Client ID (it's meant to be public)
- Your deployed app URL

❌ **Never share:**
- Your Client Secret (though browser apps don't use it)
- Access tokens (BloomTasks stores these in browser localStorage, which is standard)

---

## Rate Limits

Google Calendar API free tier:
- **1,000,000 requests/day** (way more than you'll ever need!)
- **10 queries per second** per user

For a personal task manager, you'll never hit these limits.

---

## What Happens When You Connect?

When you click "Connect Google Calendar":

1. **OAuth popup opens** — Google asks you to sign in and grant permissions
2. **Access token received** — BloomTasks gets a temporary token (expires in ~1 hour)
3. **User info fetched** — Your name, email, and profile picture are displayed
4. **Existing tasks synced** — Tasks with due dates are added to your Calendar

When you create a task with a due date:

1. **API call to Google Calendar** — `POST /calendars/primary/events`
2. **Event created** with smart reminders based on priority
3. **Event ID saved** in the task so BloomTasks can update/delete it later

---

## Need More Help?

- [Google Calendar API Documentation](https://developers.google.com/calendar/api/guides/overview)
- [OAuth 2.0 for Web Apps](https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow)

---

You're all set! 🌸✨ Enjoy your smart Calendar-powered task manager!
