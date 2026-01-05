import React from 'react';
import { useNavigate } from 'react-router-dom';
import SakuraRain from '../components/SakuraRain';
import './HomePage.css';

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <SakuraRain />
            
            <div className="home-layout">
                {/* Left Side: Navigation/Auth */}
                <div className="auth-panel">
                    <div className="auth-header">
                        <span className="jp-tagline">ようこそ</span>
                        <h1>Start Your Journey</h1>
                        <p>Master the art of Japanese through focus and immersion.</p>
                    </div>

                    <div className="auth-buttons">
                        <button 
                            className="btn-auth btn-login" 
                            style={{ width: '100%', maxWidth: '300px' }}
                            onClick={() => navigate('/hiragana')}
                        >
                            <span className="btn-text">Start Learning</span>
                            <span className="btn-jp">学習を始める</span>
                        </button>
                    </div>

                    <div className="auth-footer">
                        <div className="vertical-text">日本語を学ぶ</div>
                    </div>
                </div>

                {/* Right Side: Creative Hero */}
                <div className="hero-panel">
                    <div className="hero-visual">
                        <div className="circle-backdrop"></div>
                        <div className="floating-chars">
                            <span className="char char-1">夢</span>
                            <span className="char char-2">和</span>
                            <span className="char char-3">力</span>
                        </div>
                        <div className="hero-main-text">
                            <h2 className="title-jp">無限の可能性</h2>
                            <h2 className="title-en">Infinite Possibilities</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
