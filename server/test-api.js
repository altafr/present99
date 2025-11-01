#!/usr/bin/env node

/**
 * Present99 API Test Script
 * 
 * Automated tests for backend API endpoints
 * Run with: node test-api.js
 */

import axios from 'axios';

const API_URL = 'http://localhost:3001/api';
const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

let passedTests = 0;
let failedTests = 0;
let totalTests = 0;

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function logTest(name) {
  totalTests++;
  log(`\n[Test ${totalTests}] ${name}`, 'cyan');
}

function logPass(message) {
  passedTests++;
  log(`  ✓ ${message}`, 'green');
}

function logFail(message) {
  failedTests++;
  log(`  ✗ ${message}`, 'red');
}

function logInfo(message) {
  log(`  ℹ ${message}`, 'blue');
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Test 1: Health Check
async function testHealthCheck() {
  logTest('Health Check');
  try {
    const response = await axios.get(`${API_URL}/health`);
    
    if (response.status === 200) {
      logPass('Server is responding');
    } else {
      logFail(`Unexpected status code: ${response.status}`);
    }

    if (response.data.status === 'ok') {
      logPass('Health status is OK');
    } else {
      logFail('Health status is not OK');
    }

    logInfo(`OpenRouter: ${response.data.openRouterEnabled ? 'ENABLED' : 'DISABLED'}`);
    logInfo(`Replicate: ${response.data.replicateEnabled ? 'ENABLED' : 'DISABLED'}`);

    return true;
  } catch (error) {
    logFail(`Health check failed: ${error.message}`);
    return false;
  }
}

// Test 2: Generate Presentation - Basic
async function testGenerateBasic() {
  logTest('Generate Presentation - Basic Request');
  try {
    const response = await axios.post(`${API_URL}/generate`, {
      topic: 'Test Topic',
      slideCount: 3,
      tone: 'professional'
    });

    if (response.status === 200) {
      logPass('Request successful (200)');
    } else {
      logFail(`Unexpected status: ${response.status}`);
    }

    if (response.data.slides && Array.isArray(response.data.slides)) {
      logPass('Response contains slides array');
    } else {
      logFail('Response missing slides array');
      return false;
    }

    if (response.data.slides.length === 3) {
      logPass('Correct number of slides (3)');
    } else {
      logFail(`Expected 3 slides, got ${response.data.slides.length}`);
    }

    return true;
  } catch (error) {
    logFail(`Generate failed: ${error.message}`);
    return false;
  }
}

// Test 3: Generate Presentation - Validation
async function testGenerateValidation() {
  logTest('Generate Presentation - Validation');
  try {
    const response = await axios.post(`${API_URL}/generate`, {
      slideCount: 5,
      tone: 'professional'
      // Missing topic
    });
    
    logFail('Should have rejected request without topic');
    return false;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      logPass('Correctly rejected request without topic (400)');
      return true;
    } else {
      logFail(`Unexpected error: ${error.message}`);
      return false;
    }
  }
}

// Test 4: Generate Presentation - Slide Structure
async function testSlideStructure() {
  logTest('Generate Presentation - Slide Structure');
  try {
    const response = await axios.post(`${API_URL}/generate`, {
      topic: 'Artificial Intelligence',
      slideCount: 5,
      tone: 'academic'
    });

    const slides = response.data.slides;
    let allValid = true;

    // Check first slide is title
    if (slides[0].type === 'title' && slides[0].layout === 'title') {
      logPass('First slide is title type');
    } else {
      logFail('First slide should be title type');
      allValid = false;
    }

    // Check all slides have required fields
    const requiredFields = ['id', 'type', 'title', 'layout'];
    slides.forEach((slide, index) => {
      const missing = requiredFields.filter(field => !slide[field]);
      if (missing.length === 0) {
        if (index === 0) logPass('All slides have required fields');
      } else {
        logFail(`Slide ${index + 1} missing: ${missing.join(', ')}`);
        allValid = false;
      }
    });

    // Check content slides have content
    const contentSlides = slides.filter(s => s.type === 'content');
    if (contentSlides.every(s => s.content && Array.isArray(s.content))) {
      logPass('Content slides have content arrays');
    } else {
      logFail('Some content slides missing content array');
      allValid = false;
    }

    // Check for imagePrompts
    if (slides.every(s => s.imagePrompt)) {
      logPass('All slides have imagePrompt field');
    } else {
      logFail('Some slides missing imagePrompt');
      allValid = false;
    }

    return allValid;
  } catch (error) {
    logFail(`Slide structure test failed: ${error.message}`);
    return false;
  }
}

// Test 5: Generate Presentation - Different Tones
async function testDifferentTones() {
  logTest('Generate Presentation - Different Tones');
  const tones = ['professional', 'casual', 'academic', 'creative', 'persuasive'];
  let allPassed = true;

  for (const tone of tones) {
    try {
      const response = await axios.post(`${API_URL}/generate`, {
        topic: 'Technology',
        slideCount: 3,
        tone: tone
      });

      if (response.status === 200 && response.data.slides) {
        logPass(`Tone '${tone}' works`);
      } else {
        logFail(`Tone '${tone}' failed`);
        allPassed = false;
      }
    } catch (error) {
      logFail(`Tone '${tone}' error: ${error.message}`);
      allPassed = false;
    }
  }

  return allPassed;
}

// Test 6: Generate Presentation - Slide Counts
async function testSlideCountVariations() {
  logTest('Generate Presentation - Slide Count Variations');
  const counts = [3, 5, 10, 15];
  let allPassed = true;

  for (const count of counts) {
    try {
      const response = await axios.post(`${API_URL}/generate`, {
        topic: 'Science',
        slideCount: count,
        tone: 'professional'
      });

      if (response.data.slides.length === count) {
        logPass(`${count} slides generated correctly`);
      } else {
        logFail(`Expected ${count} slides, got ${response.data.slides.length}`);
        allPassed = false;
      }
    } catch (error) {
      logFail(`Slide count ${count} error: ${error.message}`);
      allPassed = false;
    }
  }

  return allPassed;
}

