// src/components/ProcessingIndicator/ProcessingIndicator.jsx
import React from 'react';
import './ProcessingIndicator.css';

const ProcessingIndicator = () => {
  return (
    <div className="processing-container">
      <div className="spinner"></div>
      <p className="processing-text">Generating notes with Aether AI...</p>
      <p className="processing-subtext">This may take a few moments depending on the length and complexity of your text.</p>
    </div>
  );
};

export default ProcessingIndicator;