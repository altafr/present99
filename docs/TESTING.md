# Testing Guide for Present99

## Overview

This document describes the testing strategy and available test suites for Present99.

## Test Suites Available

### 1. Manual Test Suite (TEST_SUITE.md)
**Purpose**: Comprehensive manual testing checklist  
**When to use**: After major changes, before releases  
**Time**: ~30-45 minutes for full suite  

**Features:**
- 20 detailed test cases
- Step-by-step instructions
- Pass/Fail tracking
- Performance benchmarks
- Quick smoke test (5 minutes)

**How to use:**
```bash
# Open the test suite document
open TEST_SUITE.md
# Or view in your editor
```

---

### 2. Backend API Tests (server/test-api.js)
**Purpose**: Automated API endpoint testing  
**When to use**: After backend changes, in CI/CD  
**Time**: ~30 seconds  

**Features:**
- 10 automated test cases
- Health check validation
- Slide generation testing
- Image generation testing
- Error handling verification
- Colored console output

**How to run:**
```bash
# Make sure server is running first
cd server
npm test

# Or with auto-reload on changes
npm run test:watch
```

**Expected output:**
```
╔════════════════════════════════════════╗
║   Present99 API Test Suite            ║
╚════════════════════════════════════════╝

Testing API at: http://localhost:3001/api

[Test 1] Health Check
  ✓ Server is responding
  ✓ Health status is OK
  ℹ OpenRouter: ENABLED
  ℹ Replicate: ENABLED

...

╔════════════════════════════════════════╗
║   Test Summary                         ║
╚════════════════════════════════════════╝

Total Tests: 10
Passed: 10
Failed: 0

Success Rate: 100.0%

✓ All tests passed! 🎉
```

---

### 3. Interactive UI Test Suite (client/test-ui.html)
**Purpose**: Interactive frontend testing checklist  
**When to use**: After UI changes, for QA testing  
**Time**: ~20-30 minutes  

**Features:**
- 24 interactive test cases
- Real-time progress tracking
- Visual pass/fail indicators
- Export test results
- Mobile/responsive tests

**How to use:**
```bash
# Open in browser
open client/test-ui.html
# Or navigate to file:///path/to/client/test-ui.html

# Then open the app in another tab
open http://localhost:5173
```

**Features:**
- ✅ Check boxes to mark tests complete
- 📊 Real-time summary statistics
- 🎨 Color-coded test status
- 💾 Export results as text file
- 🔄 Reset all tests

---

## Testing Strategy

### When to Run Tests

#### Before Every Commit
- [ ] Quick smoke test (5 min)
- [ ] Check console for errors

#### After Feature Development
- [ ] Full manual test suite
- [ ] Backend API tests
- [ ] Interactive UI tests

#### Before Release
- [ ] All test suites
- [ ] Performance benchmarks
- [ ] Cross-browser testing
- [ ] Mobile testing

#### After Bug Fixes
- [ ] Specific test case for the bug
- [ ] Regression tests
- [ ] Quick smoke test

---

## Test Environments

### Development Environment
- **Server**: http://localhost:3001
- **Client**: http://localhost:5173
- **API Keys**: Optional (mock data works)
- **Purpose**: Daily development testing

### Staging Environment (if applicable)
- **Server**: Your staging URL
- **Client**: Your staging URL
- **API Keys**: Required
- **Purpose**: Pre-production testing

### Production Environment
- **Server**: Your production URL
- **Client**: Your production URL
- **API Keys**: Required
- **Purpose**: Production verification

---

## Test Configurations

### Configuration 1: Mock Mode (No API Keys)
```bash
# No .env file or empty keys
cd server
# Remove or rename .env
mv .env .env.backup
npm run dev
```

**Tests to run:**
- Basic functionality
- UI/UX flows
- Error handling
- Mock data generation

### Configuration 2: Full AI Mode (With API Keys)
```bash
# Create .env with valid keys
cd server
cat > .env << EOF
OPENROUTER_API_KEY=sk-or-v1-xxxxx
REPLICATE_API_TOKEN=r8_xxxxx
PORT=3001
EOF
npm run dev
```

**Tests to run:**
- AI content generation
- Image generation
- API integration
- Full feature testing

---

## Quick Start Testing

### 5-Minute Smoke Test

Run this after any change to verify basic functionality:

1. **Home Page** (30 sec)
   - [ ] Page loads
   - [ ] Form is visible
   - [ ] No console errors

2. **Generate** (2 min)
   - [ ] Enter topic: "Test"
   - [ ] Click generate
   - [ ] Slides appear

