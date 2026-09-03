import React, { useState } from 'react';
import Navbar from './Component/Navbar';   // 'components' ko 'Component' kar diya
import Footer from './Component/Footer';   // 'components' ko 'Component' kar diya
import Login from './pages/Login';
import Register from './pages/Register';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ExamRoom from './pages/ExamRoom';
import ResultPage from './pages/ResultPage';

export default function App() {
    const [user, setUser] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [exam, setExam] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [result, setResult] = useState(null);

    const handleLogout = () => {
        setUser(null);
        setExam(null);
        setQuestions([]);
        setResult(null);
        setIsRegistering(false);
    };

    // Navbar ke Login click par Login Form dikhane ke liye
    const handleShowLogin = () => {
        setUser(null);
        setExam(null);
        setQuestions([]);
        setResult(null);
        setIsRegistering(false);
    };

    // Helper function to render the correct page content based on app state
    const renderContent = () => {
        if (!user) {
            if (isRegistering) {
                return <Register onSwitchToLogin={() => setIsRegistering(false)} />;
            }
            return (
                <Login 
                    onLoginSuccess={(userData) => setUser(userData)} 
                    onSwitchToRegister={() => setIsRegistering(true)} 
                />
            );
        }

        if (result) {
            return (
                <ResultPage 
                    result={result} 
                    onBackToDashboard={() => { setResult(null); setExam(null); }} 
                />
            );
        }

        if (exam && questions.length > 0) {
            return (
                <ExamRoom 
                    user={user} 
                    exam={exam} 
                    questions={questions} 
                    onSubmitFinished={(resData) => setResult(resData)} 
                />
            );
        }

        if (user.role === 'TEACHER') {
            return <TeacherDashboard user={user} onLogout={handleLogout} />;
        } else {
            return (
                <StudentDashboard 
                    user={user} 
                    onLogout={handleLogout} 
                    onStartExam={(examObj, quesList) => { setExam(examObj); setQuestions(quesList); }} 
                />
            );
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            {/* Designer Header with 3-line mobile menu box */}
            <Navbar user={user} onLogout={handleLogout} onLoginClick={handleShowLogin} />

            {/* Main Dynamic Content Area */}
            <main style={{ flex: 1, width: '100%' }}>
                {renderContent()}
            </main>

            {/* Professional Footer */}
            <Footer />
        </div>
    );
}
