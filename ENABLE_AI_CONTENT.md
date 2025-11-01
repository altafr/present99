# Enable Real AI Content Generation

## Current Status: ❌ Using Mock Data

Your system is currently generating **sample/mock content** instead of real AI-generated content from GPT-4.

**Health Check Result:**
```json
{
  "openRouterEnabled": false,
  "replicateEnabled": true,
  "message": "Running with mock data (set OPENROUTER_API_KEY to enable AI)"
}
```

---

## ✅ How to Enable GPT-4 Content Generation

### Step 1: Get OpenRouter API Key

1. Visit: https://openrouter.ai/keys
2. Sign up or log in
3. Click "Create Key"
4. Copy your API key (starts with `sk-or-v1-`)
5. Add credits to your account ($5-10 is plenty)

### Step 2: Configure the API Key

**Option A: Edit existing .env file**
```bash
cd /Users/altafr/Desktop/present99/server

# Edit the .env file
nano .env
# or
code .env
```

Add this line:
```
OPENROUTER_API_KEY=sk-or-v1-YOUR_KEY_HERE
```

**Option B: Create .env from scratch**
```bash
cd /Users/altafr/Desktop/present99/server

cat > .env << 'EOF'
# OpenRouter API Key for GPT-4 content generation
OPENROUTER_API_KEY=sk-or-v1-YOUR_KEY_HERE

# Replicate API Token for Flux image generation (already working)
REPLICATE_API_TOKEN=r8_YOUR_TOKEN_HERE

# Server Port
PORT=3001
EOF
```

### Step 3: Restart the Server

The server will auto-restart if you're using `npm run dev`, or manually restart:

```bash
cd /Users/altafr/Desktop/present99/server
npm run dev
```

### Step 4: Verify AI is Enabled

Check the server logs - you should see:
```
🚀 Server running on http://localhost:3001
🤖 OpenRouter (GPT-4): ENABLED
🎨 Replicate (Flux): ENABLED
```

Or test the health endpoint:
```bash
curl http://localhost:3001/api/health
```

Should return:
```json
{
  "openRouterEnabled": true,
  "replicateEnabled": true,
  "message": "AI features enabled with OpenRouter"
}
```

---

## 🎯 What Changes After Enabling

### Before (Mock Data):
```javascript
// Generic sample content
{
  "title": "Introduction: Test Topic",
  "content": [
    "Key point about test topic related to introduction",
    "Important insight that demonstrates understanding",
    "Supporting detail that adds value"
  ]
}
```

### After (Real AI with GPT-4):
```javascript
// Topic-specific, intelligent content
{
  "title": "The Evolution of Artificial Intelligence",
  "content": [
    "AI has transformed from rule-based systems to neural networks",
    "Machine learning enables computers to learn from data patterns",
    "Deep learning architectures power modern AI applications",
    "Natural language processing bridges human-computer communication"
  ]
}
```

---

## 💰 Cost Information

**Per Presentation (5 slides):**
- Content Generation (GPT-4): ~$0.01-0.02
- Image Generation (Flux): ~$0.015 (already enabled)
- **Total**: ~$0.025-0.035 per presentation

**Very affordable** for professional AI-generated presentations!

---

## 🧪 Test After Enabling

Run this to verify AI is working:

```bash
# Test the API
cd /Users/altafr/Desktop/present99/server
npm test

# Or manually test
curl -X POST http://localhost:3001/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Quantum Computing",
    "slideCount": 5,
    "tone": "professional"
  }'
```

You should see **real, contextual content** about Quantum Computing, not generic sample text.

---

## 🔍 How to Tell if AI is Working

### Mock Data (Current):
- Generic, template-like content
- Same structure for all topics
- Content says "Key point about [topic]..."
- Not very specific or detailed

### Real AI (After Setup):
- Specific, detailed content
- Unique for each topic
- Professional, well-written
- Contextually relevant
- Varied layouts and structures

---

## ⚠️ Important Notes

1. **Keep your API key secret** - Never commit `.env` to git
2. **Monitor usage** - Check OpenRouter dashboard for costs
3. **Start small** - Test with 3-5 slides first
4. **Fallback works** - If API fails, system uses mock data
5. **Images still work** - Replicate is already enabled

---

## 🆘 Troubleshooting

### "OpenRouter API error"
- Check your API key is correct (starts with `sk-or-v1-`)
- Ensure you have credits in your OpenRouter account
- Verify no typos in the key

### "Still using mock data"
- Restart the server after adding the key
- Check `.env` file is in `/server` directory
- Verify no spaces around the `=` sign
- Check server logs for error messages

### "Invalid API key"
- Generate a new key at https://openrouter.ai/keys
- Make sure you copied the entire key
- Check for extra spaces or line breaks

---

## ✅ Quick Setup Command

Copy and paste this (replace YOUR_KEY):

```bash
cd /Users/altafr/Desktop/present99/server
echo "OPENROUTER_API_KEY=sk-or-v1-YOUR_KEY_HERE" >> .env
echo "PORT=3001" >> .env
npm run dev
```

Then check the logs for "OpenRouter (GPT-4): ENABLED" ✓

---

**Need help?** Check `SETUP_GUIDE.md` for detailed instructions.
