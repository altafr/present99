import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import pptxgen from 'pptxgenjs';

export const exportToPDF = async (slides, presentationTitle) => {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [1920, 1080]
  });

  for (let i = 0; i < slides.length; i++) {
    const slideElement = document.getElementById(`slide-${slides[i].id}`);
    
    if (!slideElement) {
      console.warn(`Slide ${slides[i].id} not found`);
      continue;
    }

    try {
      // Capture the slide as canvas
      const canvas = await html2canvas(slideElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: null
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Add new page for each slide except the first
      if (i > 0) {
        pdf.addPage();
      }

      // Add image to PDF
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    } catch (error) {
      console.error(`Error capturing slide ${slides[i].id}:`, error);
    }
  }

  // Save the PDF
  const fileName = `${presentationTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_presentation.pdf`;
  pdf.save(fileName);
};

export const exportToPPTX = async (slides, presentationTitle) => {
  const pptx = new pptxgen();
  
  // Set presentation properties
  pptx.author = 'Present99';
  pptx.title = presentationTitle;
  pptx.subject = 'AI-Generated Presentation';
  
  for (const slide of slides) {
    const pptxSlide = pptx.addSlide();
    
    // Set background gradient
    pptxSlide.background = { fill: '667eea' };
    
    // Add background image if available
    if (slide.imageUrl && slide.layout !== 'image-text') {
      try {
        pptxSlide.background = { data: slide.imageUrl };
      } catch (error) {
        console.warn('Could not add background image:', error);
      }
    }
    
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
        
        // Add image if available
        if (slide.imageUrl) {
          try {
            pptxSlide.addImage({
              data: slide.imageUrl,
              x: 0.5,
              y: 1.5,
              w: 4.5,
              h: 3.5,
              sizing: { type: 'cover' }
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
