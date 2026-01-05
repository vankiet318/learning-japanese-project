import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HIRAGANA_DATA } from '../constants/hiragana';
import { soundService } from '../utils/SoundService';
import QuizSetup from '../components/QuizSetup';
import './HiraganaPage.css';

const HiraganaPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeChar, setActiveChar] = useState<string | null>(null);
  const [showSetup, setShowSetup] = useState(false);

  const playPronunciation = (char: string) => {
    soundService.playClick();
    setActiveChar(char);
    
    const utterance = new SpeechSynthesisUtterance(char);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);

    setTimeout(() => setActiveChar(null), 1000);
  };

  const startQuiz = (settings: { selectedRows: string[], questionCount: number | 'infinity' }) => {
    soundService.playClick();
    navigate('/quiz', { state: settings });
  };

  return (
    <div className="hiragana-container">
      {showSetup && (
        <QuizSetup 
          onStart={startQuiz} 
          onCancel={() => setShowSetup(false)} 
        />
      )}
      <div className="hiragana-header">
        <div className="header-info">
          <span className="jp-subtitle">ひらがな</span>
          <h1>Hiragana Alphabet</h1>
          <p>Click a character to hear its pronunciation</p>
          
          <button 
            className="btn-test"
            onClick={() => {
              soundService.playClick();
              setShowSetup(true);
            }}
          >
            Test Your Knowledge
          </button>
        </div>
      </div>

      <div className="hiragana-grid">
        {HIRAGANA_DATA.map((item, index) => (
          item.char ? (
            <div 
              key={index} 
              className={`char-card ${activeChar === item.char ? 'active' : ''}`}
              onClick={() => playPronunciation(item.char)}
            >
              <div className="char-display">{item.char}</div>
              <div className="romaji-display">{item.romaji}</div>
              <div className="card-ink"></div>
            </div>
          ) : (
            <div key={index} className="char-spacer"></div>
          )
        ))}
      </div>
    </div>
  );
};

export default HiraganaPage;
