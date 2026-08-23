import React from 'react';

export default function ResultPage({ result, onBackToDashboard }) {
    return (
        <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
            <h2>Exam Result</h2>
            <hr style={{ margin: '15px 0' }} />

            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <p style={{ fontSize: '18px', marginBottom: '10px' }}>Your Score:</p>
                <h1 style={{ color: '#28a745', fontSize: '48px', margin: '0' }}>
                    {result.score} / {result.totalQuestions}
                </h1>
            </div>

            <p>Thank you for submitting the exam. Your response has been recorded successfully.</p>

            <button 
                onClick={onBackToDashboard} 
                style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
            >
                Back to Dashboard
            </button>
        </div>
    );
}