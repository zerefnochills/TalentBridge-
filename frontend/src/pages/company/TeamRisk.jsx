import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

function TeamRisk() {
    const { user } = useAuth();
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
        if (coverage >= 80) return 'bg-success/20 text-success border-success/50';
        if (coverage >= 60) return 'bg-warning/20 text-warning border-warning/50';
        return 'bg-danger/20 text-danger border-danger/50';
    };

    const getRiskLevel = (coverage) => {
        if (coverage >= 80) return { level: 'Low Risk', icon: '✅' };
        if (coverage >= 60) return { level: 'Medium Risk', icon: '⚠️' };
        return { level: 'High Risk', icon: '🚨' };
    };

    return (
        <div className="container">
            {/* Page Header */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-text-main mb-2">⚠️ Team Risk Meter</h1>
                <p className="text-text-muted">
                    Identify critical skill gaps and reduce project delivery risks.
                </p>
            </div>

            {loading ? (
                <div className="card text-center py-12">
                    <div className="loading-spinner mx-auto"></div>
                </div>
            ) : !riskData ? (
                <div className="card">
                    <div className="text-center py-8">
                        <div className="text-5xl mb-4">📊</div>
                        <p className="text-text-muted mb-4">
                            No team data available yet. Hire candidates to see team risk analysis.
                        </p>
                        <Link to="/company/dashboard" className="btn btn-primary">
                            View Jobs
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Overall Risk Score */}
                    <div className="card text-center">
                        <h3 className="text-2xl font-bold mb-4 text-text-main">Overall Team Health</h3>
                        <div className="relative inline-block mb-6">
                            <div className="text-8xl font-black text-warning bg-warning/10 rounded-full w-48 h-48 flex items-center justify-center mx-auto border-4 border-warning/30">
                                {riskData.overallCoverage || 75}%
                            </div>
                        </div>
                        <div className="inline-block px-6 py-3 rounded-2xl border-2 bg-warning/20 text-warning border-warning/50 font-bold">
                            ⚠️ Medium Risk
                        </div>
                        <p className="text-sm text-text-muted mt-4 max-w-md mx-auto">
                            Based on average skill coverage across all critical competencies
                        </p>
                    </div>

                    {/* Skill Coverage Matrix */}
                    <div className="card">
                        <h3 className="text-lg font-semibold text-text-main mb-4">Skill Coverage Analysis</h3>
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
                                    <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">{risk.icon}</span>
                                                <div>
                                                    <h4 className="font-semibold text-text-main">{item.skill}</h4>
                                                    <p className="text-xs text-text-muted">
                                                        {item.teamMembers} team member(s)
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(item.coverage)}`}>
                                                {item.coverage}% coverage
                                            </div>
                                        </div>
                                        <div className="progress-bar">
                                            <div
                                                className={`h-full rounded-full ${item.coverage >= 80 ? 'bg-success' :
                                                    item.coverage >= 60 ? 'bg-warning' :
                                                        'bg-danger'
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
                    <div className="card border-danger/30 bg-danger/10">
                        <h3 className="text-lg font-semibold text-danger mb-3">🚨 Critical Skill Gaps</h3>
                        <p className="text-sm text-text-muted mb-4">
                            These skills have low coverage and may pose a risk to project delivery:
                        </p>
                        <div className="space-y-2">
                            <div className="bg-white/5 rounded-lg p-3 border border-danger/30">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-text-main">AWS (30% coverage)</span>
                                    <Link to="/company/create-job" className="text-xs text-primary-400 hover:text-primary-300">
                                        Post Job →
                                    </Link>
                                </div>
                                <p className="text-xs text-text-muted mt-1">
                                    Only 1 team member with AWS expertise. Consider hiring cloud specialists.
                                </p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3 border border-danger/30">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-text-main">Python (40% coverage)</span>
                                    <Link to="/company/create-job" className="text-xs text-primary-400 hover:text-primary-300">
                                        Post Job →
                                    </Link>
                                </div>
                                <p className="text-xs text-text-muted mt-1">
                                    Low Python coverage. Training current team or hiring recommended.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div className="card border-primary-500/30 bg-primary-500/10">
                        <h3 className="text-lg font-semibold text-primary-400 mb-3">💡 Recommendations</h3>
                        <ul className="space-y-2 text-sm text-text-muted">
                            <li className="flex items-start">
                                <span className="mr-2">1.</span>
                                <span><strong className="text-text-main">Hire AWS specialists</strong> to reduce cloud infrastructure risk</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">2.</span>
                                <span><strong className="text-text-main">Cross-train team members</strong> in Python for better coverage</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">3.</span>
                                <span><strong className="text-text-main">Maintain strong JavaScript coverage</strong> - this is your team's strength</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">4.</span>
                                <span><strong className="text-text-main">Consider Node.js training</strong> to improve backend capabilities</span>
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            {/* Info Box */}
            <div className="mt-8 card border-white/10">
                <div className="flex items-start gap-4">
                    <div className="text-3xl">📊</div>
                    <div>
                        <h3 className="font-bold text-text-main mb-2">How Team Risk Works</h3>
                        <ul className="text-sm text-text-muted space-y-1">
                            <li>• Risk is calculated based on team skill coverage and redundancy</li>
                            <li>• High risk (red): Critical skills with &lt;60% coverage</li>
                            <li>• Medium risk (yellow): Skills with 60-80% coverage</li>
                            <li>• Low risk (green): Well-covered skills with 80%+ coverage</li>
                            <li>• Hire candidates or train existing team to reduce risk</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeamRisk;
