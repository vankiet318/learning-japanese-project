import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALL_VALID_CHARS, HiraganaChar } from '../constants/hiragana';
import { soundService } from '../utils/SoundService';
import './QuizPage.css';

// --- Constants & Types ---

const QUIZ_LIMITS = [10, 20, 50, Infinity];

const QUIZ_ROWS = [
  { id: 'all', label: 'All Rows (すべて)', filter: () => true },
  { id: 'a', label: 'A-Row (あ行)', filter: (c: HiraganaChar) => ['a', 'i', 'u', 'e', 'o'].includes(c.romaji) },
  { id: 'ka', label: 'Ka-Row (か行)', filter: (c: HiraganaChar) => c.romaji.startsWith('k') },
  { id: 'sa', label: 'Sa-Row (さ行)', filter: (c: HiraganaChar) => c.romaji.startsWith('s') || c.romaji === 'shi' },
  { id: 'ta', label: 'Ta-Row (た行)', filter: (c: HiraganaChar) => c.romaji.startsWith('t') || c.romaji === 'chi' || c.romaji === 'tsu' },
  { id: 'na', label: 'Na-Row (な行)', filter: (c: HiraganaChar) => c.romaji.startsWith('n') },
  { id: 'ha', label: 'Ha-Row (は行)', filter: (c: HiraganaChar) => c.romaji.startsWith('h') || c.romaji === 'fu' },
  { id: 'ma', label: 'Ma-Row (ま行)', filter: (c: HiraganaChar) => c.romaji.startsWith('m') },
  { id: 'ya', label: 'Ya-Row (や行)', filter: (c: HiraganaChar) => ['ya', 'yu', 'yo'].includes(c.romaji) },
  { id: 'ra', label: 'Ra-Row (ら行)', filter: (c: HiraganaChar) => c.romaji.startsWith('r') },
  { id: 'wa', label: 'Wa/N (わ/ん)', filter: (c: HiraganaChar) => ['wa', 'wo', 'n'].includes(c.romaji) },
];

