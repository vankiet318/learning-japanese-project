import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';
import HeroSection from '../components/HeroSection';
import SakuraRain from '../components/SakuraRain';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="login-container">
            <HeroSection />
            <div className="login-form-side">
                <SakuraRain />

                {/* Decorative Japanese Elements */}
                <div className="floating-kana kana-1">れ</div>
                <div className="floating-kana kana-2">ギ</div>
                <div className="floating-kana kana-3">す</div>
                <div className="floating-kana kana-4">タ</div>

                <div className="login-card">
                    <div className="login-header">
                        <span className="jp-label">新規登録</span>
                        <h1>Hajimemashou</h1>
                        <p>Join the Japanese learning community</p>
                    </div>

                    <div className="login-actions" style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <button 
                            className="login-btn" 
                            onClick={() => navigate('/hiragana')}
                        >
                            Start Learning / 学習を始める
                        </button>
                    </div>

                    <div className="login-footer">
                        <p>Already have an account? <a href="/login">Sign In / ログイン</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
