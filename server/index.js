import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Replicate from 'replicate';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize OpenRouter for GPT-4
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Initialize Replicate for image generation
let replicate = null;
if (process.env.REPLICATE_API_TOKEN) {
  replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });
}

// Mock AI response for when OpenRouter is not configured
const generateMockSlides = (topic, slideCount) => {
  const slides = [];
  
  // Title slide
  slides.push({
    id: '1',
    type: 'title',
    title: topic,
    subtitle: 'An AI-Generated Presentation',
    layout: 'title',
    imagePrompt: `Professional, modern background image representing ${topic}, high quality, 16:9 aspect ratio`
  });

  // Content slides
  const contentTopics = [
    'Introduction',
    'Key Concepts',
    'Main Points',
    'Analysis',
    'Benefits',
    'Challenges',
    'Solutions',
    'Case Study',
    'Results',
    'Conclusion'
  ];

  for (let i = 1; i < slideCount; i++) {
    const topicIndex = (i - 1) % contentTopics.length;
    const currentTopic = contentTopics[topicIndex];
    slides.push({
      id: String(i + 1),
      type: 'content',
      title: `${currentTopic}: ${topic}`,
      content: [
        `Key point about ${topic.toLowerCase()} related to ${currentTopic.toLowerCase()}`,
        `Important insight that demonstrates understanding`,
        `Supporting detail that adds value`,
        `Conclusion or takeaway for this section`
      ],
      layout: i % 3 === 0 ? 'two-column' : i % 3 === 1 ? 'image-text' : 'content',
      imagePrompt: `Professional illustration of ${currentTopic.toLowerCase()} related to ${topic}, modern design, clean, 16:9 aspect ratio`
    });
  }

  return slides;
};

