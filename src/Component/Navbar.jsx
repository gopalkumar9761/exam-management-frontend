import React, { useState } from 'react';
import './Navbar.css';

export default function Navbar({ user, onLogout }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="site-header">
            <div className="header-container">
                <div className="logo-area">
                    <h2>Online Exam</h2>
                </div>

                {/* Three Line Box (Hamburger Menu) for Mobile */}
                <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
                    <div className={`line ${menuOpen ? 'open' : ''}`}></div>
                    <div className={`line ${menuOpen ? 'open' : ''}`}></div>
                    <div className={`line ${menuOpen ? 'open' : ''}`}></div>
                </div>

                {/* Navigation Links */}
                <nav className={`nav-links ${menuOpen ? 'active' : ''}`}>
                    <a href="/" onClick={() => setMenuOpen(false)}>Home</a>
                    <a href="/about" onClick={() => setMenuOpen(false)}>About</a>
                    
                    {user ? (
                        <button onClick={() => { onLogout(); setMenuOpen(false); }} className="nav-logout-btn">
                            Logout
                        </button>
                    ) : (
                        <a href="/login" className="nav-login-link" onClick={() => setMenuOpen(false)}>Login</a>
                    )}
                </nav>
            </div>
        </header>
    );
}