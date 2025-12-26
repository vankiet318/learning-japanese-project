import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
      <div className={`icon ${theme}`}>
        {theme === 'light' ? '🌸' : '🏙️'}
      </div>
      <span className="toggle-text">
        {theme === 'light' ? 'Traditional' : 'Modern'}
      </span>
    </button>
  );
};

export default ThemeToggle;
