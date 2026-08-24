import React, { useState } from 'react';
import { registerUser } from '../services/api'; // api.js se import kar rahe hain
import './Register.css'; // CSS file ko import kiya gaya hai

function Register({ onSwitchToLogin }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'STUDENT' // By default student rahega
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            await registerUser(formData);
            setMessage('Account created successfully! You can now login.');
            setTimeout(() => {
                onSwitchToLogin(); // Success hone ke baad login page par bhej dega
            }, 1500);
        } catch (err) {
            setError('Failed to create account. Email might already exist.');
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2 className="register-title">Create Account</h2>
                
                {error && <p className="error-text">{error}</p>}
                {message && <p className="success-text">{message}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name:</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Email:</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Password:</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                            className="form-input"
                        />
                    </div>

                    <div className="form-group-role">
                        <label>Role:</label>
                        <select 
                            name="role" 
                            value={formData.role} 
                            onChange={handleChange} 
                            className="form-input"
                        >
                            <option value="STUDENT">Student</option>
                            <option value="TEACHER">Teacher</option>
                        </select>
                    </div>

                    <button type="submit" className="register-button">
                        Register
                    </button>
                </form>

                <p className="switch-text">
                    Already have an account?{' '}
                    <span 
                        onClick={onSwitchToLogin} 
                        className="switch-link"
                    >
                        Login here
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Register;