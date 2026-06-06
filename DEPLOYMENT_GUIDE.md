# 🚀 Deployment Guide — BloomTasks

## Deploy to Vercel (Recommended, Free)

### Prerequisites
- GitHub account
- Vercel account (sign up free at [vercel.com](https://vercel.com))
- Your Google OAuth Client ID ready

---

## Step-by-Step Deployment

### 1. Push to GitHub

```bash
cd bloomtasks
git init
git add .
git commit -m "Initial commit: BloomTasks app"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/bloomtasks.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"New Project"**
3. Import your `bloomtasks` repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
5. **Add Environment Variable**:
   - Key: `VITE_GOOGLE_CLIENT_ID`
   - Value: Your Google OAuth Client ID from Google Cloud Console
6. Click **"Deploy"**

Wait 1-2 minutes — your app will be live at `https://your-app.vercel.app` 🎉

### 3. Update Google Cloud Console

Your app is now live, but Google Calendar won't work yet. You need to authorize your production URL:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your BloomTasks project
3. Go to **APIs & Services → Credentials**
4. Click on your OAuth 2.0 Client ID
5. Under **Authorized JavaScript origins**, click **"+ ADD URI"**
6. Add your Vercel URL: `https://your-app.vercel.app`
   - **Important**: Use `https://` (not `http://`)
   - **No trailing slash**
7. Click **Save**

**Done!** Visit your Vercel URL and test the Google Calendar connection 🌸

---

## Deploy to Netlify (Alternative)

### 1. Push to GitHub (same as above)

### 2. Deploy on Netlify

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click **"Add new site" → Import an existing project**
3. Choose GitHub and select your `bloomtasks` repo
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Add environment variable**:
     - Key: `VITE_GOOGLE_CLIENT_ID`
     - Value: Your Google OAuth Client ID
5. Click **"Deploy site"**

Your app will be live at `https://random-name.netlify.app`

### 3. Update Google Cloud Console

Same as Vercel — add your Netlify URL to **Authorized JavaScript origins**:
- `https://random-name.netlify.app`

---

## Environment Variables Explained

| Variable | Where to get it | Required |
|----------|----------------|----------|
| `VITE_GOOGLE_CLIENT_ID` | Google Cloud Console → Credentials | ✅ Yes |

**Why `VITE_` prefix?**  
Vite exposes env vars to the browser only if they start with `VITE_`. This is a security feature.

---

## Custom Domain (Optional)

### On Vercel:
1. Go to your project dashboard → **Settings → Domains**
2. Add your custom domain (e.g., `bloomtasks.com`)
3. Update your DNS records as instructed by Vercel
4. **Important**: Add your custom domain to Google Cloud Console's **Authorized JavaScript origins**

### On Netlify:
1. Go to **Domain settings → Add custom domain**
2. Follow DNS instructions
3. Add custom domain to Google OAuth origins

---

## Troubleshooting Deployment Issues

### Issue: "Origin not allowed" error when connecting Google Calendar

**Fix**: Make sure your deployed URL is added to **Authorized JavaScript origins** in Google Cloud Console. Common mistakes:
- ❌ `https://your-app.vercel.app/` (trailing slash)
- ❌ `http://your-app.vercel.app` (http instead of https)
- ✅ `https://your-app.vercel.app` (correct)

### Issue: Environment variable not working

**Fix**: 
- Make sure it's named `VITE_GOOGLE_CLIENT_ID` (with the `VITE_` prefix)
- Redeploy after adding env vars (Vercel/Netlify need to rebuild)

### Issue: "Access blocked: This app's request is invalid"

**Fix**: In Google Cloud Console → OAuth consent screen:
- Make sure your email is added as a **Test User**
- Or publish the app (switch from Testing to Production)

---

## Cost

- ✅ **Vercel Free Tier**: 100GB bandwidth/month, unlimited projects
- ✅ **Netlify Free Tier**: 100GB bandwidth/month, 300 build minutes/month
- ✅ **Google Calendar API**: Free (up to 1 million requests/day)

Both Vercel and Netlify are **completely free** for personal projects like this!

---

## Post-Deployment Checklist

- [ ] App deployed and accessible at your URL
- [ ] Environment variable `VITE_GOOGLE_CLIENT_ID` added
- [ ] Deployed URL added to Google Cloud Console **Authorized JavaScript origins**
- [ ] Tested "Connect Google Calendar" button on deployed site
- [ ] Created a task with due date and verified it appears in Google Calendar
- [ ] Checked that Calendar reminders trigger at correct times

---

## Need Help?

If you run into issues:
1. Check browser console for errors (F12 → Console tab)
2. Verify your Google OAuth Client ID is correct
3. Confirm your deployed URL is in Authorized JavaScript origins
4. Make sure you're added as a Test User in OAuth consent screen

Happy deploying! 🌸✨
