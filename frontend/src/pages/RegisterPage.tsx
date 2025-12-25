import React, { useState } from 'react';
import axios from 'axios';
import './RegisterPage.css';
import HeroSection from '../components/HeroSection';
import SakuraRain from '../components/SakuraRain';

const RegisterPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match / パスワードが一致しません');
            return;
        }
        
        setIsLoading(true);
        setError('');
        
        try {
            const response = await axios.post('http://localhost:8000/api/v1/auth/register', {
                name,
                email,
                password
            });
            console.log('Register success:', response.data);
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="login-container">
                <HeroSection />
                <div className="login-form-side">
                    <SakuraRain />
                    <div className="login-card success-card">
                        <div className="login-header">
                            <span className="jp-label">完了</span>
                            <h1>Omedetou!</h1>
                            <p>Your account has been created successfully.</p>
                            <a href="/login" className="login-btn">Sign In / ログイン</a>
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

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Full Name / お名前</label>
                        <input 
                            type="text" 
                            placeholder="Your Name" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

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
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Confirm Password / パスワード再入力</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="login-btn" disabled={isLoading}>
                        {isLoading ? <span className="loader"></span> : "Create Account / 登録する"}
                    </button>
                </form>

                    <div className="login-footer">
                        <p>Already have an account? <a href="/login">Sign In / ログイン</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
