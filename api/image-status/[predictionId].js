// Serverless function for checking image generation status
import Replicate from 'replicate';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { predictionId } = req.query;

  if (!predictionId) {
    return res.status(400).json({ error: 'Prediction ID is required' });
  }

  // Check if Replicate is configured
  if (!process.env.REPLICATE_API_TOKEN) {
    return res.status(503).json({ 
      error: 'Image generation not configured'
    });
  }

  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.get(predictionId);
    
    if (prediction.status === 'succeeded') {
      const imageUrl = Array.isArray(prediction.output) 
        ? prediction.output[0] 
        : prediction.output;
      
      return res.json({ 
        status: 'succeeded',
        imageUrl: imageUrl
      });
    } else if (prediction.status === 'failed') {
      return res.json({ 
        status: 'failed',
        error: prediction.error
      });
    } else {
      return res.json({ 
        status: prediction.status // processing, starting, etc.
      });
    }
  } catch (error) {
    console.error('Error checking image status:', error);
    return res.status(500).json({ 
      error: 'Failed to check image status',
      details: error.message 
    });
  }
}
