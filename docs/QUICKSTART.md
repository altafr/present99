# 🚀 Quick Start Guide

## Get Started in 3 Steps

### Step 1: Start the Application (Already Running!)

Your application is already running at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

### Step 2: Try It Out (Without API Keys)

1. Open http://localhost:5173 in your browser
2. Enter a topic (e.g., "Artificial Intelligence")
3. Select number of slides (5 is good to start)
4. Choose a tone (Professional)
5. Click "Generate Presentation"

The app will work with **mock data** - you'll see placeholder content and images.

### Step 3: Enable Full AI Features (Optional)

To get **real AI-generated content and images**:

#### A. Get API Keys (5 minutes)

**OpenRouter (for content):**
1. Go to https://openrouter.ai/keys
2. Sign up and create a key
3. Add $5 credits (~200 presentations)

**Replicate (for images):**
1. Go to https://replicate.com/account/api-tokens
2. Sign up and create a token
3. Add billing info

#### B. Configure

1. Create `server/.env`:
   ```bash
   cd server
   cp .env.example .env
   ```

2. Edit `server/.env`:
   ```
   OPENROUTER_API_KEY=sk-or-v1-your-key-here
   REPLICATE_API_TOKEN=r8_your-token-here
   PORT=3001
   ```

3. Server will auto-restart and show:
   ```
   🤖 OpenRouter (GPT-4): ENABLED
   🎨 Replicate (Flux): ENABLED
   ```

4. Refresh your browser and generate a new presentation!

## 🎯 What You'll Get

### With Mock Data (Free)
- ✅ Functional presentation editor
- ✅ Multiple layouts
- ✅ PDF export
- ✅ Basic content structure
- ❌ No AI-generated content
- ❌ No images

### With Full AI (Paid)
- ✅ Everything above, plus:
- ✅ GPT-4 generated content tailored to your topic
- ✅ AI-generated images for every slide
- ✅ Professional, contextual content
- ✅ Beautiful, relevant imagery
- 💰 Cost: ~$0.03 per presentation

## 📖 Usage Tips

1. **Be Specific**: "Machine Learning in Healthcare" is better than "ML"
2. **Choose the Right Tone**: 
   - Professional: Business presentations
   - Academic: Research or educational
   - Creative: Marketing or design
   - Casual: Internal team meetings
3. **Start Small**: Try 5 slides first, then scale up
4. **Edit After**: Use the editor to refine AI-generated content
5. **Export**: Click "Export PDF" when done

## 🎨 Features to Try

- **Change Layouts**: Click the layout button to switch slide styles
- **Edit Content**: Use the right sidebar to modify text
- **Add Slides**: Click + to add new slides
- **Navigate**: Use arrows or thumbnails to move between slides
- **Delete**: Click trash icon to remove slides

## 💡 Pro Tips

1. **Image-Text Layout**: Perfect for slides that need visual support
2. **Two-Column**: Great for comparisons or pros/cons
3. **Title Slide**: Always start with this for a professional look
4. **Content Slides**: Keep 3-5 bullet points per slide

## 🆘 Need Help?

- **Server not responding?** Check if both terminals are running
- **Images not generating?** Verify your Replicate token
- **Content seems generic?** Add your API keys for real AI
- **More questions?** Check README.md or SETUP_GUIDE.md

## 🎉 You're Ready!

Start creating amazing presentations with AI! 

**Next Steps:**
1. Try generating a presentation about your favorite topic
2. Experiment with different layouts
3. Export your first PDF
4. Set up API keys for full AI power

Happy presenting! 🎊