// Generate presentation with AI using OpenRouter
app.post('/api/generate', async (req, res) => {
  try {
    const { topic, slideCount = 5, tone = 'professional' } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    // If OpenRouter is configured, use it with GPT-4
    if (OPENROUTER_API_KEY) {
      try {
        const systemPrompt = `You are an expert presentation designer. Create a ${tone} presentation about the given topic.

Return ONLY a valid JSON array of slides with this exact structure:
[
  {
    "id": "1",
    "type": "title",
    "title": "Main Title",
    "subtitle": "Subtitle text",
    "layout": "title",
    "imagePrompt": "A detailed description for generating a relevant background image"
  },
  {
    "id": "2",
    "type": "content",
    "title": "Slide Title",
    "content": ["Point 1", "Point 2", "Point 3"],
    "layout": "content",
    "imagePrompt": "Description for slide image"
  }
]

Rules:
- First slide MUST be type "title" with layout "title"
- Content slides should have 3-5 bullet points
- Use layouts: "title", "content", "two-column", "image-text"
- Every 3rd or 4th slide should use "image-text" layout
- Each slide MUST have an "imagePrompt" field with a detailed description for image generation
- Make imagePrompts specific, descriptive, and relevant to the slide content
- Return ONLY the JSON array, no other text`;

        const response = await axios.post(
          OPENROUTER_URL,
          {
            model: 'openai/gpt-4-turbo',
            messages: [
              {
                role: 'system',
                content: systemPrompt
              },
              {
                role: 'user',
                content: `Create a ${slideCount}-slide presentation about: ${topic}`
              }
            ],
            temperature: 0.7,
          },
          {
            headers: {
              'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'http://localhost:3001',
              'X-Title': 'Present99'
            }
          }
        );

        const aiResponse = response.data.choices[0].message.content;
        console.log('OpenRouter response:', aiResponse);
        
        // Try to parse AI response as JSON
        try {
          // Remove markdown code blocks if present
          let jsonStr = aiResponse.trim();
          if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
          } else if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.replace(/```\n?/g, '');
          }
          
          const slides = JSON.parse(jsonStr);
          
          // Ensure all slides have imagePrompts
          slides.forEach((slide, index) => {
            if (!slide.imagePrompt) {
              slide.imagePrompt = `Professional ${tone} image related to ${slide.title}`;
            }
          });
          
          return res.json({ slides });
        } catch (parseError) {
          console.error('Failed to parse AI response:', parseError);
          console.log('Raw response:', aiResponse);
          // Fall back to mock data
          const slides = generateMockSlides(topic, slideCount);
          return res.json({ slides });
        }
      } catch (aiError) {
        console.error('OpenRouter API error:', aiError.response?.data || aiError.message);
        // Fall back to mock data
        const slides = generateMockSlides(topic, slideCount);
        return res.json({ slides });
      }
    } else {
      // No OpenRouter configured, use mock data
      console.log('No OpenRouter API key, using mock data');
      const slides = generateMockSlides(topic, slideCount);
      return res.json({ slides });
    }
  } catch (error) {
    console.error('Error generating presentation:', error);
    res.status(500).json({ error: 'Failed to generate presentation' });
  }
});

// Generate image using Replicate Flux
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, slideId } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (replicate) {
      try {
        console.log(`Generating image for slide ${slideId}: ${prompt}`);
        
        const output = await replicate.run(
          "black-forest-labs/flux-schnell",
          {
            input: {
              prompt: prompt,
              num_outputs: 1,
              aspect_ratio: "16:9",
              output_format: "webp",
              output_quality: 80
            }
          }
        );

        // Flux returns an array of URLs
        const imageUrl = Array.isArray(output) ? output[0] : output;
        
        console.log(`Image generated successfully: ${imageUrl}`);
        return res.json({ imageUrl });
      } catch (replicateError) {
        console.error('Replicate API error:', replicateError);
        return res.status(500).json({ 
          error: 'Failed to generate image',
          details: replicateError.message 
        });
      }
    } else {
      console.log('No Replicate token configured');
      return res.status(503).json({ 
        error: 'Image generation not configured',
        message: 'Set REPLICATE_API_TOKEN to enable image generation'
      });
    }
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

// Batch generate images for all slides
app.post('/api/generate-images-batch', async (req, res) => {
  try {
    const { slides } = req.body;

    if (!slides || !Array.isArray(slides)) {
      return res.status(400).json({ error: 'Slides array is required' });
    }

    if (!replicate) {
      return res.status(503).json({ 
        error: 'Image generation not configured',
        message: 'Set REPLICATE_API_TOKEN to enable image generation'
      });
    }

    const imagePromises = slides.map(async (slide) => {
      if (!slide.imagePrompt) {
        return { slideId: slide.id, imageUrl: null };
      }

      try {
        console.log(`Generating image for slide ${slide.id}: ${slide.imagePrompt.substring(0, 50)}...`);
        
        const output = await replicate.run(
          "black-forest-labs/flux-schnell",
          {
            input: {
              prompt: slide.imagePrompt,
              num_outputs: 1,
              aspect_ratio: "16:9",
              output_format: "webp",
              output_quality: 80
            }
          }
        );

        // Replicate returns an array of URLs or a single URL
        let imageUrl = null;
        if (Array.isArray(output) && output.length > 0) {
          imageUrl = output[0];
        } else if (typeof output === 'string') {
          imageUrl = output;
        } else if (output && output.url) {
          imageUrl = output.url;
        }
        
        console.log(`Image generated for slide ${slide.id}: ${imageUrl ? 'Success' : 'Failed'}`);
        return { slideId: slide.id, imageUrl };
      } catch (error) {
        console.error(`Error generating image for slide ${slide.id}:`, error.message);
        return { slideId: slide.id, imageUrl: null, error: error.message };
      }
    });

    const results = await Promise.all(imagePromises);
    return res.json({ images: results });
  } catch (error) {
    console.error('Error in batch image generation:', error);
    res.status(500).json({ error: 'Failed to generate images' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    openRouterEnabled: !!OPENROUTER_API_KEY,
    replicateEnabled: !!replicate,
    message: OPENROUTER_API_KEY 
      ? 'AI features enabled with OpenRouter' 
      : 'Running with mock data (set OPENROUTER_API_KEY to enable AI)'
  });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🤖 OpenRouter (GPT-4): ${OPENROUTER_API_KEY ? 'ENABLED' : 'DISABLED (using mock data)'}`);
    console.log(`🎨 Replicate (Flux): ${replicate ? 'ENABLED' : 'DISABLED'}`);
    if (!OPENROUTER_API_KEY) {
      console.log('💡 Set OPENROUTER_API_KEY in .env to enable AI content generation');
    }
    if (!replicate) {
      console.log('💡 Set REPLICATE_API_TOKEN in .env to enable AI image generation');
    }
  });
}

// Export for Vercel serverless
export default app;
