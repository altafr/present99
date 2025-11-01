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
