import React, { useState, useEffect } from 'react';
import { getExamByLink, submitExam } from '../services/api';

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
                        handleAutoSubmit(); // Auto submit when timer hits 0
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
                const currentDateTime = new Date(); // Current system time
                const examStartDateTime = new Date(`${exam.examDate}T${exam.startTime}:00`);

                if (currentDateTime < examStartDateTime) {
                    setLoading(false);
                    alert(`Exam has not started yet! Scheduled for: ${exam.examDate} at ${exam.startTime}`);
                    return;
                }
            }
            // ------------------------------------

            setExamData(exam);
            setQuestions(response.questions);
            
            // Set Timer in seconds (Duration in minutes * 60)
            const durationSecs = (exam.durationMinutes || 30) * 60;
            setTimeLeft(durationSecs);

            setLoading(false);
            setStep(2); // Start Exam
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

    // Auto Submit on Timer Expiry
    const handleAutoSubmit = () => {
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
            setStep(3); // View Result
        } catch (err) {
            setLoading(false);
            alert("Failed to submit exam!");
        }
    };

    return (
        <div style={{ maxWidth: '850px', margin: '30px auto', padding: '25px', border: '1px solid #dcdcdc', borderRadius: '10px', background: '#fff', fontFamily: 'Arial, sans-serif', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ color: '#2c3e50', margin: 0 }}>Student Portal ({user.name})</h2>
                <button onClick={onLogout} style={{ padding: '8px 15px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Logout
                </button>
            </div>
            <hr style={{ margin: '20px 0', borderColor: '#eee' }} />

            {/* STEP 1: Enter Code & Details */}
            {step === 1 && (
                <div>
                    <h3 style={{ color: '#34495e' }}>Join Scheduled Exam</h3>
                    <form onSubmit={handleVerifyAndJoin}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ fontWeight: 'bold' }}>Unique Exam Code:</label><br />
                            <input 
                                type="text" 
                                placeholder="Enter 8-character code" 
                                value={uniqueCode} 
                                onChange={(e) => setUniqueCode(e.target.value)} 
                                required 
                                style={{ width: '100%', padding: '10px', marginTop: '5px', textTransform: 'uppercase', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                            <div>
                                <label style={{ fontWeight: 'bold' }}>Full Name:</label><br />
                                <input 
                                    type="text" 
                                    placeholder="Enter your name" 
                                    value={studentName} 
                                    onChange={(e) => setStudentName(e.target.value)} 
                                    required 
                                    style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
                                />
                            </div>
                            <div>
                                <label style={{ fontWeight: 'bold' }}>Roll Number:</label><br />
                                <input 
                                    type="text" 
                                    placeholder="e.g. 210123001" 
                                    value={rollNumber} 
                                    onChange={(e) => setRollNumber(e.target.value)} 
                                    required 
                                    style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ fontWeight: 'bold' }}>Course:</label><br />
                                <select value={studentCourse} onChange={(e) => setStudentCourse(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #ccc' }}>
                                    <option value="B.Tech">B.Tech</option><option value="BCA">BCA</option><option value="BSc">BSc</option><option value="MCA">MCA</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontWeight: 'bold' }}>Semester:</label><br />
                                <select value={studentSemester} onChange={(e) => setStudentSemester(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #ccc' }}>
                                    <option value="1st Semester">1st Semester</option><option value="2nd Semester">2nd Semester</option><option value="3rd Semester">3rd Semester</option><option value="4th Semester">4th Semester</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} style={{ padding: '10px 22px', background: '#2980b9', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                            {loading ? "Verifying Schedule..." : "Verify & Start Exam"}
                        </button>
                    </form>
                </div>
            )}

            {/* STEP 2: Live Exam Screen with Sticky Countdown Timer */}
            {step === 2 && examData && (
                <div>
                    {/* Sticky Header with Timer */}
                    <div style={{ position: 'sticky', top: '0', background: '#2c3e50', color: 'white', padding: '15px 20px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                        <div>
                            <h3 style={{ margin: '0 0 3px 0' }}>{examData.title}</h3>
                            <span style={{ fontSize: '13px', color: '#bdc3c7' }}>Student: <b>{studentName}</b> ({rollNumber})</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '12px', color: '#bdc3c7', display: 'block' }}>Time Remaining</span>
                            <span style={{ fontSize: '22px', fontWeight: 'bold', color: timeLeft < 300 ? '#e74c3c' : '#2ecc71' }}>
                                ⏳ {formatTime(timeLeft)}
                            </span>
                        </div>
                    </div>

                    {questions.map((q, index) => (
                        <div key={q.id} style={{ background: '#fdfdfd', border: '1px solid #e2e8f0', padding: '18px', borderRadius: '8px', marginBottom: '15px' }}>
                            <p style={{ fontWeight: 'bold', marginTop: '0', color: '#2c3e50' }}>Q{index + 1}. {q.questionText}</p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {['A', 'B', 'C', 'D'].map((optKey) => {
                                    const optText = q[`option${optKey}`];
                                    if (!optText) return null;
                                    return (
                                        <label key={optKey} style={{ cursor: 'pointer', padding: '8px 12px', background: answers[q.id] === optKey ? '#ebf5fb' : '#f8f9fa', borderRadius: '6px', border: answers[q.id] === optKey ? '1px solid #2980b9' : '1px solid #e0e0e0' }}>
                                            <input 
                                                type="radio" 
                                                name={`question_${q.id}`} 
                                                checked={answers[q.id] === optKey} 
                                                onChange={() => handleOptionSelect(q.id, optKey)} 
                                                style={{ marginRight: '10px' }} 
                                            />
                                            <b>{optKey})</b> {optText}
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    <button onClick={handleFinalSubmit} disabled={loading} style={{ padding: '12px 20px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%', marginTop: '10px', fontSize: '16px' }}>
                        {loading ? "Submitting..." : "Submit Exam"}
                    </button>
                </div>
            )}

            {/* STEP 3: Result View */}
            {step === 3 && scoreResult && (
                <div style={{ textAlign: 'center', padding: '40px', background: '#e8f8f5', borderRadius: '10px', color: '#117a65', border: '1px solid #a3e4d7' }}>
                    <h2 style={{ margin: '0 0 10px 0' }}>Exam Submitted Successfully! 🎉</h2>
                    <p style={{ color: '#555' }}>Thank you, <b>{studentName}</b> (Roll No: {rollNumber})</p>
                    
                    <div style={{ background: 'white', display: 'inline-block', padding: '25px 50px', borderRadius: '8px', margin: '20px 0', border: '1px solid #d4efdf', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                        <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>Your Final Score</h4>
                        <h1 style={{ margin: '0', color: '#27ae60' }}>{scoreResult.score} / {scoreResult.totalQuestions}</h1>
                    </div>
                    
                    <br />
                    <button onClick={() => setStep(1)} style={{ padding: '10px 24px', background: '#2980b9', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Back to Portal
                    </button>
                </div>
            )}
        </div>
    );
}