import { useState } from 'react';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import './SlideEditor.css';

function SlideEditor({ slide, onUpdate }) {
  const [title, setTitle] = useState(slide.title);
  const [subtitle, setSubtitle] = useState(slide.subtitle || '');
  const [content, setContent] = useState(slide.content || []);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onUpdate({ ...slide, title: newTitle });
  };

  const handleSubtitleChange = (e) => {
    const newSubtitle = e.target.value;
    setSubtitle(newSubtitle);
    onUpdate({ ...slide, subtitle: newSubtitle });
  };

  const handleContentChange = (index, value) => {
    const newContent = [...content];
    newContent[index] = value;
    setContent(newContent);
    onUpdate({ ...slide, content: newContent });
  };

  const handleAddBullet = () => {
    const newContent = [...content, 'New point'];
    setContent(newContent);
    onUpdate({ ...slide, content: newContent });
  };

  const handleRemoveBullet = (index) => {
    const newContent = content.filter((_, i) => i !== index);
    setContent(newContent);
    onUpdate({ ...slide, content: newContent });
  };

  return (
    <div className="slide-editor">
      <h3 className="editor-title">Edit Slide</h3>

      <div className="editor-section">
        <label className="editor-label">Title</label>
        <input
          type="text"
          className="editor-input"
          value={title}
          onChange={handleTitleChange}
          placeholder="Slide title"
        />
      </div>

      {slide.type === 'title' && (
        <div className="editor-section">
          <label className="editor-label">Subtitle</label>
          <input
            type="text"
            className="editor-input"
            value={subtitle}
            onChange={handleSubtitleChange}
            placeholder="Slide subtitle"
          />
        </div>
      )}

      {slide.type === 'content' && (
        <div className="editor-section">
          <div className="editor-label-row">
            <label className="editor-label">Content</label>
            <button className="add-bullet-btn" onClick={handleAddBullet}>
              <Plus size={16} />
              Add Point
            </button>
          </div>
          <div className="content-list">
            {content.map((item, index) => (
              <div key={index} className="content-item">
                <textarea
                  className="editor-textarea"
                  value={item}
                  onChange={(e) => handleContentChange(index, e.target.value)}
                  placeholder={`Point ${index + 1}`}
                  rows={2}
                />
                <button
                  className="remove-bullet-btn"
                  onClick={() => handleRemoveBullet(index)}
                  title="Remove point"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="editor-section">
        <label className="editor-label">Layout</label>
        <div className="layout-info">
          <span className="layout-badge">{slide.layout}</span>
          <p className="layout-hint">Use the layout button in the toolbar to change</p>
        </div>
      </div>

      <div className="editor-tips">
        <div className="tip-icon">
          <Sparkles size={16} />
        </div>
        <div className="tip-content">
          <strong>Pro Tip:</strong> Keep bullet points concise and impactful. Aim for 3-5 points per slide.
        </div>
      </div>
    </div>
  );
}

export default SlideEditor;
