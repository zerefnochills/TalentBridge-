import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

function CareerPath() {
    const { user, logout } = useAuth();
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [careerPath, setCareerPath] = useState(null);
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

    const loadCareerPath = async (roleId) => {
        setSelectedRole(roleId);
        setCareerPath(null);

        try {
            const res = await api.get(`/analysis/career-path/${roleId}`);
            setCareerPath(res.data.careerPath);
        } catch (error) {
            console.error('Error loading career path:', error);
        }
    };

    const renderProgressionNode = (node, level = 0) => {
        if (!node) return null;

        const isCurrentRole = level === 0;

        return (
            <div key={node.role._id} className="mb-8">
                <div className={`relative ${level > 0 ? 'ml-12' : ''}`}>
                    {/* Connection Line */}
                    {level > 0 && (
                        <div className="absolute left-0 top-0 w-8 h-1/2 border-l-2 border-b-2 border-gray-300 rounded-bl-lg"
                            style={{ marginLeft: '-48px' }} />
                    )}

                    {/* Role Card */}
                    <div className={`skill-card ${isCurrentRole ? 'border-2 border-primary-600 bg-gradient-to-br from-primary-50 to-purple-50' : 'bg-white border-gray-200'}`}>
                        <div className="flex items-start justify-between">
                            <div className="flex-1 relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg font-bold">{node.role.title}</h3>
                                    {isCurrentRole && (
                                        <span className="px-3 py-1 bg-gradient-to-r from-primary-600 to-purple-600 text-white text-xs font-bold rounded-full">
                                            Starting Point
                                        </span>
                                    )}
                                    {level > 0 && (
                                        <span className="px-3 py-1 bg-gradient-to-r from-blue-400 to-cyan-500 text-white text-xs font-bold rounded-full">
                                            Level {level}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{node.role.description || 'No description available'}</p>

                                {/* Skills Required */}
                                {node.role.requiredSkills && node.role.requiredSkills.length > 0 && (
                                    <div className="mb-3">
                                        <h4 className="text-xs font-semibold text-gray-700 mb-2">Required Skills:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {node.role.requiredSkills.slice(0, 5).map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border border-gray-300"
                                                >
                                                    {skill.skillId?.name || 'Unknown'} (SCI {skill.minimumSCI}+)
                                                </span>
                                            ))}
                                            {node.role.requiredSkills.length > 5 && (
                                                <span className="px-2 py-1 text-gray-500 text-xs">
                                                    +{node.role.requiredSkills.length - 5} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Average Salary */}
                                {node.role.avgSalary && (
                                    <div className="text-sm text-gray-600">
                                        💰 Avg Salary: <span className="font-medium">{node.role.avgSalary}</span>
                                    </div>
                                )}

                                {/* Timeline Estimate */}
                                {level > 0 && (
                                    <div className="mt-2 text-sm text-blue-600">
                                        ⏱️ Estimated time to reach: {level * 1.5}-{level * 2} years
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Render Next Roles */}
                {node.nextRoles && node.nextRoles.length > 0 && (
                    <div className="mt-4">
                        {node.nextRoles.map(nextNode => renderProgressionNode(nextNode, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-blue-50/30">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-black text-white mb-1">🚀 Career Path Visualizer</h1>
                            <p className="text-purple-100">Welcome, {user?.profile?.name}!</p>
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
                    <Link to="/student/dashboard" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold group">
                        <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>

                <div className="mb-8 text-center">
                    <h2 className="text-4xl font-black text-gradient mb-3">Explore Your Career Journey</h2>
                    <p className="text-gray-600 text-lg">
                        Visualize potential career progression paths from your current role to advanced positions.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Role Selection */}
                    <div className="lg:col-span-1">
                        <div className="card sticky top-4">
                            <h3 className="font-semibold mb-4">Select Starting Role</h3>

                            {loading ? (
                                <p className="text-gray-500">Loading roles...</p>
                            ) : roles.length === 0 ? (
                                <p className="text-gray-500">No roles available</p>
                            ) : (
                                <div className="space-y-2">
                                    {roles.map(role => (
                                        <button
                                            key={role._id}
                                            onClick={() => loadCareerPath(role._id)}
                                            className={`w-full text-left p-3 rounded-lg border-2 transition ${selectedRole === role._id
                                                ? 'border-primary-600 bg-primary-50'
                                                : 'border-gray-200 hover:border-primary-300'
                                                }`}
                                        >
                                            <div className="font-medium">{role.title}</div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {role.requiredSkills?.length || 0} skills required
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Career Path Visualization */}
                    <div className="lg:col-span-2">
                        {!careerPath ? (
                            <div className="card text-center py-12">
                                <p className="text-gray-500">
                                    Select a role from the left to visualize career progression paths
                                </p>
                            </div>
                        ) : (
                            <div>
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold">Career Progression Path</h3>
                                    <p className="text-sm text-gray-600">
                                        From {careerPath.role?.title} to advanced roles
                                    </p>
                                </div>

                                {renderProgressionNode(careerPath)}

                                {!careerPath.nextRoles || careerPath.nextRoles.length === 0 && (
                                    <div className="card bg-yellow-50 border-yellow-200">
                                        <p className="text-sm text-yellow-800">
                                            ℹ️ This role currently has no defined progression paths in our system.
                                            Check back later as we add more career data!
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Box */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-bold text-blue-900 mb-2">💡 How Career Paths Work</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Career paths show realistic progression based on skill requirements</li>
                        <li>• Each level typically requires 1.5-2 years of experience</li>
                        <li>• Focus on building skills required for your target role</li>
                        <li>• Use Gap Analysis to see exactly what you need to learn</li>
                        <li>• Salary estimates are based on industry averages</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default CareerPath;
