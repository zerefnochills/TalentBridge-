import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

function CareerPath() {
    const { user } = useAuth();
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
        if (!node || !node.role) return null;

        const isCurrentRole = level === 0;

        return (
            <div key={node.role._id || `node-${level}`} className="mb-8">
                <div className={`relative ${level > 0 ? 'ml-12' : ''}`}>
                    {/* Connection Line */}
                    {level > 0 && (
                        <div className="absolute left-0 top-0 w-8 h-1/2 border-l-2 border-b-2 border-white/20 rounded-bl-lg"
                            style={{ marginLeft: '-48px' }} />
                    )}

                    {/* Role Card */}
                    <div className={`bg-white/5 border rounded-xl p-5 ${isCurrentRole ? 'border-primary-500 bg-primary-500/10' : 'border-white/10'}`}>
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg font-bold text-text-main">{node.role.title}</h3>
                                    {isCurrentRole && (
                                        <span className="badge badge-primary">
                                            Starting Point
                                        </span>
                                    )}
                                    {level > 0 && (
                                        <span className="badge badge-info">
                                            Level {level}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-text-muted mb-3">{node.role.description || 'No description available'}</p>

                                {/* Skills Required */}
                                {node.role.requiredSkills && node.role.requiredSkills.length > 0 && (
                                    <div className="mb-3">
                                        <h4 className="text-xs font-semibold text-text-muted mb-2">Required Skills:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {node.role.requiredSkills.slice(0, 5).map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="tag"
                                                >
                                                    {skill.skillId?.name || 'Unknown'} (SCI {skill.minimumSCI}+)
                                                </span>
                                            ))}
                                            {node.role.requiredSkills.length > 5 && (
                                                <span className="text-xs text-text-muted">
                                                    +{node.role.requiredSkills.length - 5} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Average Salary */}
                                {node.role.avgSalary && (
                                    <div className="text-sm text-text-muted">
                                        Avg Salary: <span className="font-medium text-text-main">{node.role.avgSalary}</span>
                                    </div>
                                )}

                                {/* Work Environment */}
                                {node.role.workEnvironment && (
                                    <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
                                        <h4 className="text-xs font-semibold text-primary-400 mb-1">Work Environment</h4>
                                        <p className="text-sm text-text-muted">{node.role.workEnvironment}</p>
                                    </div>
                                )}

                                {/* Key Competencies */}
                                {node.role.keyCompetencies && node.role.keyCompetencies.length > 0 && (
                                    <div className="mt-3">
                                        <h4 className="text-xs font-semibold text-text-muted mb-2">Key Competencies</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {node.role.keyCompetencies.map((comp, idx) => (
                                                <span key={idx} className="px-2 py-1 text-xs bg-primary-500/20 text-primary-300 rounded-lg">
                                                    {comp}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Learning Resources */}
                                {node.role.learningResources && node.role.learningResources.length > 0 && (
                                    <div className="mt-3">
                                        <h4 className="text-xs font-semibold text-text-muted mb-2">Learning Resources</h4>
                                        <ul className="space-y-1">
                                            {node.role.learningResources.map((res, idx) => (
                                                <li key={idx} className="text-sm">
                                                    <a
                                                        href={res.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary-400 hover:underline"
                                                    >
                                                        {res.title}
                                                    </a>
                                                    <span className="ml-2 text-xs text-text-muted capitalize">({res.type})</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Timeline Estimate */}
                                {level > 0 && (
                                    <div className="mt-2 text-sm text-primary-400">
                                        Estimated time to reach: {level * 1.5}-{level * 2} years
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
        <div className="container">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-main mb-2">🚀 Career Path Visualizer</h1>
                <p className="text-text-muted">
                    Visualize potential career progression paths from your current role to advanced positions.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Role Selection */}
                <div className="lg:col-span-1">
                    <div className="card sticky top-4">
                        <h3 className="font-semibold text-text-main mb-4">Select Starting Role</h3>

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
                                        onClick={() => loadCareerPath(role._id)}
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

                {/* Career Path Visualization */}
                <div className="lg:col-span-2">
                    {!careerPath ? (
                        <div className="card text-center py-12">
                            <div className="text-5xl mb-4">🛤️</div>
                            <p className="text-text-muted">
                                Select a role from the left to visualize career progression paths
                            </p>
                        </div>
                    ) : (
                        <div>
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-text-main">Career Progression Path</h3>
                                <p className="text-sm text-text-muted">
                                    From {careerPath.role?.title} to advanced roles
                                </p>
                            </div>

                            {renderProgressionNode(careerPath)}

                            {(!careerPath.nextRoles || careerPath.nextRoles.length === 0) && (
                                <div className="card border-warning/30 bg-warning/10">
                                    <p className="text-sm text-text-main">
                                        This role currently has no defined progression paths in our system.
                                        Check back later as we add more career data!
                                    </p>
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
                        <h3 className="font-bold text-primary-400 mb-2">How Career Paths Work</h3>
                        <ul className="text-sm text-text-muted space-y-1">
                            <li>• Career paths show realistic progression based on skill requirements</li>
                            <li>• Each level typically requires 1.5-2 years of experience</li>
                            <li>• Focus on building skills required for your target role</li>
                            <li>• Use Gap Analysis to see exactly what you need to learn</li>
                            <li>• Salary estimates are based on industry averages</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CareerPath;
