import api from '../utils/api';

// Get user's skills
export const getMySkills = async () => {
    const res = await api.get('/skills/user');
    return res.data;
};

// Get all available skills
export const getAvailableSkills = async () => {
    const res = await api.get('/skills');
    return res.data;
};

// Add a skill to user
export const addSkill = async (skillData) => {
    const res = await api.post('/skills/user', skillData);
    return res.data;
};

// Update user skill
export const updateSkill = async (skillId, skillData) => {
    const res = await api.put(`/skills/user/${skillId}`, skillData);
    return res.data;
};

// Delete user skill
export const deleteSkill = async (skillId) => {
    const res = await api.delete(`/skills/user/${skillId}`);
    return res.data;
};

// Recalculate all SCI
export const recalculateAllSCI = async () => {
    const res = await api.post('/skills/user/recalculate');
    return res.data;
};
