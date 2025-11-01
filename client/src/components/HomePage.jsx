import { useState } from 'react';
import { Sparkles, Loader2, Presentation } from 'lucide-react';
import axios from 'axios';
import PresentationLibrary from './PresentationLibrary';
import './HomePage.css';

// Use window.location.origin in production to get the full URL
const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (import.meta.env.MODE === 'production') {
    // In production, use the same origin as the frontend
    return `${window.location.origin}/api`;
  }
  return 'http://localhost:3001/api';
};

const API_URL = getApiUrl();

console.log('API_URL configured as:', API_URL);
console.log('Environment mode:', import.meta.env.MODE);
console.log('Window origin:', window.location.origin);

function HomePage({ onCreatePresentation }) {
  const [topic, setTopic] = useState('');
  const [slideCount, setSlideCount] = useState(5);
  const [tone, setTone] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError('');
    setLoadingMessage('Generating slides with AI...');

    try {
      // Generate slides
      console.log('Making API call to:', `${API_URL}/generate`);
      const response = await axios.post(`${API_URL}/generate`, {
        topic: topic.trim(),
        slideCount,
        tone
      });
      console.log('API response received:', response.status);

      const slides = response.data.slides;
      
      // Start with slides without images
      onCreatePresentation(slides, topic);
      
      // Generate images asynchronously
      setLoadingMessage('Starting image generation...');
      generateImagesAsync(slides);
    } catch (err) {
      console.error('Error generating presentation:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url
      });
      setError(`Failed to generate presentation: ${err.response?.data?.error || err.message || 'Server error'}`);
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const handleLoadPresentation = (presentation) => {
    // Pass the existing ID to prevent creating a new one
    onCreatePresentation(presentation.slides, presentation.topic, presentation.id);
  };

  // Async image generation with polling
  const generateImagesAsync = async (slides) => {
    try {
      // Only generate images for layouts that need them
      const imageLayouts = ['image-text', 'big-image'];
      const slidesNeedingImages = slides.filter(slide => 
        imageLayouts.includes(slide.layout) && slide.imagePrompt
      );

      if (slidesNeedingImages.length === 0) {
        console.log('No slides need images');
        return;
      }

      console.log('Starting image generation for', slidesNeedingImages.length, 'slides with image layouts');
      
      // Start image generation only for slides that need images
      const batchResponse = await axios.post(`${API_URL}/generate-images-batch`, {
        slides: slidesNeedingImages
      });

      const predictions = batchResponse.data.predictions;
      console.log('Image predictions started:', predictions);

      // Poll for each image
      predictions.forEach(prediction => {
        if (prediction.predictionId) {
          pollImageStatus(prediction.predictionId, prediction.slideId);
        }
      });
    } catch (error) {
      console.error('Failed to start image generation:', error);
    }
  };

  // Poll for image completion
  const pollImageStatus = async (predictionId, slideId) => {
    const maxAttempts = 30; // 30 attempts = ~60 seconds
    let attempts = 0;

    const poll = async () => {
      try {
        attempts++;
        console.log(`Polling image status for slide ${slideId}, attempt ${attempts}`);
        
        const statusResponse = await axios.get(`${API_URL}/image-status/${predictionId}`);
        const { status, imageUrl, error } = statusResponse.data;

        console.log(`Slide ${slideId} status:`, status);

        if (status === 'succeeded' && imageUrl) {
          console.log(`Image ready for slide ${slideId}:`, imageUrl);
          // Update the slide with the image URL
          updateSlideImage(slideId, imageUrl);
        } else if (status === 'failed') {
          console.error(`Image generation failed for slide ${slideId}:`, error);
        } else if (attempts < maxAttempts) {
          // Still processing, poll again in 2 seconds
          setTimeout(poll, 2000);
        } else {
          console.warn(`Image generation timed out for slide ${slideId}`);
        }
      } catch (error) {
        console.error(`Error polling image status for slide ${slideId}:`, error);
      }
    };

    // Start polling after 3 seconds (give Replicate time to start)
    setTimeout(poll, 3000);
  };

  // Update slide with generated image
  const updateSlideImage = (slideId, imageUrl) => {
    // Trigger a custom event that PresentationEditor can listen to
    window.dispatchEvent(new CustomEvent('slideImageReady', {
      detail: { slideId, imageUrl }
    }));
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-header">
          <div className="logo-section">
            <Presentation size={48} className="logo-icon" />
            <h1>Present99</h1>
          </div>
          <p className="tagline">AI-Powered Presentation Creator</p>
          <p className="subtitle">Create stunning presentations in seconds with artificial intelligence</p>
        </div>

        <PresentationLibrary onLoadPresentation={handleLoadPresentation} />

        <form className="generation-form" onSubmit={handleGenerate}>
          <div className="form-group">
            <label htmlFor="topic">What's your presentation about?</label>
            <input
              id="topic"
              type="text"
              placeholder="e.g., Climate Change, Machine Learning, Marketing Strategy..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="slideCount">Number of Slides</label>
              <select
                id="slideCount"
                value={slideCount}
                onChange={(e) => setSlideCount(Number(e.target.value))}
                disabled={loading}
              >
                <option value={3}>3 slides</option>
                <option value={5}>5 slides</option>
                <option value={7}>7 slides</option>
                <option value={10}>10 slides</option>
                <option value={15}>15 slides</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tone">Tone</label>
              <select
                id="tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                disabled={loading}
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="academic">Academic</option>
                <option value="creative">Creative</option>
                <option value="persuasive">Persuasive</option>
              </select>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="generate-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="spinner" />
                {loadingMessage || 'Generating...'}
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate Presentation
              </>
            )}
          </button>
        </form>

        <div className="features">
          <div className="feature">
            <div className="feature-icon">✨</div>
            <h3>AI-Powered</h3>
            <p>Intelligent content generation tailored to your topic</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🎨</div>
            <h3>Beautiful Layouts</h3>
            <p>Multiple professional templates and designs</p>
          </div>
          <div className="feature">
            <div className="feature-icon">📤</div>
            <h3>Easy Export</h3>
            <p>Download as PDF or share instantly</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
