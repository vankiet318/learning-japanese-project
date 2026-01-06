import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthLayout.css';

const LoginPage: React.FC = () => {
    const location = useLocation();
    const [formData, setFormData] = useState({

        username: '',
        password: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const API_BASE_URL = 'http://localhost:8000';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const formBody = new URLSearchParams();
            formBody.append('username', formData.username);
            formBody.append('password', formData.password);

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formBody,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Login failed');
            }

            const data = await response.json();
            const userResponse = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: { 'Authorization': `Bearer ${data.access_token}` }
            });
            
            if (userResponse.ok) {
                const userData = await userResponse.json();
                login(data.access_token, userData);
                navigate('/');
            } else {
                throw new Error('Could not fetch user info');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="auth-full-page">
            <div className="auth-split-layout">
                {/* Visual Side */}
                <div className="auth-hero-section">
                    <div className="auth-hero-content">
                        <span className="hero-jp-text">お帰りなさい</span>
                        <h1 className="hero-en-text">Welcome Back</h1>
                        <p className="hero-description">Continue your path to Japanese mastery.</p>
                    </div>
                    <div className="floating-elements">
                        <span className="float-kana k-1">あ</span>
                        <span className="float-kana k-2">い</span>
                        <span className="float-kana k-3">う</span>
                    </div>
                </div>

                {/* Form Side */}
                <div className="auth-form-section">
                    <div className="form-container">
                        <div className="form-header">
                            <h2>Login</h2>
                            <p>Access your personalized learning</p>
                        </div>

                        {error && (
                            <div className="auth-msg error">
                                {error}
                            </div>
                        )}

                        {location.state?.message && (
                            <div className="auth-msg success">
                                {location.state.message}
                            </div>
                        )}


                        <form className="auth-main-form" onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Username</label>
                                <input 
                                    type="text" 
                                    name="username" 
                                    value={formData.username} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="Enter username"
                                />
                            </div>

                            <div className="input-group">
                                <label>Password</label>
                                <input 
                                    type="password" 
                                    name="password" 
                                    value={formData.password} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="••••••••"
                                />
                            </div>

                            <button type="submit" className="auth-submit-btn" disabled={loading}>
                                {loading ? 'Processing...' : 'Login'}
                            </button>
                        </form>

                        <div className="auth-switch">
                            <span>Don't have an account?</span>
                            <Link to="/register" className="switch-link">Create one here</Link>
                        </div>
                        
                        <button className="back-home" onClick={() => navigate('/')}>
                             Return to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
