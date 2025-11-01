import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import pptxgen from 'pptxgenjs';

export const exportToPDF = async (slides, presentationTitle) => {
  try {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [1920, 1080]
    });

    let addedSlides = 0;

    for (let i = 0; i < slides.length; i++) {
      const slideElement = document.getElementById(`slide-${slides[i].id}`);
      
      if (!slideElement) {
        console.warn(`Slide ${slides[i].id} not found`);
        continue;
      }

      try {
        console.log(`Capturing slide ${i + 1}/${slides.length}...`);
        
        // Capture the slide as canvas with better settings
        const canvas = await html2canvas(slideElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: slideElement.offsetWidth,
          height: slideElement.offsetHeight,
          windowWidth: slideElement.offsetWidth,
          windowHeight: slideElement.offsetHeight
        });

        const imgData = canvas.toDataURL('image/png', 1.0);
        
        // Add new page for each slide except the first
        if (addedSlides > 0) {
          pdf.addPage();
        }

        // Calculate dimensions to maintain aspect ratio
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasAspect = canvas.width / canvas.height;
        const pdfAspect = pdfWidth / pdfHeight;
        
        let imgWidth = pdfWidth;
        let imgHeight = pdfHeight;
        let xOffset = 0;
        let yOffset = 0;

        // Maintain aspect ratio
        if (canvasAspect > pdfAspect) {
          imgHeight = pdfWidth / canvasAspect;
          yOffset = (pdfHeight - imgHeight) / 2;
        } else {
          imgWidth = pdfHeight * canvasAspect;
          xOffset = (pdfWidth - imgWidth) / 2;
        }
        
        pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight, undefined, 'FAST');
        addedSlides++;
        
        console.log(`Slide ${i + 1} captured successfully`);
      } catch (error) {
        console.error(`Error capturing slide ${slides[i].id}:`, error);
      }
    }

    if (addedSlides === 0) {
      throw new Error('No slides were captured');
    }

    // Save the PDF
    const fileName = `${presentationTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_presentation.pdf`;
    pdf.save(fileName);
    
    console.log(`PDF exported successfully with ${addedSlides} slides`);
    return true;
  } catch (error) {
    console.error('PDF export failed:', error);
    throw error;
  }
};

