import React, { useState } from 'react';
import { HIRAGANA_ROWS } from '../constants/hiragana';
import { soundService } from '../utils/SoundService';
import './QuizSetup.css';

interface QuizSetupProps {
  onStart: (settings: { selectedRows: string[], questionCount: number | 'infinity' }) => void;
  onCancel: () => void;
}

const QuizSetup: React.FC<QuizSetupProps> = ({ onStart, onCancel }) => {
  const [selectedRows, setSelectedRows] = useState<string[]>(HIRAGANA_ROWS.map(r => r.name));
  const [questionCount, setQuestionCount] = useState<number | 'infinity'>(10);

  const toggleRow = (rowName: string) => {
    soundService.playClick();
    setSelectedRows(prev => 
      prev.includes(rowName) 
        ? prev.filter(r => r !== rowName)
        : [...prev, rowName]
    );
  };

  const handleSelectAll = () => {
    soundService.playClick();
    if (selectedRows.length === HIRAGANA_ROWS.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(HIRAGANA_ROWS.map(r => r.name));
    }
  };

  const isStartDisabled = selectedRows.length === 0;

  return (
    <div className="quiz-setup-overlay" onClick={() => {
      soundService.playClick();
      onCancel();
    }}>
      <div className="quiz-setup-modal" onClick={(e) => e.stopPropagation()}>
        <div className="setup-header">
          <span className="jp-label">クイズ設定</span>
          <h2>Quiz Configuration</h2>
          <p>Select the rows and number of questions</p>
        </div>

        <div className="setup-section">
          <div className="section-header">
            <h3>Select Rows</h3>
            <button className="btn-text-only" onClick={handleSelectAll}>
              {selectedRows.length === HIRAGANA_ROWS.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="rows-grid">
            {HIRAGANA_ROWS.map(row => (
              <label key={row.name} className={`row-checkbox-label ${selectedRows.includes(row.name) ? 'selected' : ''}`}>
                <input 
                  type="checkbox" 
                  checked={selectedRows.includes(row.name)} 
                  onChange={() => toggleRow(row.name)}
                />
                <span className="row-name">{row.name}</span>
                <span className="row-chars">({row.chars.map(c => c.char).join('')})</span>
              </label>
            ))}
          </div>
        </div>

        <div className="setup-section">
          <h3>Number of Questions</h3>
          <div className="count-options">
            {[10, 20, 50, 'infinity'].map(count => (
              <button 
                key={count}
                className={`count-btn ${questionCount === count ? 'active' : ''}`}
                onClick={() => {
                  soundService.playClick();
                  setQuestionCount(count as number | 'infinity');
                }}
              >
                {count === 'infinity' ? <span className="infinity-icon">∞</span> : count}
              </button>
            ))}
          </div>
        </div>

        <div className="setup-actions">
          <button className="btn-setup secondary" onClick={() => {
            soundService.playClick();
            onCancel();
          }}>Cancel</button>
          <button 
            className="btn-setup primary" 
            onClick={() => onStart({ selectedRows, questionCount })}
            disabled={isStartDisabled}
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizSetup;
