import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import HeroSection from '../components/HeroSection';
import SakuraRain from '../components/SakuraRain';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="login-container">
            <HeroSection />
            <div className="login-form-side">
                <SakuraRain />

                {/* Decorative Japanese Elements */}
                <div className="floating-kana kana-1">あ</div>
                <div className="floating-kana kana-2">カ</div>
                <div className="floating-kana kana-3">さ</div>
                <div className="floating-kana kana-4">タ</div>

                <div className="login-card">
                    <div className="login-header">
                        <span className="jp-label">ログイン</span>
                        <h1>Konnichiwa</h1>
                        <p>Start your Japanese learning journey today</p>
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
                        <p>New here? <a href="/register">Create an account / 新規登録</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
