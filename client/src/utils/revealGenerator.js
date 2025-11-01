/**
 * Generate Reveal.js HTML presentation from slides
 */

export const generateRevealHTML = (slides, theme, presentationTitle) => {
  const themeColors = {
    gradient: theme.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    primaryColor: theme.primaryColor || '#667eea',
    textColor: theme.textColor || '#ffffff',
    headerBg: theme.headerBg || theme.gradient,
    headerText: theme.headerText || '#ffffff',
    hasHeader: theme.hasHeader || false
  };

  const slideHTML = slides.map(slide => {
    return generateSlideHTML(slide, themeColors);
  }).join('\n');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${presentationTitle}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reset.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/theme/black.css">
  <style>
    .reveal {
      font-family: ${theme.font || 'Inter, sans-serif'};
    }
    
    .reveal .slides section {
      background: ${themeColors.gradient};
      color: ${themeColors.textColor};
      text-align: left;
      padding: 3rem;
    }
    
    .reveal .slide-header {
      background: ${themeColors.headerBg};
      color: ${themeColors.headerText};
      padding: 1.5rem 3rem;
      margin: -3rem -3rem 2rem -3rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .reveal .slide-header h3 {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 600;
    }
    
    .reveal h1 {
      font-size: 3.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
    
    .reveal h2 {
      font-size: 2.5rem;
      font-weight: 600;
      margin-bottom: 2rem;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
    
    .reveal h3 {
      font-size: 1.8rem;
      font-weight: 600;
    }
    
    .reveal p {
      font-size: 1.5rem;
      opacity: 0.9;
    }
    
    .reveal ul {
      list-style: none;
      padding: 0;
    }
    
    .reveal li {
      font-size: 1.4rem;
      line-height: 1.6;
      padding-left: 2rem;
      position: relative;
      margin-bottom: 1.25rem;
    }
    
    .reveal li::before {
      content: '•';
      position: absolute;
      left: 0;
      font-size: 1.8rem;
      opacity: 0.8;
    }
    
    .reveal .two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
    }
    
    .reveal .image-text {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      align-items: center;
    }
    
    .reveal img {
      max-width: 100%;
      border-radius: 12px;
    }
    
    .reveal .quote-text {
      font-size: 2.5rem;
      font-style: italic;
      text-align: center;
      margin: 2rem 0;
    }
    
    .reveal .quote-author {
      font-size: 1.5rem;
      text-align: center;
      opacity: 0.8;
      margin-top: 2rem;
    }
    
    .reveal .section-number {
      font-size: 8rem;
      font-weight: 700;
      opacity: 0.2;
      text-align: center;
    }
    
    .reveal .section-title {
      font-size: 4rem;
      font-weight: 700;
      text-align: center;
    }
    
    .reveal .comparison {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 2rem;
    }
    
    .reveal .comparison-divider {
      width: 2px;
      background: rgba(255, 255, 255, 0.3);
    }
    
    .reveal .comparison-header {
      font-size: 1.8rem;
      font-weight: 600;
      text-align: center;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid rgba(255, 255, 255, 0.3);
      margin-bottom: 1rem;
    }
    
    .reveal .slide-footer {
      position: absolute;
      bottom: 1.5rem;
      right: 2rem;
      font-size: 1rem;
      opacity: 0.7;
    }
  </style>
</head>
<body>
  <div class="reveal">
    <div class="slides">
${slideHTML}
    </div>
  </div>
  
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.js"></script>
  <script>
    Reveal.initialize({
      hash: true,
      controls: true,
      progress: true,
      center: false,
      transition: 'slide',
      width: 1920,
      height: 1080,
      margin: 0,
      pdfMaxPagesPerSlide: 1,
      pdfSeparateFragments: false
    });
  </script>
</body>
</html>
  `.trim();
};

function generateSlideHTML(slide, themeColors) {
  const hasHeader = themeColors.hasHeader && slide.layout !== 'title';
  
  let content = '';
  
  switch (slide.layout) {
    case 'title':
      content = `
      <section>
        <div style="text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <h1>${escapeHtml(slide.title)}</h1>
          ${slide.subtitle ? `<p style="font-size: 1.5rem; opacity: 0.9;">${escapeHtml(slide.subtitle)}</p>` : ''}
        </div>
      </section>`;
      break;
      
    case 'content':
      content = `
      <section>
        ${hasHeader ? `<div class="slide-header"><h3>${escapeHtml(slide.title)}</h3></div>` : `<h2>${escapeHtml(slide.title)}</h2>`}
        <ul>
          ${slide.content ? slide.content.map(item => `<li>${escapeHtml(item)}</li>`).join('\n          ') : ''}
        </ul>
        <div class="slide-footer"><span>${slide.id}</span></div>
      </section>`;
      break;
      
    case 'two-column':
      const midpoint = slide.content ? Math.ceil(slide.content.length / 2) : 0;
      const leftContent = slide.content ? slide.content.slice(0, midpoint) : [];
      const rightContent = slide.content ? slide.content.slice(midpoint) : [];
      content = `
      <section>
        ${hasHeader ? `<div class="slide-header"><h3>${escapeHtml(slide.title)}</h3></div>` : `<h2>${escapeHtml(slide.title)}</h2>`}
        <div class="two-column">
          <ul>
            ${leftContent.map(item => `<li>${escapeHtml(item)}</li>`).join('\n            ')}
          </ul>
          <ul>
            ${rightContent.map(item => `<li>${escapeHtml(item)}</li>`).join('\n            ')}
          </ul>
        </div>
        <div class="slide-footer"><span>${slide.id}</span></div>
      </section>`;
      break;
      
    case 'image-text':
      content = `
      <section>
        ${hasHeader ? `<div class="slide-header"><h3>${escapeHtml(slide.title)}</h3></div>` : `<h2>${escapeHtml(slide.title)}</h2>`}
        <div class="image-text">
          ${slide.imageUrl ? `<img src="${escapeHtml(slide.imageUrl)}" alt="${escapeHtml(slide.title)}">` : '<div style="background: rgba(255,255,255,0.1); border: 2px dashed rgba(255,255,255,0.3); border-radius: 12px; height: 400px; display: flex; align-items: center; justify-content: center;">Image</div>'}
          <ul>
            ${slide.content ? slide.content.map(item => `<li>${escapeHtml(item)}</li>`).join('\n            ') : ''}
          </ul>
        </div>
        <div class="slide-footer"><span>${slide.id}</span></div>
      </section>`;
      break;
      
    case 'big-image':
      content = `
      <section>
        ${hasHeader ? `<div class="slide-header"><h3>${escapeHtml(slide.title)}</h3></div>` : `<h2>${escapeHtml(slide.title)}</h2>`}
        ${slide.imageUrl ? `<img src="${escapeHtml(slide.imageUrl)}" alt="${escapeHtml(slide.title)}" style="max-height: 70vh; margin: 2rem auto; display: block;">` : '<div style="background: rgba(255,255,255,0.1); border: 2px dashed rgba(255,255,255,0.3); border-radius: 12px; height: 60vh; display: flex; align-items: center; justify-content: center; margin: 2rem 0;">Large Image</div>'}
        ${slide.content && slide.content[0] ? `<p style="text-align: center; font-style: italic; opacity: 0.9;">${escapeHtml(slide.content[0])}</p>` : ''}
        <div class="slide-footer"><span>${slide.id}</span></div>
      </section>`;
      break;
      
    case 'quote':
      const quoteText = slide.content && slide.content[0] ? slide.content[0] : slide.title;
      content = `
      <section>
        <div style="text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <div class="quote-text">"${escapeHtml(quoteText)}"</div>
          ${slide.subtitle ? `<div class="quote-author">— ${escapeHtml(slide.subtitle)}</div>` : ''}
        </div>
        <div class="slide-footer"><span>${slide.id}</span></div>
      </section>`;
      break;
      
    case 'section-header':
      content = `
      <section>
        <div style="text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <div class="section-number">${slide.sectionNumber || slide.id}</div>
          <div class="section-title">${escapeHtml(slide.title)}</div>
          ${slide.subtitle ? `<p style="font-size: 1.8rem; opacity: 0.9; margin-top: 2rem;">${escapeHtml(slide.subtitle)}</p>` : ''}
        </div>
        <div class="slide-footer"><span>${slide.id}</span></div>
      </section>`;
      break;
      
    case 'comparison':
      const leftItems = slide.content ? slide.content.slice(0, Math.ceil(slide.content.length / 2)) : [];
      const rightItems = slide.content ? slide.content.slice(Math.ceil(slide.content.length / 2)) : [];
      content = `
      <section>
        ${hasHeader ? `<div class="slide-header"><h3>${escapeHtml(slide.title)}</h3></div>` : `<h2>${escapeHtml(slide.title)}</h2>`}
        <div class="comparison">
          <div>
            <div class="comparison-header">${escapeHtml(slide.leftHeader || 'Option A')}</div>
            <ul>
              ${leftItems.map(item => `<li>${escapeHtml(item)}</li>`).join('\n              ')}
            </ul>
          </div>
          <div class="comparison-divider"></div>
          <div>
            <div class="comparison-header">${escapeHtml(slide.rightHeader || 'Option B')}</div>
            <ul>
              ${rightItems.map(item => `<li>${escapeHtml(item)}</li>`).join('\n              ')}
            </ul>
          </div>
        </div>
        <div class="slide-footer"><span>${slide.id}</span></div>
      </section>`;
      break;
      
    default:
      content = `
      <section>
        ${hasHeader ? `<div class="slide-header"><h3>${escapeHtml(slide.title)}</h3></div>` : `<h2>${escapeHtml(slide.title)}</h2>`}
        <ul>
          ${slide.content ? slide.content.map(item => `<li>${escapeHtml(item)}</li>`).join('\n          ') : ''}
        </ul>
        <div class="slide-footer"><span>${slide.id}</span></div>
      </section>`;
  }
  
  return content;
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export const openRevealPresentation = (slides, theme, presentationTitle) => {
  const html = generateRevealHTML(slides, theme, presentationTitle);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Open in new window
  const win = window.open(url, '_blank');
  
  if (!win) {
    alert('Please allow popups to view the presentation');
    return;
  }
  
  // Clean up URL after window loads
  win.addEventListener('load', () => {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
};
