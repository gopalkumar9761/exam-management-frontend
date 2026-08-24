import React, { useState, useEffect } from 'react';
import { getExamByLink, submitExam } from '../services/api';
import './StudentDashboard.css'; // Import the new responsive CSS file

export default function StudentDashboard({ user, onLogout }) {
    const [step, setStep] = useState(1); // 1: Join form, 2: Exam screen, 3: Result view
    
    const [uniqueCode, setUniqueCode] = useState('');
    const [studentName, setStudentName] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [studentCourse, setStudentCourse] = useState('B.Tech');
    const [studentSemester, setStudentSemester] = useState('1st Semester');

    const [examData, setExamData] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [scoreResult, setScoreResult] = useState(null);
    const [loading, setLoading] = useState(false);

    // Timer State
    const [timeLeft, setTimeLeft] = useState(0); // in seconds

    // Countdown Timer Effect
    useEffect(() => {
        if (step === 2 && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        alert("Time's up! Your exam is submitting automatically.");
                        submitDataToServer();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [step, timeLeft]);

    // Format seconds into MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Verify Code & Check Date/Time
    const handleVerifyAndJoin = async (e) => {
        e.preventDefault();
        if (!uniqueCode || !studentName || !rollNumber) {
            alert("Please fill in all details!");
            return;
        }

        setLoading(true);
        try {
            const response = await getExamByLink(uniqueCode.trim().toUpperCase());
            const exam = response.exam;

            // --- DATE & TIME VALIDATION CHECK ---
            if (exam.examDate && exam.startTime) {
                const currentDateTime = new Date();
                const examStartDateTime = new Date(`${exam.examDate}T${exam.startTime}:00`);

                if (currentDateTime < examStartDateTime) {
                    setLoading(false);
                    alert(`Exam has not started yet! Scheduled for: ${exam.examDate} at ${exam.startTime}`);
                    return;
                }
            }

            setExamData(exam);
            setQuestions(response.questions);
            
            const durationSecs = (exam.durationMinutes || 30) * 60;
            setTimeLeft(durationSecs);

            setLoading(false);
            setStep(2);
        } catch (err) {
            setLoading(false);
            alert("Invalid Exam Code or Link!");
        }
    };

    const handleOptionSelect = (qId, option) => {
        setAnswers({ ...answers, [qId]: option });
    };

    // Manual Submit
    const handleFinalSubmit = async () => {
        if (!window.confirm("Are you sure you want to submit the exam?")) return;
        submitDataToServer();
    };

    const submitDataToServer = async () => {
        setLoading(true);
        try {
            const submissionData = {
                examId: examData.id,
                studentId: user.id,
                studentName,
                rollNumber,
                course: studentCourse,
                semester: studentSemester,
                answers
            };

            const result = await submitExam(submissionData);
            setScoreResult(result);
            setLoading(false);
            setStep(3);
        } catch (err) {
            setLoading(false);
            alert("Failed to submit exam!");
        }
    };

    return (
        <div className="student-dashboard-container">
            <div className="student-header">
                <h2 className="student-title">Student Portal ({user.name})</h2>
                <button onClick={onLogout} className="logout-btn">
                    Logout
                </button>
            </div>
            <hr className="dashboard-divider" />

            {/* STEP 1: Enter Code & Details */}
            {step === 1 && (
                <div>
                    <h3 className="section-title">Join Scheduled Exam</h3>
                    <form onSubmit={handleVerifyAndJoin}>
                        <div className="form-group">
                            <label className="form-label">Unique Exam Code:</label>
                            <input 
                                type="text" 
                                className="form-input"
                                placeholder="Enter 8-character code" 
                                value={uniqueCode} 
                                onChange={(e) => setUniqueCode(e.target.value)} 
                                required 
                                style={{ textTransform: 'uppercase' }}
                            />
                        </div>

                        <div className="form-grid-2">
                            <div className="form-group">
                                <label className="form-label">Full Name:</label>
                                <input 
                                    type="text" 
                                    className="form-input"
                                    placeholder="Enter your name" 
                                    value={studentName} 
                                    onChange={(e) => setStudentName(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Roll Number:</label>
                                <input 
                                    type="text" 
                                    className="form-input"
                                    placeholder="e.g. 210123001" 
                                    value={rollNumber} 
                                    onChange={(e) => setRollNumber(e.target.value)} 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="form-grid-2">
                            <div className="form-group">
                                <label className="form-label">Course:</label>
                                <select value={studentCourse} onChange={(e) => setStudentCourse(e.target.value)} className="form-select">
                                    <option value="B.Tech">B.Tech</option>
                                    <option value="BCA">BCA</option>
                                    <option value="BSc">BSc</option>
                                    <option value="MCA">MCA</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Semester:</label>
                                <select value={studentSemester} onChange={(e) => setStudentSemester(e.target.value)} className="form-select">
                                    <option value="1st Semester">1st Semester</option>
                                    <option value="2nd Semester">2nd Semester</option>
                                    <option value="3rd Semester">3rd Semester</option>
                                    <option value="4th Semester">4th Semester</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="start-exam-btn">
                            {loading ? "Verifying Schedule..." : "Verify & Start Exam"}
                        </button>
                    </form>
                </div>
            )}

            {/* STEP 2: Live Exam Screen with Sticky Countdown Timer */}
            {step === 2 && examData && (
                <div>
                    <div className="exam-sticky-header">
                        <div>
                            <h3 className="exam-sticky-title">{examData.title}</h3>
                            <span className="exam-student-info">Student: <b>{studentName}</b> ({rollNumber})</span>
                        </div>
                        <div className="timer-box">
                            <span className="timer-label">Time Remaining</span>
                            <span className="timer-value" style={{ color: timeLeft < 300 ? '#ef4444' : '#10b981' }}>
                                ⏳ {formatTime(timeLeft)}
                            </span>
                        </div>
                    </div>

                    {questions.map((q, index) => (
                        <div key={q.id} className="question-card">
                            <p className="question-text">Q{index + 1}. {q.questionText}</p>
                            
                            <div className="options-container">
                                {['A', 'B', 'C', 'D'].map((optKey) => {
                                    const optText = q[`option${optKey}`];
                                    if (!optText) return null;
                                    const isSelected = answers[q.id] === optKey;
                                    return (
                                        <label key={optKey} className={`option-label ${isSelected ? 'selected' : ''}`}>
                                            <input 
                                                type="radio" 
                                                name={`question_${q.id}`} 
                                                checked={isSelected} 
                                                onChange={() => handleOptionSelect(q.id, optKey)} 
                                            />
                                            <span><b>{optKey})</b> {optText}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    <button onClick={handleFinalSubmit} disabled={loading} className="submit-exam-btn">
                        {loading ? "Submitting..." : "Submit Exam"}
                    </button>
                </div>
            )}

            {/* STEP 3: Result View */}
            {step === 3 && scoreResult && (
                <div className="result-container">
                    <h2 style={{ margin: '0 0 10px 0' }}>Exam Submitted Successfully! 🎉</h2>
                    <p style={{ color: '#065f46' }}>Thank you, <b>{studentName}</b> (Roll No: {rollNumber})</p>
                    
                    <div className="result-card-box">
                        <h4 style={{ margin: '0 0 6px 0', color: '#1e293b' }}>Your Final Score</h4>
                        <h1 className="result-score">{scoreResult.score} / {scoreResult.totalQuestions}</h1>
                    </div>
                    
                    <div>
                        <button onClick={() => setStep(1)} className="back-portal-btn">
                            Back to Portal
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}