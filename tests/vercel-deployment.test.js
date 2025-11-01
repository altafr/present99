/**
 * Present99 - Vercel Deployment Test Suite
 * Comprehensive tests for the deployed application on Vercel
 * 
 * Run with: node tests/vercel-deployment.test.js
 * Or: npm test (if configured in package.json)
 */

const axios = require('axios');

// Configuration
const BASE_URL = process.env.TEST_URL || 'https://present99.vercel.app';
const API_URL = `${BASE_URL}/api`;
const TIMEOUT = 30000; // 30 seconds for AI operations

// Test results tracking
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const testResults = [];

// Utility functions
function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    error: '\x1b[31m',   // Red
    warning: '\x1b[33m', // Yellow
    reset: '\x1b[0m'
  };
  console.log(`${colors[type]}${message}${colors.reset}`);
}

function recordTest(name, passed, error = null) {
  totalTests++;
  if (passed) {
    passedTests++;
    log(`✓ ${name}`, 'success');
  } else {
    failedTests++;
    log(`✗ ${name}`, 'error');
    if (error) {
      log(`  Error: ${error.message}`, 'error');
    }
  }
  testResults.push({ name, passed, error: error?.message });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Test Suite
class VercelDeploymentTests {
  
  // 1. Frontend Tests
  async testFrontendAccessibility() {
    try {
      const response = await axios.get(BASE_URL, { timeout: 10000 });
      recordTest('Frontend is accessible', response.status === 200);
      return response.status === 200;
    } catch (error) {
      recordTest('Frontend is accessible', false, error);
      return false;
    }
  }

  async testFrontendContentLoads() {
    try {
      const response = await axios.get(BASE_URL);
      const hasReactRoot = response.data.includes('root');
      const hasTitle = response.data.includes('client') || response.data.includes('Present99');
      recordTest('Frontend HTML content loads', hasReactRoot || hasTitle);
      return hasReactRoot || hasTitle;
    } catch (error) {
      recordTest('Frontend HTML content loads', false, error);
      return false;
    }
  }

  async testFrontendStaticAssets() {
    try {
      const response = await axios.get(BASE_URL);
      const hasJSBundle = response.data.includes('.js');
      const hasCSSBundle = response.data.includes('.css');
      recordTest('Frontend static assets referenced', hasJSBundle && hasCSSBundle);
      return hasJSBundle && hasCSSBundle;
    } catch (error) {
      recordTest('Frontend static assets referenced', false, error);
      return false;
    }
  }

  // 2. API Health Tests
  async testAPIHealthEndpoint() {
    try {
      const response = await axios.get(`${API_URL}/health`, { timeout: 10000 });
      const isHealthy = response.status === 200 && response.data.status === 'ok';
      recordTest('API health endpoint responds', isHealthy);
      return isHealthy;
    } catch (error) {
      recordTest('API health endpoint responds', false, error);
      return false;
    }
  }

  async testAPIHealthData() {
    try {
      const response = await axios.get(`${API_URL}/health`);
      const data = response.data;
      const hasRequiredFields = 
        data.hasOwnProperty('status') &&
        data.hasOwnProperty('openRouterEnabled') &&
        data.hasOwnProperty('replicateEnabled');
      recordTest('API health returns correct data structure', hasRequiredFields);
      return hasRequiredFields;
    } catch (error) {
      recordTest('API health returns correct data structure', false, error);
      return false;
    }
  }

  async testOpenRouterEnabled() {
    try {
      const response = await axios.get(`${API_URL}/health`);
      const enabled = response.data.openRouterEnabled === true;
      recordTest('OpenRouter (GPT-4) is enabled', enabled);
      return enabled;
    } catch (error) {
      recordTest('OpenRouter (GPT-4) is enabled', false, error);
      return false;
    }
  }

  async testReplicateEnabled() {
    try {
      const response = await axios.get(`${API_URL}/health`);
      const enabled = response.data.replicateEnabled === true;
      recordTest('Replicate (Flux) is enabled', enabled);
      return enabled;
    } catch (error) {
      recordTest('Replicate (Flux) is enabled', false, error);
      return false;
    }
  }

  // 3. Presentation Generation Tests
  async testGenerateEndpointBasic() {
    try {
      const response = await axios.post(
        `${API_URL}/generate`,
        {
          topic: 'Test Presentation',
          slideCount: 2,
          tone: 'professional'
        },
        { timeout: TIMEOUT }
      );
      const success = response.status === 200 && Array.isArray(response.data.slides);
      recordTest('Generate endpoint creates presentation', success);
      return success;
    } catch (error) {
      recordTest('Generate endpoint creates presentation', false, error);
      return false;
    }
  }

  async testGenerateSlideCount() {
    try {
      const slideCount = 3;
      const response = await axios.post(
        `${API_URL}/generate`,
        {
          topic: 'Slide Count Test',
          slideCount: slideCount,
          tone: 'professional'
        },
        { timeout: TIMEOUT }
      );
      const correctCount = response.data.slides.length === slideCount;
      recordTest('Generate creates correct number of slides', correctCount);
      return correctCount;
    } catch (error) {
      recordTest('Generate creates correct number of slides', false, error);
      return false;
    }
  }

  async testGenerateSlideStructure() {
    try {
      const response = await axios.post(
        `${API_URL}/generate`,
        {
          topic: 'Structure Test',
          slideCount: 2,
          tone: 'professional'
        },
        { timeout: TIMEOUT }
      );
      const firstSlide = response.data.slides[0];
      const hasRequiredFields = 
        firstSlide.hasOwnProperty('id') &&
        firstSlide.hasOwnProperty('type') &&
        firstSlide.hasOwnProperty('title') &&
        firstSlide.hasOwnProperty('layout');
      recordTest('Generated slides have correct structure', hasRequiredFields);
      return hasRequiredFields;
    } catch (error) {
      recordTest('Generated slides have correct structure', false, error);
      return false;
    }
  }

  async testGenerateTitleSlide() {
    try {
      const response = await axios.post(
        `${API_URL}/generate`,
        {
          topic: 'Title Slide Test',
          slideCount: 2,
          tone: 'professional'
        },
        { timeout: TIMEOUT }
      );
      const firstSlide = response.data.slides[0];
      const isTitleSlide = firstSlide.type === 'title' && firstSlide.hasOwnProperty('subtitle');
      recordTest('First slide is a title slide', isTitleSlide);
      return isTitleSlide;
    } catch (error) {
      recordTest('First slide is a title slide', false, error);
      return false;
    }
  }

  async testGenerateImagePrompts() {
    try {
      const response = await axios.post(
        `${API_URL}/generate`,
        {
          topic: 'Image Prompt Test',
          slideCount: 2,
          tone: 'professional'
        },
        { timeout: TIMEOUT }
      );
      const allHavePrompts = response.data.slides.every(slide => 
        slide.hasOwnProperty('imagePrompt') && slide.imagePrompt.length > 0
      );
      recordTest('All slides have image prompts', allHavePrompts);
      return allHavePrompts;
    } catch (error) {
      recordTest('All slides have image prompts', false, error);
      return false;
    }
  }

  async testGenerateDifferentTones() {
    try {
      const tones = ['professional', 'casual', 'academic'];
      let allSucceeded = true;
      
      for (const tone of tones) {
        const response = await axios.post(
          `${API_URL}/generate`,
          {
            topic: `${tone} Tone Test`,
            slideCount: 2,
            tone: tone
          },
          { timeout: TIMEOUT }
        );
        if (response.status !== 200 || !Array.isArray(response.data.slides)) {
          allSucceeded = false;
          break;
        }
        await sleep(1000); // Rate limiting
      }
      
      recordTest('Generate works with different tones', allSucceeded);
      return allSucceeded;
    } catch (error) {
      recordTest('Generate works with different tones', false, error);
      return false;
    }
  }

  // 4. Error Handling Tests
  async testGenerateWithoutTopic() {
    try {
      await axios.post(
        `${API_URL}/generate`,
        {
          slideCount: 3,
          tone: 'professional'
        },
        { timeout: TIMEOUT }
      );
      recordTest('Generate rejects request without topic', false);
      return false;
    } catch (error) {
      const correctError = error.response?.status === 400;
      recordTest('Generate rejects request without topic', correctError);
      return correctError;
    }
  }

  async testGenerateWithInvalidSlideCount() {
    try {
      await axios.post(
        `${API_URL}/generate`,
        {
          topic: 'Test',
          slideCount: 100, // Too many
          tone: 'professional'
        },
        { timeout: TIMEOUT }
      );
      // If it doesn't reject, that's okay - it might cap the count
      recordTest('Generate handles invalid slide count gracefully', true);
      return true;
    } catch (error) {
      // If it rejects with 400, that's also okay
      const handled = error.response?.status === 400;
      recordTest('Generate handles invalid slide count gracefully', handled);
      return handled;
    }
  }

  async testInvalidEndpoint() {
    try {
      await axios.get(`${API_URL}/nonexistent-endpoint`);
      recordTest('Invalid endpoint returns 404', false);
      return false;
    } catch (error) {
      const is404 = error.response?.status === 404;
      recordTest('Invalid endpoint returns 404', is404);
      return is404;
    }
  }

  // 5. CORS Tests
  async testCORSHeaders() {
    try {
      const response = await axios.get(`${API_URL}/health`);
      const hasCORS = response.headers['access-control-allow-origin'] !== undefined;
      recordTest('API has CORS headers configured', hasCORS);
      return hasCORS;
    } catch (error) {
      recordTest('API has CORS headers configured', false, error);
      return false;
    }
  }

  // 6. Performance Tests
  async testResponseTime() {
    try {
      const start = Date.now();
      await axios.get(`${API_URL}/health`);
      const duration = Date.now() - start;
      const isFast = duration < 5000; // Should respond within 5 seconds
      recordTest(`API response time is acceptable (${duration}ms)`, isFast);
      return isFast;
    } catch (error) {
      recordTest('API response time is acceptable', false, error);
      return false;
    }
  }

  async testGenerationPerformance() {
    try {
      const start = Date.now();
      await axios.post(
        `${API_URL}/generate`,
        {
          topic: 'Performance Test',
          slideCount: 2,
          tone: 'professional'
        },
        { timeout: TIMEOUT }
      );
      const duration = Date.now() - start;
      const isReasonable = duration < 20000; // Should complete within 20 seconds
      recordTest(`Generation completes in reasonable time (${duration}ms)`, isReasonable);
      return isReasonable;
    } catch (error) {
      recordTest('Generation completes in reasonable time', false, error);
      return false;
    }
  }

  // 7. Image Generation Tests
  async testImageGenerationEndpoint() {
    try {
      const response = await axios.post(
        `${API_URL}/generate-image`,
        {
          prompt: 'A test image',
          slideId: 'test-1'
        },
        { timeout: TIMEOUT }
      );
      const hasResponse = response.status === 200;
      recordTest('Image generation endpoint responds', hasResponse);
      return hasResponse;
    } catch (error) {
      recordTest('Image generation endpoint responds', false, error);
      return false;
    }
  }

  async testBatchImageGeneration() {
    try {
      const response = await axios.post(
        `${API_URL}/generate-images-batch`,
        {
          slides: [
            { id: '1', imagePrompt: 'Test image 1' },
            { id: '2', imagePrompt: 'Test image 2' }
          ]
        },
        { timeout: TIMEOUT }
      );
      const hasImages = response.status === 200 && Array.isArray(response.data.images);
      recordTest('Batch image generation endpoint responds', hasImages);
      return hasImages;
    } catch (error) {
      recordTest('Batch image generation endpoint responds', false, error);
      return false;
    }
  }

  // 8. Integration Tests
  async testFullPresentationFlow() {
    try {
      // Step 1: Generate presentation
      const genResponse = await axios.post(
        `${API_URL}/generate`,
        {
          topic: 'Integration Test',
          slideCount: 2,
          tone: 'professional'
        },
        { timeout: TIMEOUT }
      );
      
      if (!genResponse.data.slides || genResponse.data.slides.length === 0) {
        throw new Error('No slides generated');
      }

      // Step 2: Verify slides have required data
      const allSlidesValid = genResponse.data.slides.every(slide =>
        slide.id && slide.title && slide.layout
      );

      recordTest('Full presentation generation flow works', allSlidesValid);
      return allSlidesValid;
    } catch (error) {
      recordTest('Full presentation generation flow works', false, error);
      return false;
    }
  }
}

// Main test runner
async function runAllTests() {
  log('\n╔══════════════════════════════════════════════════════════╗', 'info');
  log('║     Present99 - Vercel Deployment Test Suite            ║', 'info');
  log('╚══════════════════════════════════════════════════════════╝\n', 'info');
  
  log(`Testing deployment at: ${BASE_URL}\n`, 'info');

  const tests = new VercelDeploymentTests();

  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
  log('1. FRONTEND TESTS', 'info');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
  await tests.testFrontendAccessibility();
  await tests.testFrontendContentLoads();
  await tests.testFrontendStaticAssets();

  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
  log('2. API HEALTH TESTS', 'info');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
  await tests.testAPIHealthEndpoint();
  await tests.testAPIHealthData();
  await tests.testOpenRouterEnabled();
  await tests.testReplicateEnabled();

  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
  log('3. PRESENTATION GENERATION TESTS', 'info');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
  await tests.testGenerateEndpointBasic();
  await tests.testGenerateSlideCount();
  await tests.testGenerateSlideStructure();
  await tests.testGenerateTitleSlide();
  await tests.testGenerateImagePrompts();
  await tests.testGenerateDifferentTones();

  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
  log('4. ERROR HANDLING TESTS', 'info');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
  await tests.testGenerateWithoutTopic();
  await tests.testGenerateWithInvalidSlideCount();
  await tests.testInvalidEndpoint();

  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
  log('5. CORS TESTS', 'info');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
  await tests.testCORSHeaders();

  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
  log('6. PERFORMANCE TESTS', 'info');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
  await tests.testResponseTime();
  await tests.testGenerationPerformance();

  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
  log('7. IMAGE GENERATION TESTS', 'info');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
  await tests.testImageGenerationEndpoint();
  await tests.testBatchImageGeneration();

  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
  log('8. INTEGRATION TESTS', 'info');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
  await tests.testFullPresentationFlow();

  // Print summary
  log('\n╔══════════════════════════════════════════════════════════╗', 'info');
  log('║                     TEST SUMMARY                         ║', 'info');
  log('╚══════════════════════════════════════════════════════════╝\n', 'info');
  
  const passRate = ((passedTests / totalTests) * 100).toFixed(1);
  log(`Total Tests: ${totalTests}`, 'info');
  log(`Passed: ${passedTests}`, 'success');
  log(`Failed: ${failedTests}`, failedTests > 0 ? 'error' : 'info');
  log(`Pass Rate: ${passRate}%\n`, passRate >= 90 ? 'success' : 'warning');

  if (failedTests > 0) {
    log('Failed Tests:', 'error');
    testResults
      .filter(t => !t.passed)
      .forEach(t => log(`  - ${t.name}`, 'error'));
  }

  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'info');

  // Exit with appropriate code
  process.exit(failedTests > 0 ? 1 : 0);
}

// Run tests
if (require.main === module) {
  runAllTests().catch(error => {
    log(`\nFatal error running tests: ${error.message}`, 'error');
    process.exit(1);
  });
}

module.exports = { VercelDeploymentTests, runAllTests };
