import { useState } from 'react';
import { Palette, X } from 'lucide-react';
import './ThemeSelector.css';

const THEMES = [
  {
    id: 'purple-gradient',
    name: 'Purple Gradient',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    textColor: '#ffffff',
    font: 'Inter, sans-serif'
  },
  {
    id: 'blue-ocean',
    name: 'Blue Ocean',
    gradient: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
    primaryColor: '#2193b0',
    secondaryColor: '#6dd5ed',
    textColor: '#ffffff',
    font: 'Inter, sans-serif'
  },
  {
    id: 'sunset',
    name: 'Sunset',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    primaryColor: '#f093fb',
    secondaryColor: '#f5576c',
    textColor: '#ffffff',
    font: 'Inter, sans-serif'
  },
  {
    id: 'forest',
    name: 'Forest',
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    primaryColor: '#11998e',
    secondaryColor: '#38ef7d',
    textColor: '#ffffff',
    font: 'Inter, sans-serif'
  },
  {
    id: 'fire',
    name: 'Fire',
    gradient: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
    primaryColor: '#f12711',
    secondaryColor: '#f5af19',
    textColor: '#ffffff',
    font: 'Inter, sans-serif'
  },
  {
    id: 'midnight',
    name: 'Midnight',
    gradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    primaryColor: '#0f2027',
    secondaryColor: '#2c5364',
    textColor: '#ffffff',
    font: 'Inter, sans-serif'
  },
  {
    id: 'professional',
    name: 'Professional',
    gradient: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    primaryColor: '#1e3c72',
    secondaryColor: '#2a5298',
    textColor: '#ffffff',
    font: 'Georgia, serif'
  },
  {
    id: 'modern',
    name: 'Modern',
    gradient: 'linear-gradient(135deg, #141E30 0%, #243B55 100%)',
    primaryColor: '#141E30',
    secondaryColor: '#243B55',
    textColor: '#ffffff',
    font: 'Helvetica, sans-serif'
  }
];

const FONTS = [
  { id: 'inter', name: 'Inter', value: 'Inter, sans-serif' },
  { id: 'georgia', name: 'Georgia', value: 'Georgia, serif' },
  { id: 'helvetica', name: 'Helvetica', value: 'Helvetica, sans-serif' },
  { id: 'arial', name: 'Arial', value: 'Arial, sans-serif' },
  { id: 'times', name: 'Times New Roman', value: '"Times New Roman", serif' },
  { id: 'courier', name: 'Courier', value: '"Courier New", monospace' }
];

function ThemeSelector({ currentTheme, onThemeChange, onClose }) {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme || THEMES[0]);
  const [selectedFont, setSelectedFont] = useState(
    FONTS.find(f => f.value === selectedTheme.font) || FONTS[0]
  );

  const handleThemeSelect = (theme) => {
    const newTheme = { ...theme, font: selectedFont.value };
    setSelectedTheme(newTheme);
  };

  const handleFontSelect = (font) => {
    setSelectedFont(font);
    const newTheme = { ...selectedTheme, font: font.value };
    setSelectedTheme(newTheme);
  };

  const handleApply = () => {
    onThemeChange(selectedTheme);
    onClose();
  };

  return (
    <div className="theme-selector-overlay" onClick={onClose}>
      <div className="theme-selector" onClick={(e) => e.stopPropagation()}>
        <div className="theme-header">
          <h2>
            <Palette size={24} />
            Customize Theme
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="theme-section">
          <h3>Color Palette</h3>
          <div className="theme-grid">
            {THEMES.map((theme) => (
              <div
                key={theme.id}
                className={`theme-option ${selectedTheme.id === theme.id ? 'active' : ''}`}
                onClick={() => handleThemeSelect(theme)}
              >
                <div
                  className="theme-preview"
                  style={{ background: theme.gradient }}
                >
                  <span style={{ color: theme.textColor }}>Aa</span>
                </div>
                <span className="theme-name">{theme.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="theme-section">
          <h3>Font Family</h3>
          <div className="font-grid">
            {FONTS.map((font) => (
              <div
                key={font.id}
                className={`font-option ${selectedFont.id === font.id ? 'active' : ''}`}
                onClick={() => handleFontSelect(font)}
              >
                <span style={{ fontFamily: font.value }}>{font.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="theme-preview-section">
          <h3>Preview</h3>
          <div
            className="preview-slide"
            style={{
              background: selectedTheme.gradient,
              color: selectedTheme.textColor,
              fontFamily: selectedFont.value
            }}
          >
            <h1>Sample Title</h1>
            <p>This is how your slides will look with this theme.</p>
            <ul>
              <li>Bullet point example</li>
              <li>Another point</li>
            </ul>
          </div>
        </div>

        <div className="theme-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="apply-btn" onClick={handleApply}>
            Apply Theme
          </button>
        </div>
      </div>
    </div>
  );
}

export default ThemeSelector;
export { THEMES };
