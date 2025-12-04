# Deployment Guide

This guide covers deploying the Task Manager application to production.

## Architecture Overview

- **Frontend**: Deploy to Vercel or Netlify (static hosting)
- **Backend**: Deploy to Railway, Render, or Fly.io (Node.js hosting)
- **Database**: MongoDB Atlas (cloud MongoDB)

---

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and a new cluster
3. Create a database user with password
4. Whitelist IP addresses (use `0.0.0.0/0` to allow all for simplicity)
5. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/taskmanager?retryWrites=true&w=majority
   ```

---

## Step 2: Deploy Backend

### Option A: Deploy to Railway

1. Go to [Railway](https://railway.app) and sign up
2. Click "New Project" > "Deploy from GitHub repo"
3. Select your repository and the `backend` folder
4. Add environment variables:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-production-secret-key
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   PORT=5000
   ```
5. Railway will auto-detect Node.js and deploy
6. Copy the generated URL (e.g., `https://your-app.railway.app`)

### Option B: Deploy to Render

1. Go to [Render](https://render.com) and sign up
2. Click "New" > "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables (same as Railway)
6. Deploy and copy the URL

### Option C: Deploy to Fly.io

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Navigate to backend folder and run:
   ```bash
   cd backend
   fly launch
   ```
4. Set secrets:
   ```bash
   fly secrets set MONGODB_URI="mongodb+srv://..."
   fly secrets set JWT_SECRET="your-production-secret-key"
   fly secrets set JWT_EXPIRES_IN="7d"
   fly secrets set NODE_ENV="production"
   ```
5. Deploy: `fly deploy`

---

## Step 3: Deploy Frontend to Vercel

### Method 1: Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Navigate to frontend folder:
   ```bash
   cd frontend
   ```

3. Create production environment file:
   ```bash
   echo "VITE_API_URL=https://your-backend-url.railway.app/api" > .env.production
   ```

4. Deploy:
   ```bash
   vercel
   ```

5. For production deployment:
   ```bash
   vercel --prod
   ```

### Method 2: Vercel Dashboard

1. Go to [Vercel](https://vercel.com) and sign up
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```
6. Click "Deploy"

### Vercel Configuration File

Create `frontend/vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

---

## Step 4: Deploy Frontend to Netlify

### Method 1: Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Navigate to frontend folder:
   ```bash
   cd frontend
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Deploy:
   ```bash
   netlify deploy --prod --dir=dist
   ```

### Method 2: Netlify Dashboard

1. Go to [Netlify](https://netlify.com) and sign up
2. Click "Add new site" > "Import an existing project"
3. Connect your GitHub repository
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```
6. Click "Deploy site"

### Netlify Configuration File

Create `frontend/netlify.toml`:
```toml
[build]
  base = "frontend"
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Step 5: Seed Admin User in Production

After deploying the backend, seed the admin user:

### Option 1: Railway/Render Console

Use the web console to run:
```bash
npm run seed
```

### Option 2: Local with Production Database

```bash
cd backend
MONGODB_URI="mongodb+srv://..." npm run seed
```

---

## Environment Variables Summary

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager
JWT_SECRET=your-very-long-random-secret-key-at-least-32-characters
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=5000
```

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-url.railway.app/api
```

---

## CORS Configuration (if needed)

If you encounter CORS errors, update `backend/server.js`:

```javascript
import cors from 'cors';

app.use(cors({
  origin: [
    'https://your-frontend.vercel.app',
    'https://your-frontend.netlify.app',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

---

## Post-Deployment Checklist

- [ ] MongoDB Atlas cluster is running
- [ ] Backend is deployed and accessible
- [ ] Frontend is deployed and accessible
- [ ] Environment variables are set correctly
- [ ] Admin user is seeded
- [ ] CORS is configured for frontend domain
- [ ] Test login with admin@example.com / Admin123
- [ ] Test creating, editing, and deleting tasks
- [ ] Test theme toggle persistence
- [ ] Test pagination

---

## Troubleshooting

### "Network Error" on frontend
- Check if VITE_API_URL is correct
- Verify backend is running
- Check CORS configuration

### "Invalid credentials" error
- Run the seed script on production database
- Verify MONGODB_URI is correct

### Build fails on Vercel/Netlify
- Check Node.js version (should be 18+)
- Verify all dependencies are in package.json
- Check build logs for specific errors

### MongoDB connection fails
- Whitelist all IPs in MongoDB Atlas (0.0.0.0/0)
- Verify connection string format
- Check username/password are correct

---

## Cost Estimates (Free Tiers)

| Service | Free Tier |
|---------|-----------|
| MongoDB Atlas | 512MB storage |
| Railway | $5 credit/month |
| Render | 750 hours/month |
| Fly.io | 3 shared VMs |
| Vercel | 100GB bandwidth |
| Netlify | 100GB bandwidth |

All services offer generous free tiers suitable for small applications.
