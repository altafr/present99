import { useState } from 'react';
import './App.css';
import HomePage from './components/HomePage';
import PresentationEditor from './components/PresentationEditor';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [presentation, setPresentation] = useState(null);

  const handleCreatePresentation = (slides, topic, existingId = null) => {
    // Use existing ID if loading saved presentation, otherwise create new
    const id = existingId || `pres_${Date.now()}`;
    setPresentation({ slides, topic, id });
    setCurrentView('editor');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setPresentation(null);
  };

  return (
    <div className="app">
      {currentView === 'home' ? (
        <HomePage onCreatePresentation={handleCreatePresentation} />
      ) : (
        <PresentationEditor 
          presentation={presentation}
          onBack={handleBackToHome}
          onUpdatePresentation={setPresentation}
        />
      )}
    </div>
  );
}

export default App;
