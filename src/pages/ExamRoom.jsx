import React, { useState } from 'react';
import { submitExam } from '../services/api';
import './ExamRoom.css'; // CSS file import ki gayi hai

export default function ExamRoom({ user, exam, questions, onSubmitFinished }) {
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleOptionSelect = (questionId, optionKey) => {
        setAnswers({
            ...answers,
            [questionId]: optionKey
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!window.confirm("Kya aap apna exam submit karna chahte hain?")) return;

        setSubmitting(true);
        try {
            const submissionData = {
                examId: exam.id,
                studentId: user.id,
                answers: answers
            };
            const result = await submitExam(submissionData);
            alert("Exam Submitted Successfully!");
            onSubmitFinished(result);
        } catch (err) {
            alert("Failed to submit exam!");
            setSubmitting(false);
        }
    };

    return (
        <div className="exam-room-container">
            <h2>Exam: {exam.title}</h2>
            <p>Student: <strong>{user.name}</strong></p>
            <hr className="exam-divider" />

            <form onSubmit={handleSubmit}>
                {questions.map((q, index) => (
                    <div key={q.id} className="question-card">
                        <p className="question-text"><strong>Q{index + 1}: {q.questionText}</strong></p>
                        
                        <div className="options-group">
                            {['A', 'B', 'C', 'D'].map((optKey) => {
                                const optionText = q[`option${optKey}`];
                                if (!optionText) return null;
                                const isSelected = answers[q.id] === optKey;

                                return (
                                    <label key={optKey} className={`option-label ${isSelected ? 'selected' : ''}`}>
                                        <input 
                                            type="radio" 
                                            name={`question_${q.id}`} 
                                            value={optKey} 
                                            checked={isSelected} 
                                            onChange={() => handleOptionSelect(q.id, optKey)} 
                                            className="option-input"
                                        />
                                        <strong>{optKey}.</strong> {optionText}
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                ))}

                <button 
                    type="submit" 
                    disabled={submitting} 
                    className="submit-btn"
                >
                    {submitting ? "Submitting..." : "Submit Exam"}
                </button>
            </form>
        </div>
    );
}