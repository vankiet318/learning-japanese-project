import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AuthLayout.css';

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const API_BASE_URL = 'http://localhost:8000';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Registration failed');
            }

            // Success! Redirect to login with a success message state or just notify
            navigate('/login', { state: { message: 'Registration successful! Please login.' } });
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
                        <span className="hero-jp-text">新世界へ</span>
                        <h1 className="hero-en-text">Join the Journey</h1>
                        <p className="hero-description">Start your immersion into the Japanese language and culture.</p>
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
                            <h2>Register</h2>
                            <p>Create an account to track progress</p>
                        </div>

                        {error && (
                            <div className="auth-msg error">
                                {error}
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
                                    placeholder="Choose a username"
                                />
                            </div>

                            <div className="input-group">
                                <label>Email Address</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="you@example.com"
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
                                {loading ? 'Processing...' : 'Sign Up'}
                            </button>
                        </form>

                        <div className="auth-switch">
                            <span>Already registered?</span>
                            <Link to="/login" className="switch-link">Login here</Link>
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

export default RegisterPage;
