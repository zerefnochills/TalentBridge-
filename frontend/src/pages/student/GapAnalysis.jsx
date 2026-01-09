import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import SkillMatchBreakdown from '../../components/SkillMatchBreakdown';

function GapAnalysis() {
    const { user } = useAuth();
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [gapAnalysis, setGapAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRoles();
    }, []);

    const loadRoles = async () => {
        try {
            const res = await api.get('/analysis/roles');
            setRoles(res.data.roles);
        } catch (error) {
            console.error('Error loading roles:', error);
        } finally {
            setLoading(false);
        }
    };

    const analyzeGap = async (roleId) => {
        setSelectedRole(roleId);
        setGapAnalysis(null);

        try {
            const res = await api.post('/analysis/gap', { roleId });
            setGapAnalysis(res.data);
        } catch (error) {
            console.error('Error analyzing gap:', error);
            alert('Failed to analyze skill gap');
        }
    };

    const getReadinessColor = (percentage) => {
        if (percentage >= 80) return 'text-success';
        if (percentage >= 60) return 'text-warning';
        return 'text-danger';
    };

    const getReadinessText = (percentage) => {
        if (percentage >= 80) return 'Ready for this role!';
        if (percentage >= 60) return 'Almost ready - polish a few skills';
        return 'Significant skill gaps - keep building';
    };

    return (
        <div className="container">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-main mb-2">🎯 Skill Gap Analysis</h1>
                <p className="text-text-muted">
                    See how your current skills match up against your target role requirements.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Role Selection - Sidebar */}
                <div className="lg:col-span-1">
                    <div className="card sticky top-4">
                        <h3 className="font-semibold text-text-main mb-4">Select a Role</h3>

                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="loading-spinner"></div>
                            </div>
                        ) : roles.length === 0 ? (
                            <p className="text-text-muted">No roles available</p>
                        ) : (
                            <div className="space-y-2">
                                {roles.map(role => (
                                    <button
                                        key={role._id}
                                        onClick={() => analyzeGap(role._id)}
                                        className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${selectedRole === role._id
                                            ? 'border-primary-500 bg-primary-500/20 text-text-main'
                                            : 'border-white/10 hover:border-primary-500/50 hover:bg-white/5 text-text-muted'
                                            }`}
                                    >
                                        <div className="font-medium text-text-main">{role.title}</div>
                                        <div className="text-xs text-text-muted mt-1">
                                            {role.requiredSkills?.length || 0} skills required
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Gap Analysis Results */}
                <div className="lg:col-span-2">
                    {!gapAnalysis ? (
                        <div className="card text-center py-12">
                            <div className="text-5xl mb-4">📊</div>
                            <p className="text-text-muted">
                                Select a role from the left to see your skill gap analysis
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Overall Readiness */}
                            <div className="card">
                                <div className="text-center mb-6">
                                    <h3 className="text-xl font-bold text-text-main mb-2">{gapAnalysis.role?.title || 'Unknown Role'}</h3>
                                    <div className={`text-6xl font-black ${getReadinessColor(gapAnalysis.matchPercentage || 0)}`}>
                                        {gapAnalysis.matchPercentage || 0}%
                                    </div>
                                    <p className="text-text-muted mt-2">{getReadinessText(gapAnalysis.matchPercentage || 0)}</p>
                                </div>

                                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-success">
                                            {gapAnalysis.skillBreakdown?.filter(s => s.status === 'meets').length || 0}
                                        </div>
                                        <div className="text-xs text-text-muted">Skills Met</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-warning">
                                            {gapAnalysis.skillBreakdown?.filter(s => s.status === 'below').length || 0}
                                        </div>
                                        <div className="text-xs text-text-muted">Below Threshold</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-danger">
                                            {gapAnalysis.skillBreakdown?.filter(s => s.status === 'missing').length || 0}
                                        </div>
                                        <div className="text-xs text-text-muted">Missing Skills</div>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Breakdown */}
                            <div className="card">
                                <SkillMatchBreakdown skillBreakdown={gapAnalysis.skillBreakdown || []} />
                            </div>

                            {/* Recommendations */}
                            {gapAnalysis.recommendations && gapAnalysis.recommendations.length > 0 && (
                                <div className="card border-primary-500/30 bg-primary-500/10">
                                    <h4 className="font-semibold text-primary-400 mb-3">📚 Learning Recommendations</h4>
                                    <ul className="space-y-2">
                                        {gapAnalysis.recommendations.map((rec, idx) => (
                                            <li key={idx} className="text-sm text-text-muted">
                                                • {rec}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Info Box */}
            <div className="mt-8 card border-primary-500/30 bg-primary-500/10">
                <div className="flex items-start gap-4">
                    <div className="text-3xl">💡</div>
                    <div>
                        <h3 className="font-bold text-primary-400 mb-2">About Gap Analysis</h3>
                        <ul className="text-sm text-text-muted space-y-1">
                            <li>• See exactly which skills you need for any role</li>
                            <li>• Focus your learning on high-impact skills</li>
                            <li>• Track your progress toward career goals</li>
                            <li>• All analysis based on transparent SCI calculations</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GapAnalysis;
