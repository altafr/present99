import './SlideCanvas.css';

function SlideCanvas({ slide, theme }) {
  const defaultTheme = {
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
    font: 'Inter, sans-serif'
  };
  
  const activeTheme = theme || defaultTheme;
  const renderContent = () => {
    switch (slide.layout) {
      case 'title':
        return (
          <div className="slide-layout slide-title">
            <h1 className="slide-main-title">{slide.title}</h1>
            {slide.subtitle && (
              <p className="slide-subtitle">{slide.subtitle}</p>
            )}
          </div>
        );

      case 'content':
        return (
          <div className="slide-layout slide-content">
            <h2 className="slide-heading">{slide.title}</h2>
            <ul className="slide-list">
              {slide.content && slide.content.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        );

      case 'two-column':
        const midpoint = slide.content ? Math.ceil(slide.content.length / 2) : 0;
        const leftContent = slide.content ? slide.content.slice(0, midpoint) : [];
        const rightContent = slide.content ? slide.content.slice(midpoint) : [];
        
        return (
          <div className="slide-layout slide-two-column">
            <h2 className="slide-heading">{slide.title}</h2>
            <div className="two-column-container">
              <ul className="slide-list">
                {leftContent.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <ul className="slide-list">
                {rightContent.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'image-text':
        return (
          <div className="slide-layout slide-image-text">
            <h2 className="slide-heading">{slide.title}</h2>
            <div className="image-text-container">
              {slide.imageUrl ? (
                <div className="slide-image-container">
                  <img src={slide.imageUrl} alt={slide.title} className="slide-image" />
                </div>
              ) : (
                <div className="image-placeholder">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span>Image</span>
                </div>
              )}
              <ul className="slide-list">
                {slide.content && slide.content.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'big-image':
        return (
          <div className="slide-layout slide-big-image">
            <h2 className="slide-heading">{slide.title}</h2>
            {slide.imageUrl ? (
              <div className="big-image-container">
                <img src={slide.imageUrl} alt={slide.title} className="big-image" />
              </div>
            ) : (
              <div className="big-image-placeholder">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <span>Large Image</span>
              </div>
            )}
            {slide.content && slide.content[0] && (
              <p className="image-caption">{slide.content[0]}</p>
            )}
          </div>
        );

      case 'quote':
        return (
          <div className="slide-layout slide-quote">
            <div className="quote-container">
              <svg className="quote-icon" width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
              </svg>
              <blockquote className="quote-text">
                {slide.content && slide.content[0] ? slide.content[0] : slide.title}
              </blockquote>
              {slide.subtitle && (
                <cite className="quote-author">— {slide.subtitle}</cite>
              )}
            </div>
          </div>
        );

      case 'section-header':
        return (
          <div className="slide-layout slide-section-header">
            <div className="section-number">{slide.sectionNumber || slide.id}</div>
            <h1 className="section-title">{slide.title}</h1>
            {slide.subtitle && (
              <p className="section-subtitle">{slide.subtitle}</p>
            )}
          </div>
        );

      case 'comparison':
        const leftItems = slide.content ? slide.content.slice(0, Math.ceil(slide.content.length / 2)) : [];
        const rightItems = slide.content ? slide.content.slice(Math.ceil(slide.content.length / 2)) : [];
        
        return (
          <div className="slide-layout slide-comparison">
            <h2 className="slide-heading">{slide.title}</h2>
            <div className="comparison-container">
              <div className="comparison-column">
                <h3 className="comparison-header">{slide.leftHeader || 'Option A'}</h3>
                <ul className="slide-list">
                  {leftItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="comparison-divider"></div>
              <div className="comparison-column">
                <h3 className="comparison-header">{slide.rightHeader || 'Option B'}</h3>
                <ul className="slide-list">
                  {rightItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="slide-layout slide-content">
            <h2 className="slide-heading">{slide.title}</h2>
            {slide.content && (
              <ul className="slide-list">
                {slide.content.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        );
    }
  };

  return (
    <div 
      className="slide-canvas" 
      id={`slide-${slide.id}`}
      style={{
        background: slide.imageUrl && slide.layout !== 'image-text' 
          ? `${activeTheme.gradient}, url(${slide.imageUrl})`
          : activeTheme.gradient,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: slide.imageUrl ? 'overlay' : 'normal',
        color: activeTheme.textColor,
        fontFamily: activeTheme.font
      }}
    >
      {renderContent()}
      <div className="slide-footer">
        <span className="slide-number">{slide.id}</span>
      </div>
    </div>
  );
}

export default SlideCanvas;
