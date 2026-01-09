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
    const avgSCI = skills.length > 0
        ? Math.round(skills.reduce((sum, s) => sum + (s.sci || 0), 0) / skills.length)
        : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-blue-50/30">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-black text-white mb-1">TalentBridge</h1>
                            <p className="text-purple-100">Welcome back, {user?.profile?.name || 'Student'}! 👋</p>
                        </div>
                        <button onClick={logout} className="btn-secondary bg-white/20 hover:bg-white/30 text-white border-white/30">
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8 py-4 overflow-x-auto">
                        <Link to="/student/dashboard" className="nav-link active whitespace-nowrap">
                            📊 Dashboard
                        </Link>
                        <Link to="/student/skills" className="nav-link whitespace-nowrap">
                            ⚡ My Skills
                        </Link>
                        <Link to="/student/sci" className="nav-link whitespace-nowrap">
                            🧮 SCI Calculator
                        </Link>
                        <Link to="/student/gap-analysis" className="nav-link whitespace-nowrap">
                            🎯 Gap Analysis
                        </Link>
                        <Link to="/student/ai-tutor" className="nav-link whitespace-nowrap">
                            🤖 AI Tutor
                        </Link>
                        <Link to="/student/navigator" className="nav-link whitespace-nowrap">
                            🗺️ Navigator
                        </Link>
                        <Link to="/student/career-path" className="nav-link whitespace-nowrap">
                            🚀 Career Path
                        </Link>
                        <Link to="/student/jobs" className="nav-link whitespace-nowrap">
                            💼 Find Jobs
                        </Link>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-up">
                    <div className="card-gradient hover-lift group cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Skills</h3>
                                <p className="text-4xl font-black text-gradient">{skills.length}</p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-purple-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                                <span className="text-3xl">⚡</span>
                            </div>
                        </div>
                    </div>

                    <div className="card-gradient hover-lift group cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-600 mb-2">Avg SCI Score</h3>
                                <p className={`text-4xl font-black ${getSCIColor(avgSCI)}`}>{avgSCI}</p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                                <span className="text-3xl">📊</span>
                            </div>
                        </div>
                    </div>

                    <div className="card-gradient hover-lift group cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-600 mb-2">Needs Attention</h3>
                                <p className="text-4xl font-black text-orange-600">{skillsNeedingAttention.length}</p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                                <span className="text-3xl">⚠️</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skills Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Skills List */}
                    <div className="card-glass animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gradient">Your Skills</h2>
                            <Link to="/student/skills" className="btn-primary text-sm py-2 px-4">
                                Manage Skills
                            </Link>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="loading-spinner"></div>
                                <span className="ml-3 text-gray-600">Loading skills...</span>
                            </div>
                        ) : skills.length === 0 ? (
                            <div className="empty-state">
                                <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-5xl">🎯</span>
                                </div>
                                <p className="text-gray-500 mb-4">No skills added yet</p>
                                <Link to="/student/skills" className="btn-primary">
                                    Add Your First Skill
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {skills.slice(0, 5).map((skill) => (
                                    <div key={skill._id} className="skill-card">
                                        <div className="flex justify-between items-start mb-2 relative z-10">
                                            <div>
                                                <h3 className="font-bold text-gray-800">{skill.skillId?.name || 'Unknown Skill'}</h3>
                                                <span className="text-xs text-gray-500">{skill.category}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-3xl font-black ${getSCIColor(skill.sci)}`}>
                                                    {Math.round(skill.sci)}
                                                </span>
                                                <p className="text-xs text-gray-500 font-semibold">SCI</p>
                                            </div>
                                        </div>

                                        {needsReassessment(skill) && (
                                            <div className="mt-3 relative z-10">
                                                <Link
                                                    to={`/student/assessment/${skill.skillId._id}`}
                                                    className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-semibold group"
                                                >
                                                    <span>Take Assessment</span>
                                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {skills.length > 5 && (
                                    <Link to="/student/skills" className="block text-center text-primary-600 hover:text-primary-700 font-semibold pt-3 group">
                                        View all {skills.length} skills
                                        <svg className="w-4 h-4 inline-block ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Action Items */}
                    <div className="space-y-4">
                        <div className="card-glass animate-fade-in">
                            <h2 className="text-2xl font-bold text-gradient mb-5">Quick Actions</h2>

                            <div className="space-y-3">
                                {skillsNeedingAttention.length > 0 && (
                                    <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-4 hover-lift">
                                        <h3 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
                                            <span>⚠️</span>
                                            <span>Skills Need Attention</span>
                                        </h3>
                                        <p className="text-sm text-orange-700 mb-3">
                                            {skillsNeedingAttention.length} skill(s) have low SCI or are outdated
                                        </p>
                                        <div className="space-y-2">
                                            {skillsNeedingAttention.slice(0, 3).map(skill => (
                                                <div key={skill._id} className="flex justify-between items-center bg-white/60 rounded-lg p-2">
                                                    <span className="text-sm font-medium">{skill.skillId?.name}</span>
                                                    <Link
                                                        to={`/student/assessment/${skill.skillId._id}`}
                                                        className="text-xs bg-orange-600 text-white px-3 py-1 rounded-lg hover:bg-orange-700 font-semibold"
                                                    >
                                                        Reassess
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <Link to="/student/gap-analysis" className="block">
                                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-5 hover-lift transition-all duration-300 hover:shadow-glow">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
                                                <span className="text-2xl">📊</span>
                                            </div>
                                            <h3 className="font-bold text-blue-900">Check Your Readiness</h3>
                                        </div>
                                        <p className="text-sm text-blue-700">
                                            See which roles match your current skills
                                        </p>
                                    </div>
                                </Link>

                                <Link to="/student/ai-tutor" className="block">
                                    <div className="bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200 rounded-xl p-5 hover-lift transition-all duration-300 hover:shadow-glow">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center">
                                                <span className="text-2xl">🤖</span>
                                            </div>
                                            <h3 className="font-bold text-purple-900">AI Learning Tutor</h3>
                                        </div>
                                        <p className="text-sm text-purple-700">
                                            Get personalized learning recommendations
                                        </p>
                                    </div>
                                </Link>

                                <Link to="/student/career-path" className="block">
                                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5 hover-lift transition-all duration-300 hover:shadow-glow">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                                                <span className="text-2xl">🎯</span>
                                            </div>
                                            <h3 className="font-bold text-green-900">Explore Career Paths</h3>
                                        </div>
                                        <p className="text-sm text-green-700">
                                            Visualize your career progression roadmap
                                        </p>
                                    </div>
                                </Link>

                                <Link to="/student/jobs" className="block">
                                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-5 hover-lift transition-all duration-300 hover:shadow-glow">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center">
                                                <span className="text-2xl">💼</span>
                                            </div>
                                            <h3 className="font-bold text-purple-900">Browse Jobs</h3>
                                        </div>
                                        <p className="text-sm text-purple-700">
                                            Find opportunities matching your skills
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Box */}
                <div className="mt-8 card-gradient">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">ℹ️</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-2">About Skill Confidence Index (SCI)</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                SCI is a transparent, rule-based score measuring your skill confidence:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="bg-white/60 rounded-lg p-3">
                                    <p className="font-bold text-primary-700 mb-1">Assessment 40%</p>
                                    <p className="text-gray-600 text-xs">Your test performance</p>
                                </div>
                                <div className="bg-white/60 rounded-lg p-3">
                                    <p className="font-bold text-primary-700 mb-1">Freshness 35%</p>
                                    <p className="text-gray-600 text-xs">How recently used</p>
                                </div>
                                <div className="bg-white/60 rounded-lg p-3">
                                    <p className="font-bold text-primary-700 mb-1">Scenario 25%</p>
                                    <p className="text-gray-600 text-xs">Real-world solving</p>
                                </div>
                            </div>
                            <p className="text-xs text-primary-600 mt-3 font-semibold">
                                💡 Take assessments regularly to keep your SCI up to date!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard;
