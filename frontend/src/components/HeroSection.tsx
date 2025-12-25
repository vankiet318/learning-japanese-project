import React from 'react';
import './HeroSection.css';

const HeroSection: React.FC = () => {
  return (
    <div className="hero-section">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="hero-accent"></div>
        <div className="hero-text">
          <span className="hero-jp-title">日本語学習</span>
          <h2 className="hero-en-title">Master Japanese</h2>
          <p className="hero-description">
            Your journey through the language of Zen begins here. 
            Experience a serene and effective way to learn Hiragana, Katakana, and beyond.
          </p>
          <div className="hero-calligraphy">
            <span className="char">夢</span>
            <span className="char">道</span>
            <span className="char">平</span>
            <span className="char">和</span>
          </div>
        </div>
      </div>
      
      {/* Dynamic Background Elements */}
      <div className="hero-circle hero-circle-1"></div>
      <div className="hero-circle hero-circle-2"></div>
    </div>
  );
};

export default HeroSection;
