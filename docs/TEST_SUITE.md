# Present99 Test Suite

## Manual Testing Checklist

Run these tests after major changes to ensure core functionality works.

---

## 🔧 Pre-Test Setup

### Environment Check
- [ ] Both servers are running (client on :5173, server on :3001)
- [ ] No console errors on startup
- [ ] Browser console is open (F12) for error monitoring

### Test Configurations

**Test 1: Without API Keys (Mock Mode)**
- [ ] No `.env` file or empty API keys
- [ ] Server shows: "DISABLED (using mock data)"

**Test 2: With API Keys (Full AI Mode)**
- [ ] `.env` file has valid `OPENROUTER_API_KEY`
- [ ] `.env` file has valid `REPLICATE_API_TOKEN`
- [ ] Server shows: "ENABLED" for both services

---

## 📋 Test Cases

### Test Case 1: Home Page Load
**Priority**: Critical  
**Time**: 30 seconds

**Steps:**
1. Navigate to http://localhost:5173
2. Observe page load

**Expected Results:**
- [ ] Page loads without errors
- [ ] "Present99" logo and title visible
- [ ] Input field for topic is present
- [ ] Dropdown for slide count (3-15) works
- [ ] Dropdown for tone (5 options) works
- [ ] "Generate Presentation" button is visible and enabled
- [ ] Three feature cards displayed at bottom
- [ ] No console errors

**Pass/Fail:** ___________

---

### Test Case 2: Form Validation
**Priority**: High  
**Time**: 1 minute

**Steps:**
1. Leave topic field empty
2. Click "Generate Presentation"
3. Enter a topic
4. Click "Generate Presentation" again

**Expected Results:**
- [ ] Error message appears: "Please enter a topic"
- [ ] Button remains clickable
- [ ] After entering topic, error disappears
- [ ] Generation starts

**Pass/Fail:** ___________

---

### Test Case 3: Presentation Generation (Mock Mode)
**Priority**: Critical  
**Time**: 2 minutes

**Prerequisites:** No API keys configured

**Steps:**
1. Enter topic: "Artificial Intelligence"
2. Select 5 slides
3. Select "Professional" tone
4. Click "Generate Presentation"
5. Wait for generation

**Expected Results:**
- [ ] Button shows "Generating slides with AI..."
- [ ] Button becomes disabled during generation
- [ ] Generation completes in 1-3 seconds
- [ ] Redirects to editor view
- [ ] 5 slides visible in left sidebar
- [ ] First slide is displayed in center
- [ ] Slide contains mock content related to AI
- [ ] No console errors

**Pass/Fail:** ___________

---

### Test Case 4: Presentation Generation (Full AI Mode)
**Priority**: Critical  
**Time**: 30 seconds

**Prerequisites:** Valid API keys configured

**Steps:**
1. Enter topic: "Climate Change"
2. Select 5 slides
3. Select "Academic" tone
4. Click "Generate Presentation"
5. Wait for generation

**Expected Results:**
- [ ] Button shows "Generating slides with AI..."
- [ ] Then shows "Generating images with Flux AI..."
- [ ] Generation completes in 15-25 seconds
- [ ] Redirects to editor view
- [ ] 5 slides visible in left sidebar
- [ ] Content is relevant to "Climate Change"
- [ ] Images are visible (check image-text layouts)
- [ ] No console errors
- [ ] Server logs show successful API calls

**Pass/Fail:** ___________

---

### Test Case 5: Slide Navigation
**Priority**: High  
**Time**: 1 minute

**Prerequisites:** Presentation is generated and open in editor

**Steps:**
1. Click right arrow button
2. Click left arrow button
3. Click on slide #3 in sidebar
4. Use keyboard (if implemented)

**Expected Results:**
- [ ] Right arrow moves to next slide
- [ ] Left arrow moves to previous slide
- [ ] Arrows disable at first/last slide
- [ ] Clicking thumbnail navigates to that slide
- [ ] Active slide highlighted in sidebar
- [ ] Slide counter updates (e.g., "3 / 5")
- [ ] Main canvas updates with correct content

**Pass/Fail:** ___________

---

### Test Case 6: Slide Editing
**Priority**: High  
**Time**: 2 minutes

**Prerequisites:** Presentation is open in editor

**Steps:**
1. Select any content slide
2. In right sidebar, change the title
3. Modify first bullet point
4. Add a new bullet point
5. Remove a bullet point

**Expected Results:**
- [ ] Title updates in real-time on canvas
- [ ] Bullet point changes reflect immediately
- [ ] "Add Point" button adds new editable field
- [ ] Delete button removes bullet point
- [ ] Changes persist when navigating away and back
- [ ] No console errors

**Pass/Fail:** ___________

---

### Test Case 7: Layout Changes
**Priority**: High  
**Time**: 2 minutes

