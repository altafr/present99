# Setup Guide for Present99

## Quick Setup (5 minutes)

### 1. Get OpenRouter API Key (for GPT-4 content generation)

1. Visit [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. Sign up or log in
3. Click "Create Key"
4. Copy your API key
5. Add $5-10 credits (very affordable, ~$0.01-0.02 per presentation)

### 2. Get Replicate API Token (for Flux image generation)

1. Visit [https://replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)
2. Sign up or log in
3. Click "Create token"
4. Copy your token
5. Add billing information (Flux Schnell costs ~$0.003 per image)

### 3. Configure Environment Variables

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and add your keys:
   ```
   OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx
   REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxx
   PORT=3001
   ```

4. Save the file

### 4. Restart the Server

If the server is running, it will auto-restart. Otherwise:

```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3001
🤖 OpenRouter (GPT-4): ENABLED
🎨 Replicate (Flux): ENABLED
```

## Cost Estimation

### Per Presentation (5 slides):
- **Content Generation (GPT-4)**: ~$0.01-0.02
- **Image Generation (Flux)**: ~$0.015 (5 images × $0.003)
- **Total**: ~$0.025-0.035 per presentation

### Monthly Usage (100 presentations):
- **Total Cost**: ~$2.50-3.50/month

Very affordable for professional-quality AI-generated presentations!

## Troubleshooting

### "OpenRouter API error"
- Check your API key is correct
- Ensure you have credits in your OpenRouter account
- Verify the key starts with `sk-or-v1-`

### "Replicate API error"
- Check your token is correct
- Ensure billing is set up on Replicate
- Verify the token starts with `r8_`

### "Image generation not configured"
- Make sure `REPLICATE_API_TOKEN` is set in `.env`
- Restart the server after adding the token

### Server won't start
- Check for syntax errors in `.env`
- Ensure no spaces around the `=` sign
- Make sure quotes are not included in the values

## Testing Without API Keys

The app works perfectly fine without API keys:
- Uses mock data for slide content
- Shows placeholder images instead of generated ones
- Great for testing the UI and features

## Support

For issues:
1. Check the server console for error messages
2. Verify your API keys are valid
3. Ensure you have credits/billing set up
4. Check the README.md for more information
