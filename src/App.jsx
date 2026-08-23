import React, { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register'; // Register component import kiya
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ExamRoom from './pages/ExamRoom';
import ResultPage from './pages/ResultPage';

export default function App() {
    const [user, setUser] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false); // Register page dikhane ke liye state
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

    if (!user) {
        if (isRegistering) {
            return <Register onSwitchToLogin={() => setIsRegistering(false)} />;
        }
        return <Login 
            onLoginSuccess={(userData) => setUser(userData)} 
            onSwitchToRegister={() => setIsRegistering(true)} 
        />;
    }

    if (result) {
        return <ResultPage result={result} onBackToDashboard={() => { setResult(null); setExam(null); }} />;
    }

    if (exam && questions.length > 0) {
        return <ExamRoom user={user} exam={exam} questions={questions} onSubmitFinished={(resData) => setResult(resData)} />;
    }

    if (user.role === 'TEACHER') {
        return <TeacherDashboard user={user} onLogout={handleLogout} />;
    } else {
        return <StudentDashboard user={user} onLogout={handleLogout} onStartExam={(examObj, quesList) => { setExam(examObj); setQuestions(quesList); }} />;
    }
}