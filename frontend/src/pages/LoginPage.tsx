import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import './LoginPage.css';
import HeroSection from '../components/HeroSection';
import SakuraRain from '../components/SakuraRain';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });
            console.log('Login success:', response.data);
            setIsLoggedIn(true);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoggedIn) {
        return (
            <div className="login-container">
                <HeroSection />
                <div className="login-form-side">
                    <SakuraRain />
                    <div className="login-card success-card">
                        <div className="login-header">
                            <span className="jp-label">ログイン成功</span>
                            <h1>Okaeri!</h1>
                            <p>Welcome back to your learning journey.</p>
                            <div className="success-icon">🍱</div>
                            <a href="/hiragana" className="login-btn" onClick={(e) => {
                                e.preventDefault();
                                navigate('/hiragana');
                            }}>Start Learning / 学習を始める</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Email / メール</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Password / パスワード</label>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button type="submit" className="login-btn" disabled={isLoading}>
                            {isLoading ? <span className="loader"></span> : "Sign In / ログイン"}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>Don't have an account? <a href="/register">Sign Up / 会員登録</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
