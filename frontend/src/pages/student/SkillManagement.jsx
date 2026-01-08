import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

function SkillManagement() {
    const { user, logout } = useAuth();
    const [availableSkills, setAvailableSkills] = useState([]);
    const [userSkills, setUserSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

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
            await api.post('/skills/user', { skillId });
            loadData(); // Reload to update the list
        } catch (error) {
            console.error('Error adding skill:', error);
            alert('Failed to add skill');
        }
    };

    const removeSkill = async (skillId) => {
        if (!confirm('Are you sure you want to remove this skill?')) return;

        try {
            await api.delete(`/skills/user/${skillId}`);
            loadData(); // Reload to update the list
        } catch (error) {
            console.error('Error removing skill:', error);
            alert('Failed to remove skill');
        }
    };

    const getSCIColor = (sci) => {
        if (sci >= 80) return 'text-green-600';
        if (sci >= 60) return 'text-blue-600';
        if (sci >= 40) return 'text-yellow-600';
        return 'text-red-600';
    };

    const filteredAvailableSkills = availableSkills.filter(skill =>
        !userSkills.find(us => us.skillId._id === skill._id) &&
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-primary-600">TalentBridge</h1>
                            <p className="text-gray-600">Welcome, {user?.profile?.name || 'Student'}</p>
                        </div>
                        <button onClick={logout} className="btn-secondary">
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <Link to="/student/dashboard" className="text-primary-600 hover:text-primary-700 font-medium">
                        ← Back to Dashboard
                    </Link>
                </div>

                <h2 className="text-3xl font-bold mb-6">Skill Management</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Your Skills */}
                    <div className="card">
                        <h3 className="text-xl font-bold mb-4">Your Skills ({userSkills.length})</h3>

                        {loading ? (
                            <p className="text-gray-500">Loading...</p>
                        ) : userSkills.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">No skills added yet</p>
                                <p className="text-sm text-gray-600">Add skills from the right panel to get started!</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {userSkills.map(userSkill => (
                                    <div key={userSkill._id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-semibold">{userSkill.skillId?.name}</h4>
                                                <p className="text-xs text-gray-500">{userSkill.skillId?.category}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-2xl font-bold ${getSCIColor(userSkill.sci)}`}>
                                                    {Math.round(userSkill.sci)}
                                                </span>
                                                <p className="text-xs text-gray-500">SCI</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-3">
                                            <Link
                                                to={`/student/assessment/${userSkill.skillId._id}`}
                                                className="btn-primary text-sm flex-1 text-center"
                                            >
                                                Take Assessment
                                            </Link>
                                            <button
                                                onClick={() => removeSkill(userSkill.skillId._id)}
                                                className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
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
                        <h3 className="text-xl font-bold mb-4">Add New Skills</h3>

                        <input
                            type="text"
                            placeholder="Search skills..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field mb-4"
                        />

                        {loading ? (
                            <p className="text-gray-500">Loading skills...</p>
                        ) : filteredAvailableSkills.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">
                                {searchTerm ? 'No skills found matching your search' : 'All available skills added!'}
                            </p>
                        ) : (
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {filteredAvailableSkills.map(skill => (
                                    <div
                                        key={skill._id}
                                        className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className="font-medium">{skill.name}</h4>
                                                <p className="text-xs text-gray-500">{skill.category}</p>
                                            </div>
                                            <button
                                                onClick={() => addSkill(skill._id)}
                                                className="px-4 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm"
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
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-bold text-blue-900 mb-2">💡 How It Works</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Add skills you want to demonstrate competence in</li>
                        <li>• Take assessments to calculate your SCI (Skill Confidence Index)</li>
                        <li>• Higher SCI = Better job matches and rankings</li>
                        <li>• Retake assessments periodically to keep your scores fresh</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default SkillManagement;
