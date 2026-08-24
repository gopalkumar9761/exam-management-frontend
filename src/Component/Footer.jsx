import React from 'react';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-container">
                {/* Left Side: Brand & Copyright */}
                <div className="footer-left">
                    <span className="footer-brand">Online Exam Management System</span>
                    <p className="footer-text">
                        © {new Date().getFullYear()} All Rights Reserved. Built with secure architecture.
                    </p>
                </div>

                {/* Right Side: Version Badge & Navigation Links */}
                <div className="footer-right">
                    
                    <div className="footer-links">
                        <span className="separator">•</span>
                        <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
                        <span className="separator">•</span>
                        <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a>
                        <span className="separator">•</span>
                        <a href="#support" onClick={(e) => e.preventDefault()}>Support</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}