**Prerequisites:** Presentation is open in editor

**Steps:**
1. Click layout button in toolbar
2. Layout picker modal appears
3. Select "Two Column" layout
4. Close modal
5. Repeat for other layouts

**Expected Results:**
- [ ] Modal opens with 4 layout options
- [ ] Current layout is highlighted
- [ ] Clicking layout changes slide immediately
- [ ] Modal closes after selection
- [ ] Content adapts to new layout
- [ ] Title layout: centered title + subtitle
- [ ] Content layout: title + bullet points
- [ ] Two-column: splits bullets into 2 columns
- [ ] Image-text: shows image + bullets side by side

**Pass/Fail:** ___________

---

### Test Case 8: Add Slide
**Priority**: High  
**Time**: 1 minute

**Prerequisites:** Presentation is open in editor

**Steps:**
1. Note current slide count
2. Click "+" button in toolbar
3. Observe new slide

**Expected Results:**
- [ ] New slide appears at end of presentation
- [ ] Slide count increases by 1
- [ ] Automatically navigates to new slide
- [ ] New slide has default content: "New Slide"
- [ ] New slide has default layout: "content"
- [ ] Slide is editable
- [ ] Thumbnail appears in sidebar

**Pass/Fail:** ___________

---

### Test Case 9: Delete Slide
**Priority**: High  
**Time**: 1 minute

**Prerequisites:** Presentation has at least 2 slides

**Steps:**
1. Navigate to slide #2
2. Click trash icon in toolbar
3. Try to delete the last remaining slide

**Expected Results:**
- [ ] Confirmation or immediate deletion
- [ ] Slide removed from sidebar
- [ ] Navigates to previous slide
- [ ] Slide count decreases
- [ ] Cannot delete if only 1 slide remains
- [ ] Delete button disabled with 1 slide

**Pass/Fail:** ___________

---

### Test Case 10: PDF Export
**Priority**: Critical  
**Time**: 2 minutes

**Prerequisites:** Presentation is open in editor

**Steps:**
1. Click "Export PDF" button
2. Wait for processing
3. Check downloaded file

**Expected Results:**
- [ ] Export process starts
- [ ] PDF downloads automatically
- [ ] Filename includes presentation topic
- [ ] PDF opens successfully
- [ ] All slides present in PDF
- [ ] Content matches what's on screen
- [ ] Images included (if generated)
- [ ] Layout preserved
- [ ] No blank pages

**Pass/Fail:** ___________

---

### Test Case 11: Back to Home
**Priority**: Medium  
**Time**: 30 seconds

**Prerequisites:** Presentation is open in editor

**Steps:**
1. Click back arrow in top-left
2. Observe home page

**Expected Results:**
- [ ] Returns to home page
- [ ] Previous presentation is cleared
- [ ] Form is reset to defaults
- [ ] Can generate new presentation
- [ ] No console errors

**Pass/Fail:** ___________

---

### Test Case 12: Image Display (Full AI Mode)
**Priority**: High  
**Time**: 2 minutes

**Prerequisites:** Valid API keys, presentation generated

**Steps:**
1. Navigate through all slides
2. Find slides with "image-text" layout
3. Check background images on other slides

**Expected Results:**
- [ ] Image-text slides show image on left
- [ ] Images are relevant to slide content
- [ ] Images load without errors
- [ ] Images are properly sized (16:9)
- [ ] Background images visible on other layouts
- [ ] Gradient overlay on backgrounds
- [ ] Text remains readable over images
- [ ] No broken image icons

**Pass/Fail:** ___________

---

### Test Case 13: Responsive Design (Mobile)
**Priority**: Medium  
**Time**: 2 minutes

**Steps:**
1. Open browser DevTools (F12)
2. Toggle device toolbar (mobile view)
3. Test on iPhone/Android size
4. Navigate through app

**Expected Results:**
- [ ] Home page adapts to mobile
- [ ] Form remains usable
- [ ] Editor sidebar adapts or hides
- [ ] Slide canvas scales appropriately
- [ ] Buttons remain accessible
- [ ] No horizontal scrolling
- [ ] Touch interactions work

**Pass/Fail:** ___________

---

### Test Case 14: Error Handling - Server Down
**Priority**: High  
**Time**: 1 minute

**Steps:**
1. Stop the backend server
2. Try to generate presentation
3. Restart server

**Expected Results:**
- [ ] Error message appears
- [ ] Message mentions server connection
- [ ] App doesn't crash
- [ ] User can try again
- [ ] After restart, generation works

**Pass/Fail:** ___________

---

### Test Case 15: Error Handling - Invalid API Keys
**Priority**: Medium  
**Time**: 2 minutes

**Prerequisites:** Set invalid API keys in .env

**Steps:**
1. Set `OPENROUTER_API_KEY=invalid_key`
2. Restart server
3. Generate presentation

