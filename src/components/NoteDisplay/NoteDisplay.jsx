// src/components/NoteDisplay/NoteDisplay.jsx
import React, { useState, useEffect } from 'react';
import './NoteDisplay.css';

const NoteDisplay = ({ notes }) => {
  const [wordCount, setWordCount] = useState(0);
  const [copyStatus, setCopyStatus] = useState('');
  const [formattedNotes, setFormattedNotes] = useState('');

  useEffect(() => {
    // Calculate word count whenever notes change
    if (notes) {
      setWordCount(notes.split(/\s+/).filter(Boolean).length);
      
      // Format the notes for display
      formatNotes(notes);
    } else {
      setWordCount(0);
      setFormattedNotes('');
    }
  }, [notes]);

  // Function to process the notes for proper display
  const formatNotes = (text) => {
    if (!text) return '';
    
    // First, escape any existing HTML to prevent injection
    const escapeHtml = (unsafe) => {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    };
    
    let formatted = escapeHtml(text);
    
    // Process line by line to handle different formatting
    const lines = formatted.split('\n');
    const processedLines = lines.map(line => {
      let processedLine = line;
      
      // Handle bolding for term definitions (e.g., "Definition:" or "Example:")
      processedLine = processedLine.replace(/(\w+:)(\s+)/g, '<strong>$1</strong>$2');
      
      // Handle bullet points - if line starts with * and space
      if (processedLine.trim().match(/^\*\s+/)) {
        return processedLine.replace(/^\s*\*\s+/, '• ');
      }
      
      // Handle bullet points - if line starts with - and space
      if (processedLine.trim().match(/^-\s+/)) {
        return processedLine.replace(/^\s*-\s+/, '- ');
      }
      
      return processedLine;
    });
    
    formatted = processedLines.join('\n');
    
    // Handle headers (lines that look like titles but don't have : in them)
    formatted = formatted.replace(/^([A-Z][a-zA-Z\s]+)$/gm, '<h3>$1</h3>');
    
    // Replace double asterisks with bold
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace single asterisks with italic (if not already part of a bullet point)
    formatted = formatted.replace(/(?<!\•)\s\*(.*?)\*(?!\•)/g, ' <em>$1</em>');
    
    setFormattedNotes(formatted);
  };

  const handleCopy = () => {
    if (!notes) return;
    
    navigator.clipboard.writeText(notes)
      .then(() => {
        setCopyStatus('Copied!');
        setTimeout(() => {
          setCopyStatus('');
        }, 2000);
      })
      .catch(() => {
        setCopyStatus('Failed to copy');
      });
  };

  const handleDownload = () => {
    if (!notes) return;
    
    const blob = new Blob([notes], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'study-notes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="note-display-container">
      <div className="note-display-header">
        <h2>Generated Notes</h2>
        <span className="word-count">{wordCount} words</span>
      </div>
      
      <div className="note-display">
        {notes ? (
          <div 
            className="note-content" 
            dangerouslySetInnerHTML={{ __html: formattedNotes }}
          />
        ) : (
          <div className="empty-notes">Your summarized notes will appear here</div>
        )}
      </div>
      
      <div className="button-group">
        <button
          className="copy-button"
          onClick={handleCopy}
          disabled={!notes}
        >
          {copyStatus || 'Copy to Clipboard'}
        </button>
        
        <button
          className="download-button"
          onClick={handleDownload}
          disabled={!notes}
        >
          Download as .txt
        </button>
      </div>
    </div>
  );
};

export default NoteDisplay;