// src/components/SettingsPanel/SettingsPanel.jsx
import React, { useState, useEffect, useRef } from 'react';
import './SettingsPanel.css';

const DEFAULT_SYSTEM_PROMPT = `Convert the following text into concise, well-structured study notes.
- Create clear bullet points or numbered lists for hierarchical information
- Identify and preserve key concepts, definitions, and examples
- Remove unnecessary words and verbose explanations
- Maintain the original organizational structure when relevant
- Use short, direct language
- Preserve important terminology`;

const SettingsPanel = ({ settings, onSave, onClose, isVisible }) => {
  const [localSettings, setLocalSettings] = useState({
    temperature: settings.temperature || 0.3,
    maxTokens: settings.maxTokens || 2048,
    systemPrompt: settings.systemPrompt || DEFAULT_SYSTEM_PROMPT
  });
  
  const panelRef = useRef(null);
  
  // Animation effect when component mounts
  useEffect(() => {
    if (isVisible) {
      // Small delay to ensure CSS transition works
      setTimeout(() => {
        if (panelRef.current) {
          panelRef.current.classList.add('visible');
        }
      }, 10);
    }
  }, [isVisible]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Convert number inputs
    if (name === 'temperature' || name === 'maxTokens') {
      setLocalSettings({
        ...localSettings,
        [name]: name === 'temperature' ? parseFloat(value) : parseInt(value, 10)
      });
    } else {
      setLocalSettings({
        ...localSettings,
        [name]: value
      });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(localSettings);
  };
  
  const handleReset = () => {
    setLocalSettings({
      temperature: 0.3,
      maxTokens: 2048,
      systemPrompt: DEFAULT_SYSTEM_PROMPT
    });
  };
  
  const handleClose = () => {
    // Start the exit animation
    if (panelRef.current) {
      panelRef.current.classList.remove('visible');
    }
    
    // Delay the actual closing to allow for animation
    setTimeout(() => {
      onClose();
    }, 300);
  };
  
  return (
    <div className={`settings-overlay ${isVisible ? 'visible' : ''}`} onClick={(e) => {
      // Close when clicking on overlay background
      if (e.target.className.includes('settings-overlay')) {
        handleClose();
      }
    }}>
      <div ref={panelRef} className="settings-panel">
        <div className="settings-header">
          <h2>Aether Chatbot Settings</h2>
          <button className="close-button" onClick={handleClose}>&times;</button>
        </div>
        
        <form className="settings-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="temperature">
              Temperature ({localSettings.temperature})
              <span className="tooltip" title="Controls randomness. Lower values are more focused and deterministic, while higher values produce more creative and varied outputs.">ℹ️</span>
            </label>
            <input 
              type="range" 
              id="temperature" 
              name="temperature" 
              min="0" 
              max="1" 
              step="0.1" 
              value={localSettings.temperature} 
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="maxTokens">
              Max Tokens
              <span className="tooltip" title="Maximum length of the generated response. Higher values allow for longer, more detailed notes, but may take longer to generate.">ℹ️</span>
            </label>
            <input 
              type="number" 
              id="maxTokens" 
              name="maxTokens" 
              min="100" 
              max="8192" 
              value={localSettings.maxTokens} 
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="systemPrompt">
              System Prompt
              <span className="tooltip" title="These instructions guide how the AI generates notes. You can customize this to get different formatting styles or focus areas in your generated notes.">ℹ️</span>
            </label>
            <textarea 
              id="systemPrompt" 
              name="systemPrompt" 
              value={localSettings.systemPrompt} 
              onChange={handleInputChange}
            />
          </div>
          
          <div className="settings-buttons">
            <button 
              type="button" 
              className="reset-button" 
              onClick={handleReset}
            >
              Reset to Default
            </button>
            <button 
              type="submit" 
              className="save-button"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPanel;