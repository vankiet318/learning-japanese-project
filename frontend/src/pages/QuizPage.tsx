import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALL_VALID_CHARS, HiraganaChar } from '../constants/hiragana';
import { soundService } from '../utils/SoundService';
import './QuizPage.css';

const QUESTIONS_PER_QUIZ = 10;

const QuizPage: React.FC = () => {
  const navigate = useNavigate();
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
    const correctChar = ALL_VALID_CHARS[Math.floor(Math.random() * ALL_VALID_CHARS.length)];
    
    // Generate 3 incorrect options
    const incorrectOptions: string[] = [];
    while (incorrectOptions.length < 3) {
      const randomChar = ALL_VALID_CHARS[Math.floor(Math.random() * ALL_VALID_CHARS.length)];
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
  }, []);

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
      if (currentStep < QUESTIONS_PER_QUIZ - 1) {
        setCurrentStep(s => s + 1);
        generateQuestion();
      } else {
        soundService.playFinish();
        setQuizFinished(true);
      }
    }, 1800);
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
              <span className="score-total">/ {QUESTIONS_PER_QUIZ}</span>
            </div>
            <p className="summary-text">
              {score === QUESTIONS_PER_QUIZ ? "Perfect! You're a Master!" : 
               score >= 7 ? "Great job! Keep it up!" : 
               "Good effort! Practice makes perfect."}
            </p>
          </div>
          <div className="summary-actions">
            <button className="btn-quiz primary" onClick={() => window.location.reload()}>Try Again</button>
            <button className="btn-quiz secondary" onClick={() => navigate('/hiragana')}>Return to Learning</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-progress">
        <div className="progress-bar" style={{ width: `${((currentStep + 1) / QUESTIONS_PER_QUIZ) * 100}%` }}></div>
        <span className="progress-text">Question {currentStep + 1} of {QUESTIONS_PER_QUIZ}</span>
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
      </div>
    </div>
  );
};

export default QuizPage;
