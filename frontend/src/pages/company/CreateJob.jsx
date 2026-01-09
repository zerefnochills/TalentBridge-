import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import SkillImportanceSelector from '../../components/SkillImportanceSelector';

function CreateJob() {
    const { user } = useAuth();
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
        <div className="container">
            {/* Back Link */}
            <div className="mb-6">
                <Link to="/company/dashboard" className="inline-flex items-center text-primary-400 hover:text-primary-300 font-medium">
                    ← Back to Dashboard
                </Link>
            </div>

            <div className="max-w-3xl mx-auto">
                <div className="card">
                    <h2 className="text-2xl font-bold text-text-main mb-2">Post New Job</h2>
                    <p className="text-text-muted mb-6">
                        Create a skill-first job posting. No resumes required - candidates are matched purely on their verified skill confidence.
                    </p>

                    {error && (
                        <div className="bg-danger/20 border border-danger/50 text-danger px-4 py-3 rounded-xl mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Job Title */}
                        <div className="mb-6">
                            <label className="block text-text-main font-medium mb-2">
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
                            <label className="block text-text-main font-medium mb-2">
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
                            <label className="block text-text-main font-medium mb-2">
                                Required Skills *
                            </label>
                            <p className="text-sm text-text-muted mb-3">
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
                                        <div key={skill.skillId} className="bg-white/5 border border-white/10 rounded-xl p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="font-semibold text-lg text-text-main">{skill.skillName}</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSkill(skill.skillId)}
                                                    className="text-danger hover:text-danger/80 text-sm font-medium"
                                                >
                                                    Remove
                                                </button>
                                            </div>

                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-sm text-text-muted mb-1">
                                                        Importance Level
                                                    </label>
                                                    <SkillImportanceSelector
                                                        value={skill.importance}
                                                        onChange={(value) => updateSkillImportance(skill.skillId, value)}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm text-text-muted mb-1">
                                                        Minimum SCI Required: {skill.minSCI}
                                                    </label>
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="100"
                                                        value={skill.minSCI}
                                                        onChange={(e) => updateSkillMinSCI(skill.skillId, e.target.value)}
                                                        className="w-full accent-primary-500"
                                                    />
                                                    <div className="flex justify-between text-xs text-text-muted">
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
                                <div className="text-center py-8 border-2 border-dashed border-white/20 rounded-xl">
                                    <p className="text-text-muted">No skills added yet. Select skills from the dropdown above.</p>
                                </div>
                            )}
                        </div>

                        {/* Info Box */}
                        <div className="card border-primary-500/30 bg-primary-500/10 mb-6">
                            <div className="flex items-start gap-3">
                                <div className="text-xl font-black text-primary-400">i</div>
                                <div>
                                    <h4 className="font-semibold text-primary-400 mb-2">Skill-First Hiring</h4>
                                    <ul className="text-sm text-text-muted space-y-1">
                                        <li>- No resume required - candidates matched on verified skills only</li>
                                        <li>- Importance weights (1-5) determine how much each skill affects the match</li>
                                        <li>- Candidates see their match percentage before applying</li>
                                        <li>- All matching is transparent and explainable</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full py-3 justify-center text-lg"
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
