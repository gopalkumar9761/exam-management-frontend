const API_BASE_URL = "http://localhost:8080/api";

// 1. Signup API
export const registerUser = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error("Signup failed");
    return await response.json();
};

// 2. Login API
export const loginUser = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });
    if (!response.ok) throw new Error("Invalid credentials");
    return await response.json();
};

// 3. Create Exam API (Teacher)
export const createExam = async (examData) => {
    const response = await fetch(`${API_BASE_URL}/exams/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(examData)
    });
    if (!response.ok) throw new Error("Failed to create exam");
    return await response.json();
};

// 4. Join Exam by Unique Link API (Student)
export const getExamByLink = async (uniqueLink) => {
    const response = await fetch(`${API_BASE_URL}/exams/join/${uniqueLink}`);
    if (!response.ok) throw new Error("Invalid Exam Link");
    return await response.json();
};

// 5. Submit Exam API & Get Result
export const submitExam = async (submissionData) => {
    const response = await fetch(`${API_BASE_URL}/results/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
    });
    if (!response.ok) throw new Error("Failed to submit exam");
    return await response.json();
};

// 6. Get Teacher's Created Exams
export const getTeacherExams = async (teacherId) => {
    const response = await fetch(`${API_BASE_URL}/exams/teacher/${teacherId}`);
    if (!response.ok) throw new Error("Failed to fetch teacher exams");
    return await response.json();
};

// 7. Get Questions for a Specific Exam
export const getExamQuestions = async (examId) => {
    const response = await fetch(`${API_BASE_URL}/exams/${examId}/questions`);
    if (!response.ok) throw new Error("Failed to fetch exam questions");
    return await response.json();
};

// 8. Get All Results
export const getAllResults = async () => {
    const response = await fetch(`${API_BASE_URL}/results/all`);
    if (!response.ok) throw new Error("Failed to fetch results");
    return await response.json();
};

// 9. Delete Exam API
export const deleteExamApi = async (examId) => {
    const response = await fetch(`${API_BASE_URL}/exams/${examId}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error("Failed to delete exam");
    return await response.json();
};