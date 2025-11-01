// Serverless function for batch image generation
import Replicate from 'replicate';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slides } = req.body;

  if (!slides || !Array.isArray(slides)) {
    return res.status(400).json({ error: 'Slides array is required' });
  }

  // Check if Replicate is configured
  if (!process.env.REPLICATE_API_TOKEN) {
    return res.status(503).json({ 
      error: 'Image generation not configured',
      message: 'Set REPLICATE_API_TOKEN to enable image generation'
    });
  }

  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Start predictions for all slides (non-blocking)
    const predictions = [];
    
    for (const slide of slides) {
      if (!slide.imagePrompt) {
        predictions.push({ slideId: slide.id, predictionId: null, status: 'skipped' });
        continue;
      }

      try {
        console.log(`Starting image generation for slide ${slide.id}: ${slide.imagePrompt.substring(0, 50)}...`);
        
        const prediction = await replicate.predictions.create({
          version: "5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637",
          input: {
            prompt: slide.imagePrompt,
            num_outputs: 1,
            aspect_ratio: "16:9",
            output_format: "webp",
            output_quality: 80,
            go_fast: true
          }
        });
        
        predictions.push({ 
          slideId: slide.id, 
          predictionId: prediction.id,
          status: prediction.status
        });
      } catch (error) {
        console.error(`Error starting image generation for slide ${slide.id}:`, error.message);
        predictions.push({ 
          slideId: slide.id, 
          predictionId: null, 
          status: 'failed',
          error: error.message 
        });
      }
    }

    return res.json({ predictions });
  } catch (error) {
    console.error('Error in batch image generation:', error);
    return res.status(500).json({ 
      error: 'Failed to generate images',
      details: error.message 
    });
  }
}
