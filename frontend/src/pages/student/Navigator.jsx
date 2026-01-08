import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

function Navigator() {
    const { user, logout } = useAuth();
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [guidanceLoading, setGuidanceLoading] = useState(false);

    // Goal form state
    const [targetRole, setTargetRole] = useState('');
    const [timeline, setTimeline] = useState('3 months');
    const [hoursPerWeek, setHoursPerWeek] = useState(10);
    const [constraints, setConstraints] = useState('');

    // Guidance state
    const [guidanceQuestion, setGuidanceQuestion] = useState('');
    const [guidance, setGuidance] = useState('');

    useEffect(() => {
        loadExistingRoadmap();
    }, []);

    const loadExistingRoadmap = async () => {
        setLoading(true);
        try {
            const res = await api.get('/navigator/roadmap');
            setRoadmap(res.data.roadmap);
        } catch (error) {
            // No roadmap exists yet - that's okay
            console.log('No existing roadmap');
        } finally {
            setLoading(false);
        }
    };

    const generateRoadmap = async (e) => {
        e.preventDefault();
        if (!targetRole.trim()) return;

        setGenerating(true);
        try {
            const res = await api.post('/navigator/generate', {
                targetRole,
                timeline,
                hoursPerWeek,
                constraints: constraints.split(',').map(c => c.trim()).filter(Boolean)
            });
            setRoadmap(res.data.roadmap);
        } catch (error) {
            console.error('Error generating roadmap:', error);
            alert('Failed to generate roadmap. Please try again.');
        } finally {
            setGenerating(false);
        }
    };

    const askGuidance = async (e) => {
        e.preventDefault();
        if (!guidanceQuestion.trim()) return;

        setGuidanceLoading(true);
        try {
            const res = await api.post('/navigator/guidance', {
                question: guidanceQuestion
            });
            setGuidance(res.data.guidance);
            setGuidanceQuestion('');
        } catch (error) {
            console.error('Error getting guidance:', error);
            setGuidance('Unable to get guidance right now. Focus on your current milestone.');
        } finally {
            setGuidanceLoading(false);
        }
    };

    const updateMilestone = async (phaseIndex, milestoneIndex, status) => {
        try {
            const res = await api.post('/navigator/update-milestone', {
                phaseIndex,
                milestoneIndex,
                status
            });
            setRoadmap(res.data.roadmap);
        } catch (error) {
            console.error('Error updating milestone:', error);
        }
    };

    const getPhaseIcon = (phaseName) => {
        switch (phaseName) {
            case 'Foundation': return '🏗️';
            case 'Build': return '🔨';
            case 'Apply': return '🚀';
            default: return '📍';
        }
    };

    const getPhaseGradient = (phaseName) => {
        switch (phaseName) {
            case 'Foundation': return 'from-blue-400 to-cyan-500';
            case 'Build': return 'from-purple-400 to-pink-500';
            case 'Apply': return 'from-green-400 to-emerald-500';
            default: return 'from-gray-400 to-gray-500';
        }
    };

    const getMilestoneStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-500';
            case 'active': return 'bg-yellow-500 animate-pulse';
            default: return 'bg-gray-300';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-blue-50/30">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-black text-white mb-1">🗺️ Career Navigator</h1>
                            <p className="text-purple-100">Your personalized roadmap to success</p>
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

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="loading-spinner w-12 h-12"></div>
                    </div>
                ) : !roadmap ? (
                    /* Goal Setting Form */
                    <div className="max-w-2xl mx-auto animate-slide-up">
                        <div className="text-center mb-8">
                            <h2 className="text-4xl font-black text-gradient mb-3">Let's Plan Your Journey</h2>
                            <p className="text-gray-600 text-lg">Tell us your goal and we'll create a personalized roadmap</p>
                        </div>

                        <form onSubmit={generateRoadmap} className="card-glass">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        🎯 What role are you aiming for?
                                    </label>
                                    <input
                                        type="text"
                                        value={targetRole}
                                        onChange={(e) => setTargetRole(e.target.value)}
                                        placeholder="e.g., Frontend Developer, Data Scientist, Product Manager"
                                        className="input-field w-full"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            ⏱️ Timeline
                                        </label>
                                        <select
                                            value={timeline}
                                            onChange={(e) => setTimeline(e.target.value)}
                                            className="input-field w-full"
                                        >
                                            <option value="1 month">1 month (intensive)</option>
                                            <option value="3 months">3 months (balanced)</option>
                                            <option value="6 months">6 months (flexible)</option>
                                            <option value="12 months">12 months (part-time)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            📅 Hours per week
                                        </label>
                                        <select
                                            value={hoursPerWeek}
                                            onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
                                            className="input-field w-full"
                                        >
                                            <option value={5}>5 hours</option>
                                            <option value={10}>10 hours</option>
                                            <option value={20}>20 hours</option>
                                            <option value={40}>40 hours (full-time)</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        ⚠️ Any constraints? (optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={constraints}
                                        onChange={(e) => setConstraints(e.target.value)}
                                        placeholder="e.g., limited budget, no CS degree, working full-time"
                                        className="input-field w-full"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Separate multiple constraints with commas</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={generating || !targetRole.trim()}
                                    className="btn-primary w-full py-4 text-lg disabled:opacity-50"
                                >
                                    {generating ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="loading-spinner w-5 h-5 border-2"></div>
                                            Generating Your Roadmap...
                                        </span>
                                    ) : (
                                        '🚀 Generate My Roadmap'
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xl">💡</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-blue-900 mb-2">What makes Navigator different?</h4>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>• <strong>Action-focused:</strong> "What to do next" not "how to learn"</li>
                                        <li>• <strong>Milestone-based:</strong> Clear phases, not endless lessons</li>
                                        <li>• <strong>Adaptive:</strong> Changes when your situation changes</li>
                                        <li>• <strong>Practical:</strong> Projects and exposure, not just courses</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Roadmap Display */
                    <div className="animate-slide-up">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-3xl font-black text-gradient">Your Roadmap to {roadmap.targetRole}</h2>
                                <p className="text-gray-600 mt-1">
                                    Timeline: {roadmap.timeline} • Created: {new Date(roadmap.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <button
                                onClick={() => setRoadmap(null)}
                                className="btn-secondary"
                            >
                                📝 Create New Roadmap
                            </button>
                        </div>

                        {/* Skill Gaps Summary */}
                        {roadmap.skillGaps && roadmap.skillGaps.length > 0 && (
                            <div className="card-glass mb-6">
                                <h3 className="font-bold text-gradient mb-3">🎯 Your Skill Gaps</h3>
                                <div className="flex flex-wrap gap-2">
                                    {roadmap.skillGaps.map((gap, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-gradient-to-r from-red-100 to-orange-100 text-red-800 rounded-full text-sm font-medium border border-red-200">
                                            {gap.skill}: {gap.current} → {gap.required}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Phases */}
                        <div className="space-y-6">
                            {roadmap.phases.map((phase, phaseIndex) => (
                                <div key={phaseIndex} className="card-glass overflow-hidden">
                                    <div className={`bg-gradient-to-r ${getPhaseGradient(phase.name)} -m-6 mb-4 p-6`}>
                                        <div className="flex items-center gap-3">
                                            <span className="text-4xl">{getPhaseIcon(phase.name)}</span>
                                            <div>
                                                <h3 className="text-2xl font-black text-white">Phase {phaseIndex + 1}: {phase.name}</h3>
                                                <p className="text-white/80">{phase.description}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mt-4">
                                        {phase.milestones.map((milestone, milestoneIndex) => (
                                            <div key={milestoneIndex} className="border-2 border-gray-200 rounded-xl p-5 hover:border-primary-300 transition-colors">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-4 h-4 rounded-full ${getMilestoneStatusColor(milestone.status)}`}></div>
                                                        <h4 className="text-lg font-bold text-gray-800">{milestone.title}</h4>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {milestone.status !== 'completed' && (
                                                            <button
                                                                onClick={() => updateMilestone(phaseIndex, milestoneIndex, 'completed')}
                                                                className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition font-medium"
                                                            >
                                                                ✓ Mark Complete
                                                            </button>
                                                        )}
                                                        {milestone.status !== 'active' && milestone.status !== 'completed' && (
                                                            <button
                                                                onClick={() => updateMilestone(phaseIndex, milestoneIndex, 'active')}
                                                                className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition font-medium"
                                                            >
                                                                🎯 Start This
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-600 mb-2">📋 Actions:</p>
                                                        <ul className="text-sm text-gray-700 space-y-1">
                                                            {milestone.actions.map((action, i) => (
                                                                <li key={i} className="flex items-start gap-2">
                                                                    <span className="text-primary-500">•</span>
                                                                    <span>{action}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-600 mb-2">✅ Progress Signals:</p>
                                                        <ul className="text-sm text-gray-700 space-y-1">
                                                            {milestone.progressSignals.map((signal, i) => (
                                                                <li key={i} className="flex items-start gap-2">
                                                                    <span className="text-green-500">✓</span>
                                                                    <span>{signal}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Guidance Section */}
                        <div className="card-glass mt-8">
                            <h3 className="text-xl font-bold text-gradient mb-4">💬 Quick Guidance</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Ask a question about your next step. Navigator will keep you focused on your roadmap.
                            </p>

                            <form onSubmit={askGuidance} className="flex gap-3">
                                <input
                                    type="text"
                                    value={guidanceQuestion}
                                    onChange={(e) => setGuidanceQuestion(e.target.value)}
                                    placeholder="What should I do first? How do I know if I'm ready for the next phase?"
                                    className="input-field flex-1"
                                />
                                <button
                                    type="submit"
                                    disabled={guidanceLoading || !guidanceQuestion.trim()}
                                    className="btn-primary px-6 disabled:opacity-50"
                                >
                                    {guidanceLoading ? '...' : 'Ask'}
                                </button>
                            </form>

                            {guidance && (
                                <div className="mt-4 bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200 rounded-xl p-4">
                                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{guidance}</p>
                                </div>
                            )}
                        </div>

                        {/* Raw Plan (collapsible) */}
                        {roadmap.rawPlan && (
                            <details className="mt-6">
                                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 font-medium">
                                    📄 View Full AI-Generated Plan
                                </summary>
                                <div className="mt-3 card-glass">
                                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{roadmap.rawPlan}</pre>
                                </div>
                            </details>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navigator;
