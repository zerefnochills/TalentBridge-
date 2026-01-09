import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

function SkillManagement() {
    const { user } = useAuth();
    const [availableSkills, setAvailableSkills] = useState([]);
    const [userSkills, setUserSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [skillsRes, userSkillsRes] = await Promise.all([
                api.get('/skills'),
                api.get('/skills/user')
            ]);
            setAvailableSkills(skillsRes.data.skills);
            setUserSkills(userSkillsRes.data.skills);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const addSkill = async (skillId) => {
        try {
            await api.post('/skills/user', {
                skillId,
                lastUsedDate: new Date().toISOString()
            });
            loadData();
        } catch (error) {
            console.error('Error adding skill:', error);
            alert('Failed to add skill');
        }
    };

    const removeSkill = async (skillId) => {
        if (!confirm('Are you sure you want to remove this skill?')) return;

        try {
            await api.delete(`/skills/user/${skillId}`);
            loadData();
        } catch (error) {
            console.error('Error removing skill:', error);
            alert('Failed to remove skill');
        }
    };

    const getSCIColor = (sci) => {
        if (sci >= 80) return 'text-success';
        if (sci >= 60) return 'text-primary-400';
        if (sci >= 40) return 'text-warning';
        return 'text-danger';
    };

    const filteredAvailableSkills = availableSkills.filter(skill =>
        !userSkills.find(us => us.skillId?._id === skill._id) &&
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-main mb-2">⚡ Skill Management</h1>
                <p className="text-text-muted">Add and manage your skills to build your profile</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Your Skills */}
                <div className="card">
                    <h3 className="text-xl font-bold text-text-main mb-4">Your Skills ({userSkills.length})</h3>

                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="loading-spinner"></div>
                        </div>
                    ) : userSkills.length === 0 ? (
                        <div className="empty-state">
                            <div className="text-5xl mb-4">🎯</div>
                            <p className="text-text-muted mb-2">No skills added yet</p>
                            <p className="text-sm text-text-muted">Add skills from the right panel to get started!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {userSkills.map(userSkill => (
                                <div key={userSkill._id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-semibold text-text-main">{userSkill.skillId?.name}</h4>
                                            <p className="text-xs text-text-muted">{userSkill.skillId?.category}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-2xl font-bold ${getSCIColor(userSkill.sci)}`}>
                                                {Math.round(userSkill.sci)}
                                            </span>
                                            <p className="text-xs text-text-muted">SCI</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-3">
                                        <Link
                                            to={`/student/assessment/${userSkill.skillId?._id}`}
                                            className="btn btn-primary text-sm flex-1 text-center justify-center py-2"
                                        >
                                            Take Assessment
                                        </Link>
                                        <button
                                            onClick={() => removeSkill(userSkill.skillId?._id)}
                                            className="px-3 py-1 bg-danger/20 text-danger rounded-lg hover:bg-danger/30 text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Add New Skills */}
                <div className="card">
                    <h3 className="text-xl font-bold text-text-main mb-4">Add New Skills</h3>

                    <input
                        type="text"
                        placeholder="Search skills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field mb-4"
                    />

                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="loading-spinner"></div>
                        </div>
                    ) : filteredAvailableSkills.length === 0 ? (
                        <div className="empty-state">
                            <p className="text-text-muted">
                                {searchTerm ? 'No skills found matching your search' : 'All available skills added!'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {filteredAvailableSkills.map(skill => (
                                <div
                                    key={skill._id}
                                    className="bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-colors"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-medium text-text-main">{skill.name}</h4>
                                            <p className="text-xs text-text-muted">{skill.category}</p>
                                        </div>
                                        <button
                                            onClick={() => addSkill(skill._id)}
                                            className="btn btn-primary text-sm py-1.5 px-4"
                                        >
                                            + Add
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Info Box */}
            <div className="mt-8 card border-primary-500/30 bg-primary-500/10">
                <div className="flex items-start gap-4">
                    <div className="text-3xl">💡</div>
                    <div>
                        <h3 className="font-bold text-primary-400 mb-2">How It Works</h3>
                        <ul className="text-sm text-text-muted space-y-1">
                            <li>• Add skills you want to demonstrate competence in</li>
                            <li>• Take assessments to calculate your SCI (Skill Confidence Index)</li>
                            <li>• Higher SCI = Better job matches and rankings</li>
                            <li>• Retake assessments periodically to keep your scores fresh</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SkillManagement;
