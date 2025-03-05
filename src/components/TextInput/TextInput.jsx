// src/components/TextInput/TextInput.jsx
import React, { useState, useEffect } from 'react';
import './TextInput.css'; // Make sure this file exists in the same folder

const TextInput = ({ value, onChange, onGenerate, onClear, disabled }) => {
  const [wordCount, setWordCount] = useState(0);
  
  useEffect(() => {
    // Calculate word count whenever value changes
    if (value) {
      setWordCount(value.split(/\s+/).filter(Boolean).length);
    } else {
      setWordCount(0);
    }
  }, [value]);
  
  const handleChange = (e) => {
    onChange(e.target.value);
  };
  
  return (
    <div className="text-input-container">
      <div className="text-input-header">
        <h2>Input Text</h2>
        <span className="word-count">{wordCount} words</span>
      </div>
      
      <textarea
        className="text-input"
        value={value}
        onChange={handleChange}
        placeholder="Paste your text here to convert into clean, structured study notes..."
        disabled={disabled}
      />
      
      <div className="button-group">
        <button
          className="generate-button"
          onClick={onGenerate}
          disabled={disabled || !value.trim()}
        >
          {disabled ? 'Processing...' : 'Generate Notes'}
        </button>
        
        <button
          className="clear-button"
          onClick={onClear}
          disabled={disabled || !value.trim()}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default TextInput;