import { useState, useEffect } from 'react';
import { FileText, Trash2, Clock, Presentation } from 'lucide-react';
import { getAllPresentations, deletePresentation } from '../utils/storage';
import './PresentationLibrary.css';

function PresentationLibrary({ onLoadPresentation }) {
  const [presentations, setPresentations] = useState([]);

  useEffect(() => {
    loadPresentations();
  }, []);

  const loadPresentations = async () => {
    try {
      const loadedPresentations = await getAllPresentations();
      setPresentations(loadedPresentations);
    } catch (error) {
      console.error('Error loading presentations:', error);
    }
  };

  const handleDelete = async (id, event) => {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this presentation?')) {
      try {
        await deletePresentation(id);
        loadPresentations();
      } catch (error) {
        console.error('Error deleting presentation:', error);
        alert('Failed to delete presentation');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (presentations.length === 0) {
    return null;
  }

  return (
    <div className="presentation-library">
      <h2>
        <FileText size={24} />
        Your Presentations
      </h2>
      <div className="presentations-grid">
        {presentations.map((pres) => (
          <div
            key={pres.id}
            className="presentation-card"
            onClick={() => onLoadPresentation(pres)}
          >
            <div className="card-header">
              <Presentation size={20} />
              <button
                className="delete-btn"
                onClick={(e) => handleDelete(pres.id, e)}
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <h3>{pres.topic}</h3>
            <div className="card-meta">
              <span className="slide-count">{pres.slides?.length || 0} slides</span>
              <span className="last-modified">
                <Clock size={14} />
                {formatDate(pres.lastModified)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PresentationLibrary;
