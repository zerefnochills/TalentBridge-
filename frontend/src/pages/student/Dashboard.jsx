import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import SCIBreakdown from '../../components/SCIBreakdown';

function StudentDashboard() {
    const { user, logout } = useAuth();
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadSkills();
    }, []);

    const loadSkills = async () => {
        try {
            const res = await api.get('/skills/user');
            setSkills(res.data.skills);
        } catch (error) {
            console.error('Error loading skills:', error);
        } finally {
            setLoading(false);
        }
    };

    const getSCIColor = (sci) => {
        if (sci >= 80) return 'text-green-600';
        if (sci >= 60) return 'text-blue-600';
        if (sci >= 40) return 'text-yellow-600';
        if (sci >= 20) return 'text-orange-600';
        return 'text-red-600';
    };

    const needsReassessment = (skill) => {
        return skill.freshnessScore < 50 || skill.sci < 40;
    };

    const skillsNeedingAttention = skills.filter(s => needsReassessment(s));

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

            {/* Navigation */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8 py-4">
                        <Link to="/student/dashboard" className="text-primary-600 font-medium border-b-2 border-primary-600 pb-1">
                            Dashboard
                        </Link>
                        <Link to="/student/skills" className="text-gray-600 hover:text-primary-600">
                            My Skills
                        </Link>
                        <Link to="/student/gap-analysis" className="text-gray-600 hover:text-primary-600">
                            Gap Analysis
                        </Link>
                        <Link to="/student/career-path" className="text-gray-600 hover:text-primary-600">
                            Career Path
                        </Link>
                        <Link to="/student/jobs" className="text-gray-600 hover:text-primary-600">
                            Find Jobs
                        </Link>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card">
                        <h3 className="text-lg font-semibold mb-2">Total Skills</h3>
                        <p className="text-3xl font-bold text-primary-600">{skills.length}</p>
                    </div>
                    <div className="card">
                        <h3 className="text-lg font-semibold mb-2">Avg SCI Score</h3>
                        <p className="text-3xl font-bold text-blue-600">
                            {skills.length > 0
                                ? Math.round(skills.reduce((sum, s) => sum + (s.sci || 0), 0) / skills.length)
                                : 0}
                        </p>
                    </div>
                    <div className="card">
                        <h3 className="text-lg font-semibold mb-2">Needs Attention</h3>
                        <p className="text-3xl font-bold text-orange-600">{skillsNeedingAttention.length}</p>
                    </div>
                </div>

                {/* Skills Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Skills List */}
                    <div className="card">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Your Skills</h2>
                            <Link to="/student/skills" className="btn-primary">
                                Manage Skills
                            </Link>
                        </div>

                        {loading ? (
                            <p className="text-gray-500">Loading skills...</p>
                        ) : skills.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">No skills added yet</p>
                                <Link to="/student/skills" className="btn-primary">
                                    Add Your First Skill
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {skills.slice(0, 5).map((skill) => (
                                    <div key={skill._id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-semibold">{skill.skillId?.name || 'Unknown Skill'}</h3>
                                                <span className="text-xs text-gray-500">{skill.category}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-2xl font-bold ${getSCIColor(skill.sci)}`}>
                                                    {Math.round(skill.sci)}
                                                </span>
                                                <p className="text-xs text-gray-500">SCI</p>
                                            </div>
                                        </div>

                                        {needsReassessment(skill) && (
                                            <div className="mt-2">
                                                <Link
                                                    to={`/student/assessment/${skill.skillId._id}`}
                                                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                                                >
                                                    → Take Assessment
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {skills.length > 5 && (
                                    <Link to="/student/skills" className="block text-center text-primary-600 hover:text-primary-700 font-medium">
                                        View all {skills.length} skills →
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Action Items */}
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4">Recommended Actions</h2>

                        <div className="space-y-4">
                            {skillsNeedingAttention.length > 0 && (
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-orange-800 mb-2">
                                        ⚠️ Skills Need Attention
                                    </h3>
                                    <p className="text-sm text-orange-700 mb-3">
                                        {skillsNeedingAttention.length} skill(s) have low SCI or are outdated
                                    </p>
                                    <div className="space-y-2">
                                        {skillsNeedingAttention.slice(0, 3).map(skill => (
                                            <div key={skill._id} className="flex justify-between items-center">
                                                <span className="text-sm">{skill.skillId?.name}</span>
                                                <Link
                                                    to={`/student/assessment/${skill.skillId._id}`}
                                                    className="text-xs bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700"
                                                >
                                                    Reassess
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="font-semibold text-blue-800 mb-2">
                                    📊 Check Your Readiness
                                </h3>
                                <p className="text-sm text-blue-700 mb-3">
                                    See which roles match your current skills
                                </p>
                                <Link to="/student/gap-analysis" className="btn-primary w-full text-center">
                                    Analyze Skill Gaps
                                </Link>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h3 className="font-semibold text-green-800 mb-2">
                                    🎯 Explore Career Paths
                                </h3>
                                <p className="text-sm text-green-700 mb-3">
                                    Visualize your career progression roadmap
                                </p>
                                <Link to="/student/career-path" className="btn-primary w-full text-center">
                                    View Career Path
                                </Link>
                            </div>

                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <h3 className="font-semibold text-purple-800 mb-2">
                                    💼 Browse Jobs
                                </h3>
                                <p className="text-sm text-purple-700 mb-3">
                                    Find opportunities matching your skills
                                </p>
                                <Link to="/student/jobs" className="btn-primary w-full text-center">
                                    Search Jobs
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Box */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-bold text-blue-900 mb-2">ℹ️ About Skill Confidence Index (SCI)</h3>
                    <p className="text-sm text-blue-800 mb-2">
                        SCI is a transparent, rule-based score measuring your skill confidence:
                    </p>
                    <div className="text-sm text-blue-700 space-y-1">
                        <p>• <strong>Assessment (40%)</strong>: Your test performance</p>
                        <p>• <strong>Freshness (35%)</strong>: How recently you used the skill</p>
                        <p>• <strong>Scenario (25%)</strong>: Real-world problem solving</p>
                    </div>
                    <p className="text-xs text-blue-600 mt-3">
                        💡 Take assessments regularly to keep your SCI up to date!
                    </p>
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard;
