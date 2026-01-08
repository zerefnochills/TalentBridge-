import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

function TeamRisk() {
    const { user, logout } = useAuth();
    const [riskData, setRiskData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTeamRisk();
    }, []);

    const loadTeamRisk = async () => {
        try {
            const res = await api.get('/company/team-risk');
            setRiskData(res.data);
        } catch (error) {
            console.error('Error loading team risk:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (coverage) => {
        if (coverage >= 80) return 'bg-green-100 text-green-800 border-green-300';
        if (coverage >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        return 'bg-red-100 text-red-800 border-red-300';
    };

    const getRiskLevel = (coverage) => {
        if (coverage >= 80) return { level: 'Low Risk', icon: '✅' };
        if (coverage >= 60) return { level: 'Medium Risk', icon: '⚠️' };
        return { level: 'High Risk', icon: '🚨' };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-blue-50/30">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-black text-white mb-1">⚠️ Team Risk Meter</h1>
                            <p className="text-purple-100">{user?.profile?.companyName} 🏢</p>
                        </div>
                        <button onClick={logout} className="btn-secondary bg-white/20 hover:bg-white/30 text-white border-white/30">
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 animate-slide-up">
                    <Link to="/company/dashboard" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold group">
                        <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>

                <div className="mb-8 text-center">
                    <h2 className="text-4xl font-black text-gradient mb-3">Analyze Team Skill Coverage</h2>
                    <p className="text-gray-600 text-lg">
                        Identify critical skill gaps and reduce project delivery risks.
                    </p>
                </div>

                {loading ? (
                    <div className="card">
                        <p className="text-gray-500">Loading team risk analysis...</p>
                    </div>
                ) : !riskData ? (
                    <div className="card">
                        <div className="text-center py-8">
                            <p className="text-gray-600 mb-4">
                                No team data available yet. Hire candidates to see team risk analysis.
                            </p>
                            <Link to="/company/dashboard" className="btn-primary">
                                View Jobs
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Overall Risk Score */}
                        <div className="card-glass text-center animate-scale-in">
                            <h3 className="text-2xl font-bold mb-4 text-gradient">Overall Team Health</h3>
                            <div className="relative inline-block mb-6">
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl opacity-30"></div>
                                <div className="relative text-8xl font-black text-yellow-600 bg-white rounded-full w-48 h-48 flex items-center justify-center shadow-lg mx-auto">
                                    {riskData.overallCoverage || 75}%
                                </div>
                            </div>
                            <div className="inline-block px-6 py-3 rounded-2xl border-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-300 font-bold shadow-md">
                                ⚠️ Medium Risk
                            </div>
                            <p className="text-sm text-gray-600 mt-4 max-w-md mx-auto">
                                Based on average skill coverage across all critical competencies
                            </p>
                        </div>

                        {/* Skill Coverage Matrix */}
                        <div className="card">
                            <h3 className="text-lg font-semibold mb-4">Skill Coverage Analysis</h3>
                            <div className="space-y-3">
                                {[
                                    { skill: 'JavaScript', coverage: 85, teamMembers: 4 },
                                    { skill: 'React', coverage: 70, teamMembers: 3 },
                                    { skill: 'Node.js', coverage: 55, teamMembers: 2 },
                                    { skill: 'Python', coverage: 40, teamMembers: 1 },
                                    { skill: 'SQL', coverage: 65, teamMembers: 2 },
                                    { skill: 'AWS', coverage: 30, teamMembers: 1 }
                                ].map((item, idx) => {
                                    const risk = getRiskLevel(item.coverage);
                                    return (
                                        <div key={idx} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg">{risk.icon}</span>
                                                    <div>
                                                        <h4 className="font-semibold">{item.skill}</h4>
                                                        <p className="text-xs text-gray-500">
                                                            {item.teamMembers} team member(s)
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(item.coverage)}`}>
                                                    {item.coverage}% coverage
                                                </div>
                                            </div>
                                            <div className="bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${item.coverage >= 80 ? 'bg-green-500' :
                                                        item.coverage >= 60 ? 'bg-yellow-500' :
                                                            'bg-red-500'
                                                        }`}
                                                    style={{ width: `${item.coverage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Critical Gaps */}
                        <div className="card bg-red-50 border-red-200">
                            <h3 className="text-lg font-semibold text-red-900 mb-3">🚨 Critical Skill Gaps</h3>
                            <p className="text-sm text-red-800 mb-4">
                                These skills have low coverage and may pose a risk to project delivery:
                            </p>
                            <div className="space-y-2">
                                <div className="bg-white rounded-lg p-3 border border-red-200">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-red-900">AWS (30% coverage)</span>
                                        <Link to="/company/create-job" className="text-xs text-primary-600 hover:underline">
                                            Post Job →
                                        </Link>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1">
                                        Only 1 team member with AWS expertise. Consider hiring cloud specialists.
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg p-3 border border-red-200">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-red-900">Python (40% coverage)</span>
                                        <Link to="/company/create-job" className="text-xs text-primary-600 hover:underline">
                                            Post Job →
                                        </Link>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1">
                                        Low Python coverage. Training current team or hiring recommended.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div className="card bg-blue-50 border-blue-200">
                            <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Recommendations</h3>
                            <ul className="space-y-2 text-sm text-blue-800">
                                <li className="flex items-start">
                                    <span className="mr-2">1.</span>
                                    <span><strong>Hire AWS specialists</strong> to reduce cloud infrastructure risk</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">2.</span>
                                    <span><strong>Cross-train team members</strong> in Python for better coverage</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">3.</span>
                                    <span><strong>Maintain strong JavaScript coverage</strong> - this is your team's strength</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">4.</span>
                                    <span><strong>Consider Node.js training</strong> to improve backend capabilities</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* Info Box */}
                <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="font-bold text-gray-900 mb-2">📊 How Team Risk Works</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Risk is calculated based on team skill coverage and redundancy</li>
                        <li>• High risk (red): Critical skills with &lt;60% coverage</li>
                        <li>• Medium risk (yellow): Skills with 60-80% coverage</li>
                        <li>• Low risk (green): Well-covered skills with 80%+ coverage</li>
                        <li>• Hire candidates or train existing team to reduce risk</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default TeamRisk;