3. **Edit** (1 min)
   - [ ] Change slide title
   - [ ] Add bullet point
   - [ ] Changes appear

4. **Export** (1 min)
   - [ ] Click Export PDF
   - [ ] PDF downloads
   - [ ] PDF opens correctly

5. **Navigate** (30 sec)
   - [ ] Back to home works
   - [ ] Can generate again

**If all pass**: ✅ Basic functionality intact  
**If any fail**: ⚠️ Run full test suite

---

## Automated Testing (Future)

### Planned Additions

1. **Unit Tests**
   - Component testing with Jest
   - Utility function tests
   - API endpoint tests

2. **Integration Tests**
   - End-to-end with Playwright
   - API integration tests
   - Database tests (if added)

3. **Visual Regression Tests**
   - Screenshot comparison
   - Layout verification
   - Cross-browser consistency

4. **Performance Tests**
   - Load time monitoring
   - API response times
   - Memory usage tracking

---

## Test Data

### Sample Topics for Testing

**Short topics:**
- AI
- Space
- Climate

**Medium topics:**
- Artificial Intelligence
- Climate Change
- Machine Learning

**Long topics:**
- The Future of Artificial Intelligence in Healthcare
- Understanding Climate Change and Its Global Impact

**Special characters:**
- AI & ML: The Future?
- "Quantum Computing" - A New Era
- Tech (2024-2025)

### Test Slide Counts
- Minimum: 3 slides
- Default: 5 slides
- Medium: 10 slides
- Maximum: 15 slides

### Test Tones
- Professional
- Casual
- Academic
- Creative
- Persuasive

---

## Troubleshooting Tests

### Backend Tests Failing

**Problem**: "Connection refused"
```bash
# Solution: Start the server
cd server
npm run dev
```

**Problem**: "API tests failing"
```bash
# Check server is running on correct port
curl http://localhost:3001/api/health

# Check for errors in server console
```

### UI Tests Not Working

**Problem**: "App not loading"
```bash
# Solution: Start the client
cd client
npm run dev
```

**Problem**: "Images not generating"
```bash
# Check API keys are configured
cd server
cat .env

# Verify Replicate token is valid
```

### Test Suite Issues

**Problem**: "Can't open test-ui.html"
```bash
# Open directly in browser
open client/test-ui.html

# Or use a local server
cd client
python3 -m http.server 8000
# Then visit http://localhost:8000/test-ui.html
```

---

## Continuous Integration (CI/CD)

### GitHub Actions Example

```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '22'
      
      - name: Install dependencies
        run: |
          cd server && npm install
          cd ../client && npm install
      
      - name: Start server
        run: cd server && npm start &
        
      - name: Wait for server
        run: sleep 5
      
      - name: Run API tests
        run: cd server && npm test
      
      - name: Build client
        run: cd client && npm run build
```

---

## Test Coverage Goals

### Current Coverage
- Manual tests: 20 test cases
- API tests: 10 automated tests
- UI tests: 24 interactive tests

### Target Coverage
- [ ] 90%+ API endpoint coverage
- [ ] 80%+ UI component coverage
- [ ] 100% critical path coverage
- [ ] Cross-browser compatibility
- [ ] Mobile responsiveness

---

## Reporting Issues

When reporting test failures:

1. **Test name** and number
2. **Expected behavior**
3. **Actual behavior**
4. **Steps to reproduce**
5. **Environment** (browser, OS, config)
6. **Screenshots** (if applicable)
7. **Console errors** (if any)

Example:
```
Test: Generate Presentation - Basic Request
Expected: 5 slides generated
Actual: Only 3 slides generated
Steps: Enter "AI", select 5 slides, click generate
Environment: Chrome 120, macOS, Mock mode
Console: No errors
```

---

## Best Practices

1. **Always test in both modes** (Mock and Full AI)
2. **Check console** for errors during testing
3. **Test on multiple browsers** before release
4. **Run smoke test** after every change
5. **Document new test cases** for new features
6. **Update test suite** when features change
7. **Keep test data realistic** and varied

---

## Resources

- **TEST_SUITE.md** - Full manual test checklist
- **server/test-api.js** - Automated API tests
- **client/test-ui.html** - Interactive UI tests
- **README.md** - Setup and usage guide
- **SETUP_GUIDE.md** - API configuration

---

## Questions?

For testing questions or issues:
1. Check this guide first
2. Review test suite documentation
3. Check console for errors
4. Verify environment setup
5. Open an issue if needed

Happy testing! 🧪✨
