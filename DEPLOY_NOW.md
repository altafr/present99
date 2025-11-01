# 🚀 Deploy Present99 to Vercel NOW

## Quick Start (Easiest Method)

### Option 1: Automated Script
```bash
cd /Users/altafr/Desktop/present99
./deploy.sh
```

This will:
1. Deploy backend
2. Ask for backend URL
3. Deploy frontend automatically

---

## Option 2: Manual Step-by-Step

### Step 1: Deploy Backend (5 minutes)

```bash
cd /Users/altafr/Desktop/present99/server
vercel
```

**Answer prompts**:
- Set up and deploy? → **Y**
- Which scope? → Select your account
- Link to existing project? → **N**
- Project name? → **present99-api**
- Override settings? → **N**

**Copy the deployment URL** (e.g., `https://present99-api-xxxxx.vercel.app`)

**Set environment variables**:
```bash
vercel env add OPENROUTER_API_KEY production
# Paste: sk-or-v1-YOUR_KEY

vercel env add REPLICATE_API_TOKEN production
# Paste: r8_YOUR_TOKEN
```

**Redeploy with env vars**:
```bash
vercel --prod
```

---

### Step 2: Deploy Frontend (3 minutes)

**Update API URL**:
```bash
cd /Users/altafr/Desktop/present99/client
echo "VITE_API_URL=https://present99-api-xxxxx.vercel.app/api" > .env
# Replace with YOUR backend URL
```

**Deploy**:
```bash
vercel
```

**Answer prompts**:
- Set up and deploy? → **Y**
- Which scope? → Select your account
- Link to existing project? → **N**
- Project name? → **present99**
- Override settings? → **N**

**Deploy to production**:
```bash
vercel --prod
```

---

## Option 3: One-Line Commands

### Backend:
```bash
cd /Users/altafr/Desktop/present99/server && vercel --prod
```

### Frontend (after updating .env):
```bash
cd /Users/altafr/Desktop/present99/client && vercel --prod
```

---

## After Deployment

### 1. Test Your App
Visit the frontend URL provided by Vercel

### 2. Update CORS (Important!)

Edit `server/index.js`, find the CORS section and add:
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://present99.vercel.app', // Your frontend URL
    'https://present99-*.vercel.app' // Preview deployments
  ],
  credentials: true
}));
```

Redeploy backend:
```bash
cd server
vercel --prod
```

### 3. Verify Environment Variables

**In Vercel Dashboard**:
1. Go to vercel.com/dashboard
2. Select present99-api project
3. Go to Settings → Environment Variables
4. Verify:
   - ✅ OPENROUTER_API_KEY is set
   - ✅ REPLICATE_API_TOKEN is set

---

## Troubleshooting

### "Command not found: vercel"
```bash
npm install -g vercel
```

### "Not logged in"
```bash
vercel login
```

### "Build failed"
```bash
# Test build locally first
cd client
npm run build

cd ../server
npm start
```

### API not connecting
1. Check CORS settings
2. Verify VITE_API_URL in frontend
3. Check Vercel logs: `vercel logs`

---

## Environment Variables Checklist

### Backend (present99-api):
- [ ] OPENROUTER_API_KEY
- [ ] REPLICATE_API_TOKEN

### Frontend (present99):
- [ ] VITE_API_URL

---

## Quick Reference

### Deploy Backend:
```bash
cd server && vercel --prod
```

### Deploy Frontend:
```bash
cd client && vercel --prod
```

### View Logs:
```bash
vercel logs
```

### List Deployments:
```bash
vercel ls
```

---

## Expected URLs

After deployment, you'll have:
- **Frontend**: `https://present99.vercel.app`
- **Backend**: `https://present99-api.vercel.app`
- **API Endpoint**: `https://present99-api.vercel.app/api`

---

## Ready to Deploy?

Choose your method:
1. **Easiest**: Run `./deploy.sh`
2. **Manual**: Follow Step 1 & 2 above
3. **Quick**: Use one-line commands

**Let's go!** 🚀

---

## Need Help?

See `DEPLOYMENT_GUIDE.md` for detailed instructions and troubleshooting.
