import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
      <span className="toggle-text">
        {theme === 'light' ? 'Light' : 'Dark'}
      </span>
    </button>
  );
};

export default ThemeToggle;
