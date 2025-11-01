# Vercel Deployment Guide for Present99

## 🚀 Quick Deploy

### Prerequisites:
- ✅ Vercel CLI installed (already done)
- ✅ Vercel account (sign up at vercel.com)
- ✅ Git repository (optional but recommended)

---

## Deployment Strategy

Present99 has two parts:
1. **Frontend (Client)** - React + Vite app
2. **Backend (Server)** - Node.js + Express API

We'll deploy them separately on Vercel.

---

## Step 1: Deploy Backend (API)

```bash
cd server
vercel
```

**Follow prompts**:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? **present99-api**
- Directory? **./server** (or just press Enter)
- Override settings? **N**

**Set Environment Variables**:
```bash
vercel env add OPENROUTER_API_KEY
# Paste your OpenRouter API key

vercel env add REPLICATE_API_TOKEN
# Paste your Replicate token

vercel env add PORT
# Enter: 3001
```

**Redeploy with env vars**:
```bash
vercel --prod
```

**Note the API URL**: `https://present99-api.vercel.app`

---

## Step 2: Update Frontend API URL

Before deploying frontend, update the API URL:

**File**: `client/src/components/HomePage.jsx`

Change:
```javascript
const API_URL = 'http://localhost:3001/api';
```

To:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://present99-api.vercel.app/api';
```

**Create `.env` in client folder**:
```bash
cd ../client
cat > .env << EOF
VITE_API_URL=https://present99-api.vercel.app/api
EOF
```

---

## Step 3: Deploy Frontend

```bash
cd client
vercel
```

**Follow prompts**:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? **present99**
- Directory? **./client** (or just press Enter)
- Override settings? **N**

**Set Environment Variable**:
```bash
vercel env add VITE_API_URL
# Enter: https://present99-api.vercel.app/api
```

**Deploy to production**:
```bash
vercel --prod
```

**Your app URL**: `https://present99.vercel.app`

---

## Alternative: Single Command Deployment

### Deploy Backend:
```bash
cd /Users/altafr/Desktop/present99/server
vercel --prod
```

### Deploy Frontend:
```bash
cd /Users/altafr/Desktop/present99/client
vercel --prod
```

---

## Environment Variables Needed

### Backend (server):
- `OPENROUTER_API_KEY` - Your OpenRouter API key
- `REPLICATE_API_TOKEN` - Your Replicate token
- `PORT` - 3001 (optional)

### Frontend (client):
- `VITE_API_URL` - Your backend API URL

---

## Post-Deployment Setup

### 1. Update CORS in Backend

**File**: `server/index.js`

Update CORS to allow your frontend domain:
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://present99.vercel.app', // Add your frontend URL
    'https://present99-*.vercel.app' // Allow preview deployments
  ],
  credentials: true
}));
```

Redeploy backend:
```bash
cd server
vercel --prod
```

### 2. Test Your Deployment

Visit: `https://present99.vercel.app`

Test:
- ✅ Home page loads
- ✅ Generate presentation
- ✅ Images generate
- ✅ Theme changes work
- ✅ Save/load works
- ✅ Export works

---

## Vercel Dashboard

Access your deployments:
- Frontend: https://vercel.com/dashboard
- Backend: https://vercel.com/dashboard

**Features**:
- View logs
- Manage environment variables
- Configure custom domains
- View analytics
- Rollback deployments

---

## Custom Domain (Optional)

### Add Custom Domain:

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings > Domains
4. Add your domain (e.g., present99.com)
5. Update DNS records as instructed
6. Wait for SSL certificate

---

## Troubleshooting

### Issue: API not connecting

**Solution**:
1. Check CORS settings in backend
2. Verify API URL in frontend .env
3. Check Vercel logs: `vercel logs`

### Issue: Environment variables not working

**Solution**:
```bash
# List env vars
vercel env ls

# Add missing vars
vercel env add VARIABLE_NAME

# Redeploy
vercel --prod
```

### Issue: Build fails

**Solution**:
```bash
# Check build locally first
cd client
npm run build

cd ../server
npm start
```

### Issue: Images not loading

**Solution**:
1. Verify Replicate token is set
2. Check backend logs
3. Ensure CORS allows image URLs

---

## Continuous Deployment

### Connect to Git:

1. Push code to GitHub
2. Import project in Vercel Dashboard
3. Connect repository
4. Set environment variables
5. Deploy automatically on push

**Benefits**:
- Auto-deploy on git push
- Preview deployments for PRs
- Easy rollbacks
- Team collaboration

---

## Monitoring

### Check Logs:
```bash
# Frontend logs
cd client
vercel logs

# Backend logs
cd server
vercel logs
```

### View in Dashboard:
- Real-time logs
- Error tracking
- Performance metrics
- Usage statistics

---

## Cost

**Vercel Free Tier**:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic SSL
- ✅ Preview deployments
- ✅ Serverless functions

**Perfect for Present99!**

---

## Update Deployment

### Update Frontend:
```bash
cd client
# Make changes
vercel --prod
```

### Update Backend:
```bash
cd server
# Make changes
vercel --prod
```

---

## Rollback

```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote <deployment-url>
```

---

## Summary

### Deployment URLs:
- **Frontend**: https://present99.vercel.app
- **Backend**: https://present99-api.vercel.app

### Commands:
```bash
# Deploy backend
cd server && vercel --prod

# Deploy frontend
cd client && vercel --prod

# View logs
vercel logs

# Check status
vercel ls
```

---

## Next Steps After Deployment

1. ✅ Test all features
2. ✅ Add custom domain (optional)
3. ✅ Set up monitoring
4. ✅ Configure analytics
5. ✅ Share with users!

---

**Ready to deploy!** 🚀
