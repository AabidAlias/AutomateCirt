cd smart-cert/frontend

git init
git add .
git commit -m "Initial frontend commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/smart-cert-frontend.git
git push -u origin main
```

---

### Step 3 — Deploy on Vercel

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click **"New Project"**
4. Import `smart-cert-frontend` repo
5. Fill in settings:

| Field | Value |
|-------|-------|
| Framework Preset | **Vite** |
| Root Directory | *(leave empty)* |
| Build Command | `npm run build` |
| Output Directory | `dist` |

6. Click **"Environment Variables"** and add:
```
VITE_API_URL = https://your-backend-name.onrender.com
```
> ⚠️ Replace with your **actual Render backend URL** — find it in Render dashboard

7. Click **Deploy** 🚀

---

### Step 4 — Update FRONTEND_ORIGIN on Render

After Vercel gives you a URL like `https://smart-cert-frontend.vercel.app`:

1. Go to **Render** → your backend service → **Environment**
2. Update:
```
FRONTEND_ORIGIN = https://smart-cert-frontend.vercel.app