// Test 7: Generate Image - Single (if Replicate enabled)
async function testGenerateImage() {
  logTest('Generate Image - Single Image');
  
  // First check if Replicate is enabled
  try {
    const healthResponse = await axios.get(`${API_URL}/health`);
    if (!healthResponse.data.replicateEnabled) {
      logInfo('Replicate not enabled, skipping image tests');
      return true;
    }
  } catch (error) {
    logFail('Could not check Replicate status');
    return false;
  }

  try {
    const response = await axios.post(`${API_URL}/generate-image`, {
      prompt: 'A beautiful sunset over mountains',
      slideId: 'test-1'
    }, {
      timeout: 30000 // 30 second timeout for image generation
    });

    if (response.status === 200) {
      logPass('Image generation request successful');
    } else {
      logFail(`Unexpected status: ${response.status}`);
      return false;
    }

    if (response.data.imageUrl) {
      logPass('Image URL returned');
      const url = String(response.data.imageUrl);
      logInfo(`URL: ${url.substring(0, 50)}...`);
    } else {
      logFail('No image URL in response');
      return false;
    }

    return true;
  } catch (error) {
    if (error.response && error.response.status === 503) {
      logInfo('Image generation not configured (503)');
      return true;
    }
    logFail(`Image generation failed: ${error.message}`);
    return false;
  }
}

// Test 8: Generate Image - Validation
async function testGenerateImageValidation() {
  logTest('Generate Image - Validation');
  
  try {
    const response = await axios.post(`${API_URL}/generate-image`, {
      slideId: 'test-1'
      // Missing prompt
    });
    
    logFail('Should have rejected request without prompt');
    return false;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      logPass('Correctly rejected request without prompt (400)');
      return true;
    } else if (error.response && error.response.status === 503) {
      logInfo('Image generation not configured');
      return true;
    } else {
      logFail(`Unexpected error: ${error.message}`);
      return false;
    }
  }
}

// Test 9: Batch Image Generation
async function testBatchImageGeneration() {
  logTest('Batch Image Generation');
  
  // Check if Replicate is enabled
  try {
    const healthResponse = await axios.get(`${API_URL}/health`);
    if (!healthResponse.data.replicateEnabled) {
      logInfo('Replicate not enabled, skipping batch test');
      return true;
    }
  } catch (error) {
    logFail('Could not check Replicate status');
    return false;
  }

  try {
    const slides = [
      { id: '1', imagePrompt: 'A modern office' },
      { id: '2', imagePrompt: 'A futuristic city' }
    ];

    const response = await axios.post(`${API_URL}/generate-images-batch`, {
      slides: slides
    }, {
      timeout: 60000 // 60 second timeout for batch
    });

    if (response.status === 200) {
      logPass('Batch request successful');
    } else {
      logFail(`Unexpected status: ${response.status}`);
      return false;
    }

    if (response.data.images && Array.isArray(response.data.images)) {
      logPass('Response contains images array');
      
      if (response.data.images.length === 2) {
        logPass('Correct number of images returned');
      } else {
        logFail(`Expected 2 images, got ${response.data.images.length}`);
        return false;
      }
    } else {
      logFail('Response missing images array');
      return false;
    }

    return true;
  } catch (error) {
    if (error.response && error.response.status === 503) {
      logInfo('Image generation not configured (503)');
      return true;
    }
    logFail(`Batch generation failed: ${error.message}`);
    return false;
  }
}

// Test 10: Error Handling
async function testErrorHandling() {
  logTest('Error Handling - Invalid Endpoint');
  try {
    await axios.get(`${API_URL}/nonexistent`);
    logFail('Should have returned 404');
    return false;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      logPass('Correctly returns 404 for invalid endpoint');
      return true;
    } else {
      logFail(`Unexpected error: ${error.message}`);
      return false;
    }
  }
}

// Main test runner
async function runTests() {
  log('\n╔════════════════════════════════════════╗', 'cyan');
  log('║   Present99 API Test Suite            ║', 'cyan');
  log('╚════════════════════════════════════════╝\n', 'cyan');

  log(`Testing API at: ${API_URL}\n`, 'blue');

  const tests = [
    testHealthCheck,
    testGenerateBasic,
    testGenerateValidation,
    testSlideStructure,
    testDifferentTones,
    testSlideCountVariations,
    testGenerateImage,
    testGenerateImageValidation,
    testBatchImageGeneration,
    testErrorHandling
  ];

  for (const test of tests) {
    await test();
    await sleep(500); // Small delay between tests
  }

  // Summary
  log('\n╔════════════════════════════════════════╗', 'cyan');
  log('║   Test Summary                         ║', 'cyan');
  log('╚════════════════════════════════════════╝\n', 'cyan');

  log(`Total Tests: ${totalTests}`, 'blue');
  log(`Passed: ${passedTests}`, 'green');
  log(`Failed: ${failedTests}`, failedTests > 0 ? 'red' : 'green');
  
  const percentage = ((passedTests / totalTests) * 100).toFixed(1);
  log(`\nSuccess Rate: ${percentage}%\n`, percentage >= 80 ? 'green' : 'red');

  if (failedTests === 0) {
    log('✓ All tests passed! 🎉\n', 'green');
    process.exit(0);
  } else {
    log(`✗ ${failedTests} test(s) failed\n`, 'red');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  log(`\n✗ Test suite crashed: ${error.message}\n`, 'red');
  process.exit(1);
});
