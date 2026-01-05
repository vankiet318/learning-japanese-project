import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ALL_VALID_CHARS, HiraganaChar, HIRAGANA_ROWS } from '../constants/hiragana';
import { soundService } from '../utils/SoundService';
import './QuizPage.css';

interface QuizSettings {
  selectedRows: string[];
  questionCount: number | 'infinity';
}

const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const settings = (location.state as QuizSettings) || {
    selectedRows: HIRAGANA_ROWS.map(r => r.name),
    questionCount: 10
  };

  const pool = useMemo(() => ALL_VALID_CHARS.filter(char => 
    HIRAGANA_ROWS
      .filter(r => settings.selectedRows.includes(r.name))
      .some(r => r.chars.some(c => c.char === char.char))
  ), [settings.selectedRows]);

  const isEndless = settings.questionCount === 'infinity';
  const totalQuestions = isEndless ? 0 : settings.questionCount as number;


  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<{
    char: HiraganaChar;
    options: string[];
    answered: boolean;
    selectedIndex: number | null;
  } | null>(null);

  const generateQuestion = useCallback(() => {
    if (pool.length === 0) return;
    const correctChar = pool[Math.floor(Math.random() * pool.length)];
    
    // Generate 3 incorrect options from the pool if possible, otherwise from ALL_VALID_CHARS
    const optionsPool = pool.length >= 4 ? pool : ALL_VALID_CHARS;
    const incorrectOptions: string[] = [];
    while (incorrectOptions.length < 3) {
      const randomChar = optionsPool[Math.floor(Math.random() * optionsPool.length)];
      if (randomChar.romaji !== correctChar.romaji && !incorrectOptions.includes(randomChar.romaji)) {
        incorrectOptions.push(randomChar.romaji);
      }
    }

    // Combine and shuffle
    const options = [correctChar.romaji, ...incorrectOptions].sort(() => Math.random() - 0.5);

    setCurrentQuestion({
      char: correctChar,
      options,
      answered: false,
      selectedIndex: null
    });
  }, [pool]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

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

    // Auto next after 1.8s (a bit longer to see the real answer)
    setTimeout(() => {
      if (isEndless || currentStep < (totalQuestions as number) - 1) {
        setCurrentStep(s => s + 1);
        generateQuestion();
      } else {
        soundService.playFinish();
        setQuizFinished(true);
      }
    }, 1800);
  };

  const finishEndless = () => {
    soundService.playFinish();
    setQuizFinished(true);
  };


  if (quizFinished) {
    return (
      <div className="quiz-container">
        <div className="quiz-card summary-card">
          <div className="summary-header">
            <span className="jp-label">結果</span>
            <h1>Quiz Complete!</h1>
            <div className="score-display">
              <span className="score-num">{score}</span>
              <span className="score-total">/ {isEndless ? currentStep + 1 : totalQuestions}</span>
            </div>
            <p className="summary-text">
              {isEndless ? `Great session! You mastered ${score} characters.` :
               score === totalQuestions ? "Perfect! You're a Master!" : 
               score >= totalQuestions * 0.7 ? "Great job! Keep it up!" : 
               "Good effort! Practice makes perfect."}
            </p>
          </div>
          <div className="summary-actions">
            <button className="btn-quiz primary" onClick={() => {
              soundService.playClick();
              window.location.reload();
            }}>Try Again</button>
            <button className="btn-quiz secondary" onClick={() => {
              soundService.playClick();
              navigate('/hiragana');
            }}>Return to Learning</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <button className="btn-back" onClick={() => {
        soundService.playClick();
        navigate('/hiragana');
      }}>
        <span className="back-text">Back</span>
        <span className="back-icon">←</span>
      </button>

      <div className="quiz-progress-container">
        <div className="quiz-progress">
          <div 
            className="progress-bar" 
            style={{ width: isEndless ? '100%' : `${((currentStep + 1) / totalQuestions) * 100}%` }}
          ></div>
          <span className="progress-text">
            {isEndless ? `Infinite Mode - Question ${currentStep + 1}` : `Question ${currentStep + 1} of ${totalQuestions}`}
          </span>
        </div>
      </div>

      <div className="quiz-card">
        <div className="question-area">
          <div className="question-header">
            <span className="jp-label">これの読み方は？</span>
          </div>
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
      </div>

      <div className="quiz-actions-footer">
        <button className="btn-finish-quiz" onClick={finishEndless}>
          Finish Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizPage;
