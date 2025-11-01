# Implementation Plan - Feature Enhancements

## Issues Identified:

1. ❌ **Images Missing** - Not being generated/displayed
2. ❌ **Cover Slide Image** - Title slide needs background image
3. ❌ **Export Options** - Not visible in UI
4. ❌ **Save/Load Presentations** - No persistence
5. ❌ **Edit Mode** - Already exists but needs enhancement
6. ❌ **PPTX Export** - Only PDF currently supported

---

## Solutions to Implement:

### 1. Fix Image Generation
**Problem**: Images aren't being generated during presentation creation
**Solution**: 
- Frontend is calling batch image generation but may be failing silently
- Need to ensure Replicate API is working
- Add better error handling and loading states

### 2. Add Cover Slide Images
**Problem**: Title slides don't have background images
**Solution**:
- Ensure title slides get imagePrompt from GPT-4
- Apply background image to title layout
- Already implemented in SlideCanvas but needs images

### 3. Make Export Button Visible
**Problem**: Export button exists but may not be prominent
**Solution**:
- Export PDF button is already in toolbar
- Add PPTX export option
- Make buttons more visible

### 4. Add Presentation Persistence
**Problem**: No save/load functionality
**Solution**:
- Add localStorage for client-side storage
- Create presentation library/history view
- Add save/load/delete functionality

### 5. Enhance Edit Mode
**Problem**: Edit mode exists but needs improvements
**Solution**:
- Already functional - just needs better UX
- Add visual indicators for edit mode
- Add undo/redo functionality

### 6. Add PPTX Export
**Problem**: Only PDF export available
**Solution**:
- Add pptxgenjs library
- Create PPTX export function
- Add export format selector

---

## Implementation Order:

1. ✅ Fix image generation (critical)
2. ✅ Add presentation persistence (high priority)
3. ✅ Add PPTX export (high priority)
4. ✅ Enhance export UI (medium priority)
5. ✅ Improve edit mode UX (low priority)

---

## Time Estimate: 30-45 minutes
