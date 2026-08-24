import React, { useState } from 'react';
import { loginUser } from '../services/api';
import './Login.css'; // CSS file ko import kiya gaya hai

export default function Login({ onLoginSuccess, onSwitchToRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await loginUser({ email, password });
            alert("Login Successful!");
            onLoginSuccess(data);
        } catch (err) {
            setError("Invalid Email or Password!");
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Login to Online Exam</h2>
            
            {error && <p className="login-error">{error}</p>}
            
            <form onSubmit={handleLogin}>
                <div className="login-form-group">
                    <label>Email:</label><br />
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className="login-input"
                    />
                </div>
                
                <div className="login-form-group">
                    <label>Password:</label><br />
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        className="login-input"
                    />
                </div>
                
                <button type="submit" className="login-button">
                    Login
                </button>
            </form>

            <p className="login-switch-text">
                Don't have an account?{' '}
                <span 
                    onClick={onSwitchToRegister} 
                    className="login-switch-link"
                >
                    Register here
                </span>
            </p>
        </div>
    );
}