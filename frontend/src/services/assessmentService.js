import api from '../utils/api';

// Start an assessment
export const startAssessment = async (skillId) => {
    const res = await api.post('/assessments/start', { skillId });
    return res.data;
};

// Submit an assessment
export const submitAssessment = async (submissionData) => {
    const res = await api.post('/assessments/submit', submissionData);
    return res.data;
};

// Get assessment history
export const getAssessmentHistory = async () => {
    const res = await api.get('/assessments/history');
    return res.data;
};

// Check cooldown status
export const checkCooldown = async (skillId) => {
    const res = await api.get(`/assessments/cooldown/${skillId}`);
    return res.data;
};
