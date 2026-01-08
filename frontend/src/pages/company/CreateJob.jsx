import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import SkillImportanceSelector from '../../components/SkillImportanceSelector';

function CreateJob() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });
    const [availableSkills, setAvailableSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadAvailableSkills();
    }, []);

    const loadAvailableSkills = async () => {
        try {
            const res = await api.get('/skills');
            setAvailableSkills(res.data.skills);
        } catch (error) {
            console.error('Error loading skills:', error);
            setError('Failed to load skills');
        }
    };

    const addSkill = (skillId) => {
        const skill = availableSkills.find(s => s._id === skillId);
        if (skill && !selectedSkills.find(s => s.skillId === skillId)) {
            setSelectedSkills([
                ...selectedSkills,
                {
                    skillId: skillId,
                    skillName: skill.name,
                    importance: 3,
                    minSCI: 50
                }
            ]);
        }
    };

    const updateSkillImportance = (skillId, importance) => {
        setSelectedSkills(selectedSkills.map(skill =>
            skill.skillId === skillId ? { ...skill, importance } : skill
        ));
    };

    const updateSkillMinSCI = (skillId, minSCI) => {
        setSelectedSkills(selectedSkills.map(skill =>
            skill.skillId === skillId ? { ...skill, minSCI: parseInt(minSCI) } : skill
        ));
    };

    const removeSkill = (skillId) => {
        setSelectedSkills(selectedSkills.filter(skill => skill.skillId !== skillId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.title || !formData.description) {
            setError('Please provide job title and description');
            return;
        }

        if (selectedSkills.length === 0) {
            setError('Please add at least one required skill');
            return;
        }

        setLoading(true);

        try {
            const requiredSkills = selectedSkills.map(skill => ({
                skillId: skill.skillId,
                importance: skill.importance,
                minSCI: skill.minSCI
            }));

            await api.post('/jobs', {
                title: formData.title,
                description: formData.description,
                requiredSkills
            });

            navigate('/company/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-primary-600">TalentBridge</h1>
                            <p className="text-gray-600">{user?.profile?.companyName || 'Company'}</p>
                        </div>
                        <button onClick={logout} className="btn-secondary">
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/company/dashboard')}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                <div className="card">
                    <h2 className="text-2xl font-bold mb-2">Post New Job</h2>
                    <p className="text-gray-600 mb-6">
                        Create a skill-first job posting. No resumes required - candidates are matched purely on their verified skill confidence.
                    </p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Job Title */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">
                                Job Title *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="input-field"
                                placeholder="e.g., Senior Frontend Developer"
                                required
                            />
                        </div>

                        {/* Job Description */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">
                                Job Description *
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="input-field"
                                rows="5"
                                placeholder="Describe the role, responsibilities, and what you're looking for..."
                                required
                            />
                        </div>

                        {/* Required Skills */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">
                                Required Skills *
                            </label>
                            <p className="text-sm text-gray-600 mb-3">
                                Select skills and assign importance weights (1-5). Candidates will be matched based on their SCI scores.
                            </p>

                            {/* Add Skill Dropdown */}
                            <div className="mb-4">
                                <select
                                    className="input-field"
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            addSkill(e.target.value);
                                            e.target.value = '';
                                        }
                                    }}
                                >
                                    <option value="">+ Add a skill</option>
                                    {availableSkills
                                        .filter(skill => !selectedSkills.find(s => s.skillId === skill._id))
                                        .map(skill => (
                                            <option key={skill._id} value={skill._id}>
                                                {skill.name} ({skill.category})
                                            </option>
                                        ))}
                                </select>
                            </div>

                            {/* Selected Skills */}
                            {selectedSkills.length > 0 ? (
                                <div className="space-y-4">
                                    {selectedSkills.map(skill => (
                                        <div key={skill.skillId} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="font-semibold text-lg">{skill.skillName}</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSkill(skill.skillId)}
                                                    className="text-red-600 hover:text-red-700 text-sm"
                                                >
                                                    Remove
                                                </button>
                                            </div>

                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-sm text-gray-600 mb-1">
                                                        Importance Level
                                                    </label>
                                                    <SkillImportanceSelector
                                                        value={skill.importance}
                                                        onChange={(value) => updateSkillImportance(skill.skillId, value)}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm text-gray-600 mb-1">
                                                        Minimum SCI Required: {skill.minSCI}
                                                    </label>
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="100"
                                                        value={skill.minSCI}
                                                        onChange={(e) => updateSkillMinSCI(skill.skillId, e.target.value)}
                                                        className="w-full"
                                                    />
                                                    <div className="flex justify-between text-xs text-gray-500">
                                                        <span>0 (Any level)</span>
                                                        <span>50 (Moderate)</span>
                                                        <span>100 (Expert)</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                                    <p className="text-gray-500">No skills added yet. Select skills from the dropdown above.</p>
                                </div>
                            )}
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <h4 className="font-semibold text-blue-900 mb-2">🎯 Skill-First Hiring</h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• No resume required - candidates matched on verified skills only</li>
                                <li>• Importance weights (1-5) determine how much each skill affects the match</li>
                                <li>• Candidates see their match percentage before applying</li>
                                <li>• All matching is transparent and explainable</li>
                            </ul>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full"
                        >
                            {loading ? 'Posting Job...' : 'Post Job'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateJob;
