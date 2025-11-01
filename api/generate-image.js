// Serverless function for generating a single image
import Replicate from 'replicate';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, slideId } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Check if Replicate is configured
  if (!process.env.REPLICATE_API_TOKEN) {
    console.log('No Replicate token configured');
    return res.status(503).json({ 
      error: 'Image generation not configured',
      message: 'Set REPLICATE_API_TOKEN to enable image generation'
    });
  }

  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    console.log(`Generating image for slide ${slideId}: ${prompt}`);
    
    // Use predictions.create for better control
    const prediction = await replicate.predictions.create({
      version: "5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637",
      input: {
        prompt: prompt,
        num_outputs: 1,
        aspect_ratio: "16:9",
        output_format: "webp",
        output_quality: 80,
        go_fast: true
      }
    });

    console.log(`Prediction created: ${prediction.id}`);

    // Return prediction ID for client-side polling
    return res.json({ 
      predictionId: prediction.id,
      status: prediction.status,
      slideId: slideId
    });
  } catch (error) {
    console.error('Replicate API error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate image',
      details: error.message 
    });
  }
}
