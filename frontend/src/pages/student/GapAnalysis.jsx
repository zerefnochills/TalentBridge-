import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import SkillMatchBreakdown from '../components/SkillMatchBreakdown';

function GapAnalysis() {
    const { user, logout } = useAuth();
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
            const res = await api.get(`/analysis/gap/${roleId}`);
            setGapAnalysis(res.data);
        } catch (error) {
            console.error('Error analyzing gap:', error);
            alert('Failed to analyze skill gap');
        }
    };

    const getReadinessColor = (percentage) => {
        if (percentage >= 80) return 'text-green-600';
        if (percentage >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getReadinessText = (percentage) => {
        if (percentage >= 80) return 'Ready for this role!';
        if (percentage >= 60) return 'Almost ready - polish a few skills';
        return 'Significant skill gaps - keep building';
    };

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

                <h2 className="text-3xl font-bold mb-2">Gap Analysis</h2>
                <p className="text-gray-600 mb-6">
                    See how your current skills match different job roles and identify what to learn next.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Role Selection */}
                    <div className="lg:col-span-1">
                        <div className="card sticky top-4">
                            <h3 className="font-semibold mb-4">Select a Role</h3>

                            {loading ? (
                                <p className="text-gray-500">Loading roles...</p>
                            ) : roles.length === 0 ? (
                                <p className="text-gray-500">No roles available</p>
                            ) : (
                                <div className="space-y-2">
                                    {roles.map(role => (
                                        <button
                                            key={role._id}
                                            onClick={() => analyzeGap(role._id)}
                                            className={`w-full text-left p-3 rounded-lg border-2 transition ${selectedRole === role._id
                                                    ? 'border-primary-600 bg-primary-50'
                                                    : 'border-gray-200 hover:border-primary-300'
                                                }`}
                                        >
                                            <div className="font-medium">{role.name}</div>
                                            <div className="text-xs text-gray-500 mt-1">
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
                                <p className="text-gray-500">
                                    Select a role from the left to see your skill gap analysis
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Overall Readiness */}
                                <div className="card">
                                    <div className="text-center mb-6">
                                        <h3 className="text-xl font-bold mb-2">{gapAnalysis.role?.name}</h3>
                                        <div className={`text-5xl font-bold ${getReadinessColor(gapAnalysis.matchPercentage)}`}>
                                            {gapAnalysis.matchPercentage}%
                                        </div>
                                        <p className="text-gray-600 mt-2">{getReadinessText(gapAnalysis.matchPercentage)}</p>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                {gapAnalysis.skillBreakdown?.filter(s => s.status === 'meets').length || 0}
                                            </div>
                                            <div className="text-xs text-gray-600">Skills Met</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-yellow-600">
                                                {gapAnalysis.skillBreakdown?.filter(s => s.status === 'below').length || 0}
                                            </div>
                                            <div className="text-xs text-gray-600">Below Threshold</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-red-600">
                                                {gapAnalysis.skillBreakdown?.filter(s => s.status === 'missing').length || 0}
                                            </div>
                                            <div className="text-xs text-gray-600">Missing Skills</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Breakdown */}
                                <div className="card">
                                    <SkillMatchBreakdown skillBreakdown={gapAnalysis.skillBreakdown} />
                                </div>

                                {/* Recommendations */}
                                {gapAnalysis.recommendations && gapAnalysis.recommendations.length > 0 && (
                                    <div className="card bg-blue-50 border-blue-200">
                                        <h4 className="font-semibold text-blue-900 mb-3">📚 Learning Recommendations</h4>
                                        <ul className="space-y-2">
                                            {gapAnalysis.recommendations.map((rec, idx) => (
                                                <li key={idx} className="text-sm text-blue-800">
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
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-bold text-blue-900 mb-2">💡 About Gap Analysis</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• See exactly which skills you need for any role</li>
                        <li>• Focus your learning on high-impact skills</li>
                        <li>• Track your progress toward career goals</li>
                        <li>• All analysis based on transparent SCI calculations</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default GapAnalysis;
