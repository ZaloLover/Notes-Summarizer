// src/components/Header/Header.jsx
import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <div className="header-container">
      <div className="header-pill">
        <h1 className="app-title">Notes Summarizer</h1>
        <p className="app-subtitle">Powered by Aether</p>
      </div>
    </div>
  );
};

export default Header;