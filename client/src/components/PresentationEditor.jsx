import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Layout,
  Type,
  Image as ImageIcon,
  Save,
  FileText,
  Palette
} from 'lucide-react';
import SlideCanvas from './SlideCanvas';
import SlideEditor from './SlideEditor';
import ThemeSelector, { THEMES } from './ThemeSelector';
import { exportToPDF, exportToPPTX } from '../utils/export';
import { savePresentation } from '../utils/storage';
import './PresentationEditor.css';

function PresentationEditor({ presentation, onBack, onUpdatePresentation }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slides, setSlides] = useState(presentation.slides);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(presentation.theme || THEMES[0]);
  const saveTimeoutRef = useRef(null);

  // Auto-save to IndexedDB with debounce
  useEffect(() => {
    if (!presentation.id) return; // Don't save if no ID yet
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Debounce save by 1 second
    saveTimeoutRef.current = setTimeout(() => {
      const presentationData = {
        ...presentation,
        slides,
        theme: currentTheme,
        lastModified: new Date().toISOString()
      };
      
      savePresentation(presentationData)
        .then(() => console.log('Auto-saved:', presentation.id))
        .catch(err => console.error('Auto-save failed:', err));
    }, 1000);
    
    // Cleanup
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [slides, currentTheme]); // Remove presentation from deps to prevent re-saves

  const currentSlide = slides[currentSlideIndex];

  const handleUpdateSlide = (updatedSlide) => {
    const newSlides = [...slides];
    newSlides[currentSlideIndex] = updatedSlide;
    setSlides(newSlides);
    onUpdatePresentation({ ...presentation, slides: newSlides });
  };

  const handleAddSlide = () => {
    const newSlide = {
      id: String(slides.length + 1),
      type: 'content',
      title: 'New Slide',
      content: ['Add your content here'],
      layout: 'content'
    };
    const newSlides = [...slides, newSlide];
    setSlides(newSlides);
    setCurrentSlideIndex(newSlides.length - 1);
    onUpdatePresentation({ ...presentation, slides: newSlides });
  };

  const handleDeleteSlide = () => {
    if (slides.length === 1) return;
    
    const newSlides = slides.filter((_, index) => index !== currentSlideIndex);
    setSlides(newSlides);
    setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1));
    onUpdatePresentation({ ...presentation, slides: newSlides });
  };

  const handleChangeLayout = (layout) => {
    const updatedSlide = { ...currentSlide, layout };
    handleUpdateSlide(updatedSlide);
    setSelectedLayout(null);
  };

  const handleExportPDF = async () => {
    try {
      setShowExportMenu(false);
      await exportToPDF(slides, presentation.topic);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const handleExportPPTX = async () => {
    try {
      setShowExportMenu(false);
      await exportToPPTX(slides, presentation.topic);
    } catch (error) {
      console.error('Error exporting PPTX:', error);
      alert('Failed to export PPTX. Please try again.');
    }
  };

  const handleSave = async () => {
    const presentationData = {
      ...presentation,
      slides,
      theme: currentTheme,
      lastModified: new Date().toISOString()
    };
    
    try {
      await savePresentation(presentationData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
      console.log('Manual save successful:', presentation.id);
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save presentation');
    }
  };

  const handleThemeChange = (newTheme) => {
    setCurrentTheme(newTheme);
    onUpdatePresentation({ ...presentation, theme: newTheme });
  };

  const goToPreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const goToNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  return (
    <div className="editor-page">
      <header className="editor-header">
        <div className="header-left">
          <button className="icon-btn" onClick={onBack} title="Back to home">
            <ArrowLeft size={20} />
          </button>
          <h2 className="presentation-title">{presentation.topic}</h2>
        </div>
        <div className="header-right">
          <button className="icon-btn" onClick={() => setSelectedLayout('picker')} title="Change layout">
            <Layout size={20} />
          </button>
          <button className="icon-btn" onClick={() => setShowThemeSelector(true)} title="Change theme">
            <Palette size={20} />
          </button>
          <button className="icon-btn" onClick={handleAddSlide} title="Add slide">
            <Plus size={20} />
          </button>
          <button 
            className="icon-btn" 
            onClick={handleDeleteSlide} 
            disabled={slides.length === 1}
            title="Delete slide"
          >
            <Trash2 size={20} />
          </button>
          <button className="icon-btn" onClick={handleSave} title="Save presentation">
            <Save size={20} />
            {isSaved && <span className="saved-indicator">✓</span>}
          </button>
          <div className="export-dropdown">
            <button className="export-btn" onClick={() => setShowExportMenu(!showExportMenu)}>
              <Download size={20} />
              Export
            </button>
            {showExportMenu && (
              <div className="export-menu">
                <button onClick={handleExportPDF}>
                  <FileText size={16} />
                  Export as PDF
                </button>
                <button onClick={handleExportPPTX}>
                  <FileText size={16} />
                  Export as PPTX
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="editor-content">
        <aside className="slides-sidebar">
          <div className="slides-list">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`slide-thumbnail ${index === currentSlideIndex ? 'active' : ''}`}
                onClick={() => setCurrentSlideIndex(index)}
              >
                <div className="thumbnail-number">{index + 1}</div>
                <div className="thumbnail-preview">
                  <div className="thumbnail-title">{slide.title}</div>
                  {slide.subtitle && (
                    <div className="thumbnail-subtitle">{slide.subtitle}</div>
                  )}
                  {slide.content && (
                    <div className="thumbnail-content">
                      {slide.content.slice(0, 2).map((item, i) => (
                        <div key={i} className="thumbnail-bullet">•</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="editor-main">
          <div className="slide-navigation">
            <button 
              className="nav-btn"
              onClick={goToPreviousSlide}
              disabled={currentSlideIndex === 0}
            >
              <ChevronLeft size={24} />
            </button>
            <span className="slide-counter">
              {currentSlideIndex + 1} / {slides.length}
            </span>
            <button 
              className="nav-btn"
              onClick={goToNextSlide}
              disabled={currentSlideIndex === slides.length - 1}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="slide-canvas-container">
            <SlideCanvas slide={currentSlide} theme={currentTheme} />
          </div>
        </main>

        <aside className="properties-sidebar">
          <SlideEditor 
            slide={currentSlide}
            onUpdate={handleUpdateSlide}
          />
        </aside>
      </div>

      {selectedLayout === 'picker' && (
        <div className="layout-picker-overlay" onClick={() => setSelectedLayout(null)}>
          <div className="layout-picker" onClick={(e) => e.stopPropagation()}>
            <h3>Choose Layout</h3>
            <div className="layout-options">
              <div 
                className={`layout-option ${currentSlide.layout === 'title' ? 'active' : ''}`}
                onClick={() => handleChangeLayout('title')}
              >
                <div className="layout-preview layout-title">
                  <div className="preview-title"></div>
                  <div className="preview-subtitle"></div>
                </div>
                <span>Title</span>
              </div>
              <div 
                className={`layout-option ${currentSlide.layout === 'content' ? 'active' : ''}`}
                onClick={() => handleChangeLayout('content')}
              >
                <div className="layout-preview layout-content">
                  <div className="preview-title"></div>
                  <div className="preview-bullets">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
                <span>Content</span>
              </div>
              <div 
                className={`layout-option ${currentSlide.layout === 'two-column' ? 'active' : ''}`}
                onClick={() => handleChangeLayout('two-column')}
              >
                <div className="layout-preview layout-two-column">
                  <div className="preview-title"></div>
                  <div className="preview-columns">
                    <div></div>
                    <div></div>
                  </div>
                </div>
                <span>Two Column</span>
              </div>
              <div 
                className={`layout-option ${currentSlide.layout === 'image-text' ? 'active' : ''}`}
                onClick={() => handleChangeLayout('image-text')}
              >
                <div className="layout-preview layout-image-text">
                  <div className="preview-title"></div>
                  <div className="preview-image-text">
                    <div className="preview-image"></div>
                    <div className="preview-text"></div>
                  </div>
                </div>
                <span>Image + Text</span>
              </div>
            </div>
            <button className="close-picker-btn" onClick={() => setSelectedLayout(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {showThemeSelector && (
        <ThemeSelector
          currentTheme={currentTheme}
          onThemeChange={handleThemeChange}
          onClose={() => setShowThemeSelector(false)}
        />
      )}
    </div>
  );
}

export default PresentationEditor;