const QuizPage: React.FC = () => {
  const navigate = useNavigate();

  // --- State: Setup ---
  const [isSetupMode, setIsSetupMode] = useState(true);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>(['all']);
  const [selectedLimit, setSelectedLimit] = useState<number>(10);

  // --- State: Quiz ---
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<{
    char: HiraganaChar;
    options: string[];
    answered: boolean;
    selectedIndex: number | null;
  } | null>(null);

  // Derived filtered pool
  const getFilteredPool = useCallback(() => {
    if (selectedRowIds.includes('all')) return ALL_VALID_CHARS;

    const activeRows = QUIZ_ROWS.filter(r => selectedRowIds.includes(r.id));
    return ALL_VALID_CHARS.filter(char => activeRows.some(row => row.filter(char)));
  }, [selectedRowIds]);

  const toggleRow = (id: string) => {
    if (id === 'all') {
      setSelectedRowIds(['all']);
      return;
    }

    setSelectedRowIds(prev => {
      // If 'all' was selected, replace it with this new specific selection
      if (prev.includes('all')) return [id];

      // Toggle functionality
      if (prev.includes(id)) {
        const next = prev.filter(p => p !== id);
        return next.length === 0 ? ['all'] : next; // Default back to all if empty
      }
      return [...prev, id];
    });
  };

  const generateQuestion = useCallback(() => {
    const pool = getFilteredPool();
    if (pool.length === 0) return;

    const correctChar = pool[Math.floor(Math.random() * pool.length)];

    // Select distractors from the SAME pool to make it harder (user request)
    // Filter out correct char
    const potentialDistractors = pool.filter(c => c.romaji !== correctChar.romaji);

    // Shuffle and pick up to 3 distractors
    // If pool is small (e.g. Ya-row has only 3 chars), we will have fewer options, which is expected.
    const selectedDistractors = potentialDistractors
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(c => c.romaji);

    // Combine and shuffle
    const options = [correctChar.romaji, ...selectedDistractors].sort(() => Math.random() - 0.5);

    setCurrentQuestion({
      char: correctChar,
      options,
      answered: false,
      selectedIndex: null
    });
  }, [getFilteredPool]);

  // Initial Start
  const startQuiz = () => {
    setIsSetupMode(false);
    setCurrentStep(0);
    setScore(0);
    setQuizFinished(false);
    generateQuestion();
  };

  const handleAnswer = (index: number) => {
    if (currentQuestion?.answered) return;

    soundService.playClick();

    const isCorrect = currentQuestion?.options[index] === currentQuestion?.char.romaji;
    if (isCorrect) {
      setScore(s => s + 1);
      soundService.playCorrect();
    } else {
      soundService.playIncorrect();
    }

    // Always read the correct answer
    const utterance = new SpeechSynthesisUtterance(currentQuestion!.char.char);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);

    setCurrentQuestion(prev => prev ? { ...prev, answered: true, selectedIndex: index } : null);

    // Auto next after 1.8s
    setTimeout(() => {
      // Check limits
      const isEndless = selectedLimit === Infinity;
      const finishedFinite = !isEndless && currentStep >= selectedLimit - 1;

      if (finishedFinite) {
        soundService.playFinish();
        setQuizFinished(true);
      } else {
        // Continue
        setCurrentStep(s => s + 1);
        generateQuestion();
      }
    }, 1800);
  };

  // --- RENDER: SETUP SCREEN ---
  if (isSetupMode) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <span className="jp-label">クイズ設定</span>
          <h1>Configure Quiz</h1>

          <div className="setup-section">
            <h3>Select Rows</h3>
            <div className="options-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {QUIZ_ROWS.map(row => (
                <button
                  key={row.id}
                  className={`option-btn ${selectedRowIds.includes(row.id) ? 'correct' : ''}`}
                  onClick={() => toggleRow(row.id)}
                  style={{ fontSize: '1rem', padding: '15px' }}
                >
                  {row.label}
                </button>
              ))}
            </div>
          </div>

          <div className="setup-section" style={{ marginTop: '30px' }}>
            <h3>Number of Questions</h3>
            <div className="options-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              {QUIZ_LIMITS.map(limit => (
                <button
                  key={limit}
                  className={`option-btn ${selectedLimit === limit ? 'correct' : ''}`}
                  onClick={() => setSelectedLimit(limit)}
                  style={{ fontSize: '1.2rem', padding: '15px' }}
                >
                  {limit === Infinity ? '∞' : limit}
                </button>
              ))}
            </div>
          </div>

          <button className="btn-quiz primary" onClick={startQuiz} style={{ marginTop: '40px', fontSize: '1.5rem' }}>
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER: SUMMARY SCREEN ---
  if (quizFinished) {
    return (
      <div className="quiz-container">
        <div className="quiz-card summary-card">
          <div className="summary-header">
            <span className="jp-label">結果</span>
            <h1>Quiz Complete!</h1>
            <div className="score-display">
              <span className="score-num">{score}</span>
              <span className="score-total">/ {selectedLimit}</span>
            </div>
            <p className="summary-text">
              {score === selectedLimit ? "Perfect! You're a Master!" :
                score >= selectedLimit * 0.7 ? "Great job! Keep it up!" :
                  "Good effort! Practice makes perfect."}
            </p>
          </div>
          <div className="summary-actions">
            <button className="btn-quiz primary" onClick={() => setIsSetupMode(true)}>New Settings</button>
            <button className="btn-quiz secondary" onClick={() => navigate('/hiragana')}>Return to Learning</button>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: ACTIVE QUIZ ---
  const progressPercent = selectedLimit === Infinity ? 100 : ((currentStep + 1) / selectedLimit) * 100;
  const progressLabel = selectedLimit === Infinity ? `Question ${currentStep + 1} (Endless)` : `Question ${currentStep + 1} of ${selectedLimit}`;

  return (
    <div className="quiz-container">
      <div className="quiz-progress">
        <div className="progress-bar" style={{ width: `${progressPercent}%`, transition: selectedLimit === Infinity ? 'none' : 'width 0.5s ease' }}></div>
        <span className="progress-text">{progressLabel}</span>
      </div>

      <div className="quiz-card">
        <div className="question-area">
          <span className="jp-label">これの読み方は？</span>
          <div className="display-char">{currentQuestion?.char.char}</div>
        </div>

        <div className="options-grid">
          {currentQuestion?.options.map((option, index) => {
            let statusClass = '';
            if (currentQuestion.answered) {
              if (option === currentQuestion.char.romaji) {
                statusClass = currentQuestion.options[currentQuestion.selectedIndex!] === option ? 'correct' : 'revealed-correct';
              }
              else if (index === currentQuestion.selectedIndex) statusClass = 'incorrect';
            }

            return (
              <button
                key={index}
                className={`option-btn ${statusClass}`}
                onClick={() => handleAnswer(index)}
                disabled={currentQuestion.answered}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Helper to quit endless mode */}
        {selectedLimit === Infinity && (
          <button
            className="btn-quiz secondary"
            style={{ marginTop: '20px', fontSize: '0.9rem', padding: '10px' }}
            onClick={() => setIsSetupMode(true)}
          >
            End Quiz
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
