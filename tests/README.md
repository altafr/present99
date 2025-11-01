# Present99 Test Suite

Comprehensive automated tests for the Present99 Vercel deployment.

## Test Coverage

### 1. Frontend Tests (3 tests)
- Frontend accessibility
- HTML content loading
- Static assets (JS/CSS bundles)

### 2. API Health Tests (4 tests)
- Health endpoint availability
- Health data structure
- OpenRouter (GPT-4) status
- Replicate (Flux) status

### 3. Presentation Generation Tests (6 tests)
- Basic generation functionality
- Correct slide count
- Slide data structure
- Title slide format
- Image prompt generation
- Different tone support

### 4. Error Handling Tests (3 tests)
- Missing topic validation
- Invalid slide count handling
- 404 for invalid endpoints

### 5. CORS Tests (1 test)
- CORS headers configuration

### 6. Performance Tests (2 tests)
- API response time
- Generation completion time

### 7. Image Generation Tests (2 tests)
- Single image generation
- Batch image generation

### 8. Integration Tests (1 test)
- Full presentation flow

**Total: 22 automated tests**

## Setup

```bash
cd tests
npm install
```

## Running Tests

### Test Production Deployment
```bash
npm run test:production
```

### Test Local Development
```bash
npm run test:local
```

### Test Custom URL
```bash
TEST_URL=https://your-deployment.vercel.app npm test
```

## Test Output

The test suite provides:
- ✓ Green checkmarks for passed tests
- ✗ Red X marks for failed tests
- Detailed error messages for failures
- Summary with pass rate
- Exit code 0 for success, 1 for failures

## Example Output

```
╔══════════════════════════════════════════════════════════╗
║     Present99 - Vercel Deployment Test Suite            ║
╚══════════════════════════════════════════════════════════╝

Testing deployment at: https://present99.vercel.app

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. FRONTEND TESTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Frontend is accessible
✓ Frontend HTML content loads
✓ Frontend static assets referenced

...

╔══════════════════════════════════════════════════════════╗
║                     TEST SUMMARY                         ║
╚══════════════════════════════════════════════════════════╝

Total Tests: 22
Passed: 20
Failed: 2
Pass Rate: 90.9%
```

## CI/CD Integration

Add to your GitHub Actions workflow:

```yaml
- name: Run deployment tests
  run: |
    cd tests
    npm install
    npm run test:production
```

## Test Maintenance

- Update `BASE_URL` in the test file for different environments
- Adjust `TIMEOUT` for slower connections
- Add new tests to the `VercelDeploymentTests` class
- Keep tests independent and idempotent

## Troubleshooting

### Tests timing out
- Increase `TIMEOUT` constant (default: 30000ms)
- Check network connection
- Verify Vercel deployment is not sleeping

### API tests failing
- Verify environment variables are set in Vercel
- Check API keys are valid
- Ensure CORS is configured correctly

### Image generation tests failing
- This is expected if Replicate times out (serverless limitation)
- Image generation may take longer than serverless timeout
- Consider these tests as warnings, not failures