export const exportToPPTX = async (slides, presentationTitle) => {
  try {
    const pptx = new pptxgen();
    
    // Set presentation properties
    pptx.author = 'Present99';
    pptx.title = presentationTitle;
    pptx.subject = 'AI-Generated Presentation';
    pptx.layout = 'LAYOUT_16x9';
    
    for (const slide of slides) {
      const pptxSlide = pptx.addSlide();
      
      // Set background gradient (don't use images as backgrounds)
      pptxSlide.background = { fill: '667eea' };
    
    switch (slide.layout) {
      case 'title':
        // Title slide
        pptxSlide.addText(slide.title, {
          x: 0.5,
          y: '40%',
          w: '90%',
          h: 1.5,
          fontSize: 54,
          bold: true,
          color: 'FFFFFF',
          align: 'center',
          valign: 'middle'
        });
        
        if (slide.subtitle) {
          pptxSlide.addText(slide.subtitle, {
            x: 0.5,
            y: '55%',
            w: '90%',
            h: 0.8,
            fontSize: 28,
            color: 'FFFFFF',
            align: 'center',
            valign: 'middle'
          });
        }
        break;
        
      case 'content':
        // Content slide with bullets
        pptxSlide.addText(slide.title, {
          x: 0.5,
          y: 0.5,
          w: '90%',
          h: 0.8,
          fontSize: 36,
          bold: true,
          color: 'FFFFFF'
        });
        
        if (slide.content && slide.content.length > 0) {
          pptxSlide.addText(
            slide.content.map(item => ({ text: item, options: { bullet: true } })),
            {
              x: 0.5,
              y: 1.5,
              w: '90%',
              h: 4,
              fontSize: 20,
              color: 'FFFFFF',
              lineSpacing: 32
            }
          );
        }
        break;
        
      case 'two-column':
        // Two column layout
        pptxSlide.addText(slide.title, {
          x: 0.5,
          y: 0.5,
          w: '90%',
          h: 0.8,
          fontSize: 36,
          bold: true,
          color: 'FFFFFF'
        });
        
        if (slide.content && slide.content.length > 0) {
          const midpoint = Math.ceil(slide.content.length / 2);
          const leftContent = slide.content.slice(0, midpoint);
          const rightContent = slide.content.slice(midpoint);
          
          // Left column
          pptxSlide.addText(
            leftContent.map(item => ({ text: item, options: { bullet: true } })),
            {
              x: 0.5,
              y: 1.5,
              w: '42%',
              h: 4,
              fontSize: 18,
              color: 'FFFFFF',
              lineSpacing: 28
            }
          );
          
          // Right column
          pptxSlide.addText(
            rightContent.map(item => ({ text: item, options: { bullet: true } })),
            {
              x: '52%',
              y: 1.5,
              w: '42%',
              h: 4,
              fontSize: 18,
              color: 'FFFFFF',
              lineSpacing: 28
            }
          );
        }
        break;
        
      case 'image-text':
        // Image + text layout
        pptxSlide.addText(slide.title, {
          x: 0.5,
          y: 0.5,
          w: '90%',
          h: 0.8,
          fontSize: 36,
          bold: true,
          color: 'FFFFFF'
        });
        
        // Add image if available (skip external URLs for now)
        if (slide.imageUrl && !slide.imageUrl.startsWith('http')) {
          try {
            pptxSlide.addImage({
              data: slide.imageUrl,
              x: 0.5,
              y: 1.5,
              w: 4.5,
              h: 3.5
            });
          } catch (error) {
            console.warn('Could not add image:', error);
          }
        }
        
        // Add content on the right
        if (slide.content && slide.content.length > 0) {
          pptxSlide.addText(
            slide.content.map(item => ({ text: item, options: { bullet: true } })),
            {
              x: 5.2,
              y: 1.5,
              w: 4.3,
              h: 4,
              fontSize: 18,
              color: 'FFFFFF',
              lineSpacing: 28
            }
          );
        }
        break;
        
      case 'big-image':
        // Big image layout
        pptxSlide.addText(slide.title, {
          x: 0.5,
          y: 0.5,
          w: '90%',
          h: 0.8,
          fontSize: 36,
          bold: true,
          color: 'FFFFFF'
        });
        
        if (slide.content && slide.content[0]) {
          pptxSlide.addText(slide.content[0], {
            x: 0.5,
            y: 5.5,
            w: '90%',
            h: 0.5,
            fontSize: 18,
            color: 'FFFFFF',
            align: 'center',
            italic: true
          });
        }
        break;
        
      case 'quote':
        // Quote layout
        const quoteText = slide.content && slide.content[0] ? slide.content[0] : slide.title;
        pptxSlide.addText(quoteText, {
          x: 1,
          y: '35%',
          w: '80%',
          h: 2,
          fontSize: 32,
          color: 'FFFFFF',
          align: 'center',
          valign: 'middle',
          italic: true
        });
        
        if (slide.subtitle) {
          pptxSlide.addText(`— ${slide.subtitle}`, {
            x: 1,
            y: '55%',
            w: '80%',
            h: 0.6,
            fontSize: 20,
            color: 'FFFFFF',
            align: 'center'
          });
        }
        break;
        
      case 'section-header':
        // Section header layout
        if (slide.sectionNumber || slide.id) {
          pptxSlide.addText(slide.sectionNumber || slide.id, {
            x: 0.5,
            y: '25%',
            w: '90%',
            h: 1.5,
            fontSize: 96,
            bold: true,
            color: 'FFFFFF',
            align: 'center',
            transparency: 80
          });
        }
        
        pptxSlide.addText(slide.title, {
          x: 0.5,
          y: '45%',
          w: '90%',
          h: 1.2,
          fontSize: 48,
          bold: true,
          color: 'FFFFFF',
          align: 'center'
        });
        
        if (slide.subtitle) {
          pptxSlide.addText(slide.subtitle, {
            x: 0.5,
            y: '60%',
            w: '90%',
            h: 0.8,
            fontSize: 24,
            color: 'FFFFFF',
            align: 'center'
          });
        }
        break;
        
      case 'comparison':
        // Comparison layout
        pptxSlide.addText(slide.title, {
          x: 0.5,
          y: 0.5,
          w: '90%',
          h: 0.8,
          fontSize: 36,
          bold: true,
          color: 'FFFFFF'
        });
        
        if (slide.content && slide.content.length > 0) {
          const midpoint = Math.ceil(slide.content.length / 2);
          const leftContent = slide.content.slice(0, midpoint);
          const rightContent = slide.content.slice(midpoint);
          
          // Left column header
          pptxSlide.addText(slide.leftHeader || 'Option A', {
            x: 0.5,
            y: 1.3,
            w: '42%',
            h: 0.5,
            fontSize: 24,
            bold: true,
            color: 'FFFFFF',
            align: 'center'
          });
          
          // Left column content
          pptxSlide.addText(
            leftContent.map(item => ({ text: item, options: { bullet: true } })),
            {
              x: 0.5,
              y: 2,
              w: '42%',
              h: 3.5,
              fontSize: 16,
              color: 'FFFFFF',
              lineSpacing: 24
            }
          );
          
          // Right column header
          pptxSlide.addText(slide.rightHeader || 'Option B', {
            x: '52%',
            y: 1.3,
            w: '42%',
            h: 0.5,
            fontSize: 24,
            bold: true,
            color: 'FFFFFF',
            align: 'center'
          });
          
          // Right column content
          pptxSlide.addText(
            rightContent.map(item => ({ text: item, options: { bullet: true } })),
            {
              x: '52%',
              y: 2,
              w: '42%',
              h: 3.5,
              fontSize: 16,
              color: 'FFFFFF',
              lineSpacing: 24
            }
          );
        }
        break;
    }
    
    // Add slide number
    pptxSlide.addText(slide.id, {
      x: '90%',
      y: '92%',
      w: 0.8,
      h: 0.4,
      fontSize: 14,
      color: 'FFFFFF',
      align: 'center'
    });
  }
  
  // Save the presentation
    const fileName = `${presentationTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_presentation.pptx`;
    await pptx.writeFile({ fileName });
    
    console.log('PPTX exported successfully');
    return true;
  } catch (error) {
    console.error('PPTX export failed:', error);
    throw new Error(`Failed to export PPTX: ${error.message}`);
  }
};

export const exportToImages = async (slides) => {
  const images = [];

  for (const slide of slides) {
    const slideElement = document.getElementById(`slide-${slide.id}`);
    
    if (!slideElement) {
      console.warn(`Slide ${slide.id} not found`);
      continue;
    }

    try {
      const canvas = await html2canvas(slideElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: null
      });

      const imgData = canvas.toDataURL('image/png');
      images.push({
        id: slide.id,
        data: imgData
      });
    } catch (error) {
      console.error(`Error capturing slide ${slide.id}:`, error);
    }
  }

  return images;
};