**Expected Results:**
- [ ] Server logs show API error
- [ ] Falls back to mock data gracefully
- [ ] Presentation still generates
- [ ] User sees content (mock data)
- [ ] No app crash
- [ ] Console shows warning, not error

**Pass/Fail:** ___________

---

### Test Case 16: Multiple Presentations
**Priority**: Medium  
**Time**: 3 minutes

**Steps:**
1. Generate presentation on "AI"
2. Go back to home
3. Generate presentation on "Space"
4. Compare content

**Expected Results:**
- [ ] First presentation generates successfully
- [ ] Can return to home without issues
- [ ] Second presentation generates
- [ ] Content is different and relevant
- [ ] No data from first presentation remains
- [ ] Each presentation is independent

**Pass/Fail:** ___________

---

### Test Case 17: Long Topic Names
**Priority**: Low  
**Time**: 1 minute

**Steps:**
1. Enter very long topic: "The Complete History of Artificial Intelligence and Machine Learning in the 21st Century"
2. Generate presentation

**Expected Results:**
- [ ] Topic is accepted
- [ ] Generation works normally
- [ ] Title doesn't overflow on slides
- [ ] PDF filename is reasonable length
- [ ] No layout breaking

**Pass/Fail:** ___________

---

### Test Case 18: Special Characters
**Priority**: Low  
**Time**: 1 minute

**Steps:**
1. Enter topic with special chars: "AI & ML: The Future?"
2. Generate presentation

**Expected Results:**
- [ ] Special characters handled correctly
- [ ] No encoding issues
- [ ] Content displays properly
- [ ] PDF export works
- [ ] Filename sanitized if needed

**Pass/Fail:** ___________

---

### Test Case 19: Maximum Slides
**Priority**: Medium  
**Time**: 2 minutes

**Steps:**
1. Select 15 slides
2. Generate presentation
3. Navigate through all slides

**Expected Results:**
- [ ] All 15 slides generate
- [ ] Sidebar scrolls if needed
- [ ] Navigation works smoothly
- [ ] Performance remains good
- [ ] PDF export includes all slides
- [ ] No memory issues

**Pass/Fail:** ___________

---

### Test Case 20: Browser Compatibility
**Priority**: Medium  
**Time**: 5 minutes

**Steps:**
1. Test in Chrome
2. Test in Firefox
3. Test in Safari
4. Test in Edge

**Expected Results:**
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] Consistent appearance
- [ ] All features functional
- [ ] No browser-specific errors

**Pass/Fail:** ___________

---

## 🎯 Test Summary

**Date:** ___________  
**Tester:** ___________  
**Version:** ___________  
**Configuration:** [ ] Mock Mode  [ ] Full AI Mode

### Results
- **Total Tests:** 20
- **Passed:** _____ / 20
- **Failed:** _____ / 20
- **Skipped:** _____ / 20

### Critical Issues Found:
1. ___________________________________________
2. ___________________________________________
3. ___________________________________________

### Non-Critical Issues:
1. ___________________________________________
2. ___________________________________________

### Notes:
___________________________________________
___________________________________________
___________________________________________

---

## 🚀 Quick Smoke Test (5 minutes)

For rapid testing after small changes:

1. [ ] Home page loads
2. [ ] Generate presentation (any topic)
3. [ ] Navigate between slides
4. [ ] Edit one slide
5. [ ] Change one layout
6. [ ] Export PDF
7. [ ] Back to home

If all pass: ✅ Basic functionality intact  
If any fail: ⚠️ Run full test suite

---

## 📊 Performance Benchmarks

Track these metrics for performance regression:

| Metric | Target | Actual | Pass/Fail |
|--------|--------|--------|-----------|
| Home page load | < 1s | _____ | _____ |
| Mock generation | < 3s | _____ | _____ |
| AI generation | < 25s | _____ | _____ |
| Slide navigation | < 100ms | _____ | _____ |
| PDF export (5 slides) | < 10s | _____ | _____ |
| Layout change | < 200ms | _____ | _____ |

---

## 🔄 Regression Testing

Run full test suite after:
- [ ] Major feature additions
- [ ] API changes
- [ ] UI/UX updates
- [ ] Dependency updates
- [ ] Bug fixes affecting core features

Run smoke test after:
- [ ] Minor bug fixes
- [ ] CSS/styling changes
- [ ] Documentation updates
- [ ] Configuration changes

---

## 📝 Test Environment

**System Info:**
- OS: ___________
- Browser: ___________
- Node Version: ___________
- Screen Resolution: ___________

**API Status:**
- OpenRouter: [ ] Enabled [ ] Disabled
- Replicate: [ ] Enabled [ ] Disabled

**Network:**
- Connection: [ ] Fast [ ] Slow [ ] Offline testing
