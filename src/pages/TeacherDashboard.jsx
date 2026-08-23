import React, { useState, useEffect } from 'react';
import { createExam, getTeacherExams, getExamQuestions, getAllResults, deleteExamApi } from '../services/api';
import './TeacherDashboard.css';

export default function TeacherDashboard({ user, onLogout }) {
    const [title, setTitle] = useState('');
    const [course, setCourse] = useState('B.Tech');
    const [branch, setBranch] = useState('CSE');
    const [year, setYear] = useState('1st Year');
    const [semester, setSemester] = useState('1st Semester');
    const [subject, setSubject] = useState('');

    // Schedule States
    const [examDate, setExamDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [durationMinutes, setDurationMinutes] = useState(30);

    const [questions, setQuestions] = useState([
        { questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A' }
    ]);
    const [uniqueLink, setUniqueLink] = useState('');
    
    const [teacherExams, setTeacherExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [examQuestions, setExamQuestions] = useState([]);
    const [allResults, setAllResults] = useState([]);

    useEffect(() => {
        loadTeacherData();
    }, [user.id]);

    const loadTeacherData = async () => {
        try {
            const examsData = await getTeacherExams(user.id);
            setTeacherExams(examsData);
            const resultsData = await getAllResults();
            setAllResults(resultsData);
        } catch (err) {
            console.error("Error loading data:", err);
        }
    };

    const handleAddQuestionField = () => {
        setQuestions([...questions, { questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A' }]);
    };

    const handleQuestionChange = (index, field, value) => {
        const updated = [...questions];
        updated[index][field] = value;
        setQuestions(updated);
    };

    const handleSubmitExam = async (e) => {
        e.preventDefault();
        try {
            const examData = { 
                title, 
                teacherId: user.id, 
                course, 
                branch, 
                year, 
                semester, 
                subject, 
                examDate, 
                startTime, 
                durationMinutes, 
                questions 
            };
            const response = await createExam(examData);
            setUniqueLink(response.uniqueLink);
            alert("Exam Scheduled Successfully!");
            setTitle('');
            setSubject('');
            setExamDate('');
            setStartTime('');
            setDurationMinutes(30);
            setQuestions([{ questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A' }]);
            loadTeacherData();
        } catch (err) {
            alert("Failed to create exam!");
        }
    };

    const handleSelectExamCard = async (exam) => {
        setSelectedExam(exam);
        try {
            const qData = await getExamQuestions(exam.id);
            setExamQuestions(qData);
        } catch (err) {
            console.error("Error fetching questions:", err);
        }
    };

    const handleDeleteExam = async (examId, e) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this exam? It will be permanently removed from the database.")) {
            return;
        }

        try {
            await deleteExamApi(examId);
            alert("Exam deleted successfully!");
            if (selectedExam?.id === examId) {
                setSelectedExam(null);
            }
            loadTeacherData();
        } catch (err) {
            alert("Failed to delete exam from database!");
        }
    };

    return (
        <div className="teacher-dashboard-container">
            <div className="dashboard-header">
                <h2 className="dashboard-title">Teacher Dashboard ({user.name})</h2>
                <button onClick={onLogout} className="logout-btn">
                    Logout
                </button>
            </div>
            <hr className="dashboard-divider" />

            <h3 className="section-title">Schedule New Exam</h3>
            <form onSubmit={handleSubmitExam}>
                <div className="form-grid-2">
                    <div className="form-group">
                        <label className="form-label">Exam Title:</label><br />
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Subject Name:</label><br />
                        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Operating Systems" required className="form-input" />
                    </div>
                </div>

                <div className="form-grid-4">
                    <div className="form-group">
                        <label className="select-label">Course:</label><br />
                        <select value={course} onChange={(e) => setCourse(e.target.value)} className="form-select">
                            <option value="B.Tech">B.Tech</option><option value="BCA">BCA</option><option value="BSc">BSc</option><option value="MCA">MCA</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="select-label">Branch:</label><br />
                        <select value={branch} onChange={(e) => setBranch(e.target.value)} className="form-select">
                            <option value="CSE">CSE</option><option value="IT">IT</option><option value="ECE">ECE</option><option value="Mechanical">Mechanical</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="select-label">Year:</label><br />
                        <select value={year} onChange={(e) => setYear(e.target.value)} className="form-select">
                            <option value="1st Year">1st Year</option><option value="2nd Year">2nd Year</option><option value="3rd Year">3rd Year</option><option value="4th Year">4th Year</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="select-label">Semester:</label><br />
                        <select value={semester} onChange={(e) => setSemester(e.target.value)} className="form-select">
                            <option value="1st Semester">1st Semester</option><option value="2nd Semester">2nd Semester</option><option value="3rd Semester">3rd Semester</option><option value="4th Semester">4th Semester</option>
                        </select>
                    </div>
                </div>

                <div className="schedule-box">
                    <div className="form-group">
                        <label className="schedule-label">Exam Date:</label><br />
                        <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} required className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="schedule-label">Start Time:</label><br />
                        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="schedule-label">Duration (Minutes):</label><br />
                        <input type="number" value={durationMinutes} min="1" onChange={(e) => setDurationMinutes(e.target.value)} required className="form-input" />
                    </div>
                </div>

                <h4 className="section-subtitle">Questions Setup:</h4>
                {questions.map((q, index) => (
                    <div key={index} className="question-box">
                        <label className="form-label">Question {index + 1}:</label>
                        <input type="text" placeholder="Enter question text" value={q.questionText} onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)} required className="form-input question-input-space" />

                        <div className="form-grid-2 options-grid">
                            <input type="text" placeholder="Option A" value={q.optionA} onChange={(e) => handleQuestionChange(index, 'optionA', e.target.value)} required className="form-select" />
                            <input type="text" placeholder="Option B" value={q.optionB} onChange={(e) => handleQuestionChange(index, 'optionB', e.target.value)} required className="form-select" />
                            <input type="text" placeholder="Option C" value={q.optionC} onChange={(e) => handleQuestionChange(index, 'optionC', e.target.value)} required className="form-select" />
                            <input type="text" placeholder="Option D" value={q.optionD} onChange={(e) => handleQuestionChange(index, 'optionD', e.target.value)} required className="form-select" />
                        </div>

                        <label className="select-label">Correct Option: </label>
                        <select value={q.correctOption} onChange={(e) => handleQuestionChange(index, 'correctOption', e.target.value)} className="correct-select">
                            <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                        </select>
                    </div>
                ))}

                <button type="button" onClick={handleAddQuestionField} className="add-question-btn">
                    + Add More Question
                </button>
                <button type="submit" className="save-exam-btn">
                    Save & Generate Unique Code
                </button>
            </form>

            {uniqueLink && (
                <div className="unique-link-box">
                    <b>Exam Scheduled Successfully!</b><br />
                    Share Unique Code with Students: <h3 className="link-text">{uniqueLink}</h3>
                </div>
            )}

            <hr className="dashboard-divider-heavy" />

            <h3 className="section-title">Your Scheduled Exams</h3>
            {teacherExams.length === 0 ? (
                <p className="no-exam-text">No exams created yet.</p>
            ) : (
                <div className="exams-grid">
                    {teacherExams.map((exam) => (
                        <div key={exam.id} onClick={() => handleSelectExamCard(exam)} className={`exam-card ${selectedExam?.id === exam.id ? 'selected-card' : ''}`}>
                            <h4 className="exam-card-title">{exam.title}</h4>
                            <p className="exam-card-text">Code: <b>{exam.uniqueLink}</b></p>
                            <p className="exam-card-date">📅 Date: {exam.examDate} | ⏰ {exam.startTime}</p>
                            <p className="exam-card-duration">Duration: <b>{exam.durationMinutes} mins</b></p>
                            
                            {/* <button 
                                onClick={(e) => handleDeleteExam(exam.id, e)} 
                                className="delete-btn">
                                
                            </button> */}
                        </div>
                    ))}
                </div>
            )}

            {selectedExam && (
                <div className="selected-exam-details">
                    <div className="details-header">
                        <div>
                            <h3 className="details-title">{selectedExam.title} (Sub: {selectedExam.subject})</h3>
                            <p className="details-subtext">
                                <b>Date:</b> {selectedExam.examDate} &bull; <b>Start Time:</b> {selectedExam.startTime} &bull; <b>Duration:</b> {selectedExam.durationMinutes} Mins
                            </p>
                        </div>
                        <button 
                            onClick={(e) => handleDeleteExam(selectedExam.id, e)} 
                            className="delete-details-btn">
                            Delete This Exam
                        </button>
                    </div>

                    <h4 className="section-subtitle">Questions & Correct Answers:</h4>
                    <div className="questions-list-container">
                        {examQuestions.map((q, qIndex) => (
                            <div key={q.id || qIndex} className="question-detail-box">
                                <p className="question-detail-text">Q{qIndex + 1}. {q.questionText}</p>
                                <div className="options-detail-grid">
                                    <div className={`option-item ${q.correctOption === 'A' ? 'highlight-correct' : ''}`}><b>A)</b> {q.optionA}</div>
                                    <div className={`option-item ${q.correctOption === 'B' ? 'highlight-correct' : ''}`}><b>B)</b> {q.optionB}</div>
                                    <div className={`option-item ${q.correctOption === 'C' ? 'highlight-correct' : ''}`}><b>C)</b> {q.optionC}</div>
                                    <div className={`option-item ${q.correctOption === 'D' ? 'highlight-correct' : ''}`}><b>D)</b> {q.optionD}</div>
                                </div>
                                <div className="correct-answer-badge">
                                    Correct Answer: Option {q.correctOption}
                                </div>
                            </div>
                        ))}
                    </div>

                    <hr className="details-divider" />

                    <h4 className="section-subtitle">Student Scorecard:</h4>
                    {allResults.filter(res => Number(res.examId) === Number(selectedExam.id)).length === 0 ? (
                        <p className="no-exam-text">No submissions yet.</p>
                    ) : (
                        <table className="scorecard-table">
                            <thead>
                                <tr className="table-header-row">
                                    <th>Roll Number</th>
                                    <th>Student Name</th>
                                    <th>Course</th>
                                    <th>Semester</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allResults
                                    .filter(res => Number(res.examId) === Number(selectedExam.id))
                                    .map((res, rIndex) => (
                                        <tr key={rIndex} className="table-body-row">
                                            <td>{res.rollNumber}</td>
                                            <td>{res.studentName}</td>
                                            <td>{res.course}</td>
                                            <td>{res.semester}</td>
                                            <td><b className="score-text">{res.score} / {res.totalQuestions}</b></td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}