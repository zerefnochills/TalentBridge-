import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

function Navigator() {
    const { user } = useAuth();
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [guidanceLoading, setGuidanceLoading] = useState(false);

    // Goal form state
    const [targetRole, setTargetRole] = useState('');
    const [timeline, setTimeline] = useState('3 months');
    const [hoursPerWeek, setHoursPerWeek] = useState(10);
    const [constraints, setConstraints] = useState('');
    const [currentLevel, setCurrentLevel] = useState('Beginner');
    const [learningStyle, setLearningStyle] = useState('Video-based');
    const [specificInterests, setSpecificInterests] = useState('');

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
                constraints: constraints.split(',').map(c => c.trim()).filter(Boolean),
                currentLevel,
                learningStyle,
                specificInterests
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
            case 'Foundation': return 'from-accent-blue to-accent-cyan';
            case 'Build': return 'from-accent-purple to-accent-pink';
            case 'Apply': return 'from-success to-accent-teal';
            default: return 'from-gray-400 to-gray-500';
        }
    };

    const getMilestoneStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-success';
            case 'active': return 'bg-warning animate-pulse';
            default: return 'bg-white/20';
        }
    };

    return (
        <div className="container">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-main mb-2">🗺️ Career Navigator</h1>
                <p className="text-text-muted">Your personalized roadmap to success</p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="loading-spinner w-12 h-12"></div>
                </div>
            ) : !roadmap ? (
                /* Goal Setting Form */
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-text-main mb-3">Let's Plan Your Journey</h2>
                        <p className="text-text-muted">Tell us your goal and we'll create a personalized roadmap</p>
                    </div>

                    <form onSubmit={generateRoadmap} className="card">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-text-main mb-2">
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
                                    <label className="block text-sm font-bold text-text-main mb-2">
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
                                    <label className="block text-sm font-bold text-text-main mb-2">
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

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-text-main mb-2">
                                        📊 Current Level
                                    </label>
                                    <select
                                        value={currentLevel}
                                        onChange={(e) => setCurrentLevel(e.target.value)}
                                        className="input-field w-full"
                                    >
                                        <option value="Beginner">Beginner (New to this)</option>
                                        <option value="Intermediate">Intermediate (Some exp)</option>
                                        <option value="Advanced">Advanced (Upskilling)</option>
                                        <option value="Career Pivot">Career Pivot (Transferable skills)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-text-main mb-2">
                                        🧠 Learning Style
                                    </label>
                                    <select
                                        value={learningStyle}
                                        onChange={(e) => setLearningStyle(e.target.value)}
                                        className="input-field w-full"
                                    >
                                        <option value="Video-based">🎥 Video-based (Visual)</option>
                                        <option value="Reading/Docs">📖 Reading/Docs (Text)</option>
                                        <option value="Project-heavy">🛠️ Project-heavy (Hands-on)</option>
                                        <option value="Mentor-guided">👥 Mentor-guided (Social)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-text-main mb-2">
                                    ✨ Specific Interests / Focus (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={specificInterests}
                                    onChange={(e) => setSpecificInterests(e.target.value)}
                                    placeholder="e.g., 'I prefer React over Vue', 'Want to work in Fintech'"
                                    className="input-field w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-text-main mb-2">
                                    ⚠️ Any constraints? (optional)
                                </label>
                                <input
                                    type="text"
                                    value={constraints}
                                    onChange={(e) => setConstraints(e.target.value)}
                                    placeholder="e.g., limited budget, no CS degree, working full-time"
                                    className="input-field w-full"
                                />
                                <p className="text-xs text-text-muted mt-1">Separate multiple constraints with commas</p>
                            </div>

                            <button
                                type="submit"
                                disabled={generating || !targetRole.trim()}
                                className="btn btn-primary w-full py-4 text-lg justify-center disabled:opacity-50"
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

                    <div className="mt-8 card border-primary-500/30 bg-primary-500/10">
                        <div className="flex items-start gap-4">
                            <div className="text-3xl">💡</div>
                            <div>
                                <h4 className="font-bold text-primary-400 mb-2">What makes Navigator different?</h4>
                                <ul className="text-sm text-text-muted space-y-1">
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
                <div>
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-text-main">Your Roadmap to {roadmap.targetRole}</h2>
                            <p className="text-text-muted mt-1">
                                Timeline: {roadmap.timeline} • Created: {new Date(roadmap.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <button
                            onClick={() => setRoadmap(null)}
                            className="btn btn-outline"
                        >
                            📝 Create New Roadmap
                        </button>
                    </div>

                    {/* Skill Gaps Summary */}
                    {roadmap.skillGaps && roadmap.skillGaps.length > 0 && (
                        <div className="card mb-6">
                            <h3 className="font-bold text-primary-400 mb-3">🎯 Your Skill Gaps</h3>
                            <div className="flex flex-wrap gap-2">
                                {roadmap.skillGaps.map((gap, idx) => (
                                    <span key={idx} className="tag tag-priority">
                                        {gap.skill}: {gap.current} → {gap.required}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Phases */}
                    <div className="space-y-6">
                        {roadmap.phases.map((phase, phaseIndex) => (
                            <div key={phaseIndex} className="card overflow-hidden p-0">
                                <div className={`bg-gradient-to-r ${getPhaseGradient(phase.name)} p-6`}>
                                    <div className="flex items-center gap-3">
                                        <span className="text-4xl">{getPhaseIcon(phase.name)}</span>
                                        <div>
                                            <h3 className="text-2xl font-black text-white">Phase {phaseIndex + 1}: {phase.name}</h3>
                                            <p className="text-white/80">{phase.description}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    {phase.milestones.map((milestone, milestoneIndex) => (
                                        <div key={milestoneIndex} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-primary-500/50 transition-colors">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-4 h-4 rounded-full ${getMilestoneStatusColor(milestone.status)}`}></div>
                                                    <h4 className="text-lg font-bold text-text-main">{milestone.title}</h4>
                                                </div>
                                                <div className="flex gap-2">
                                                    {milestone.status !== 'completed' && (
                                                        <button
                                                            onClick={() => updateMilestone(phaseIndex, milestoneIndex, 'completed')}
                                                            className="text-xs px-3 py-1 bg-success/20 text-success rounded-full hover:bg-success/30 transition font-medium"
                                                        >
                                                            ✓ Mark Complete
                                                        </button>
                                                    )}
                                                    {milestone.status !== 'active' && milestone.status !== 'completed' && (
                                                        <button
                                                            onClick={() => updateMilestone(phaseIndex, milestoneIndex, 'active')}
                                                            className="text-xs px-3 py-1 bg-warning/20 text-warning rounded-full hover:bg-warning/30 transition font-medium"
                                                        >
                                                            🎯 Start This
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs font-bold text-text-muted mb-2">📋 Actions:</p>
                                                    <ul className="text-sm text-text-main space-y-1">
                                                        {milestone.actions.map((action, i) => (
                                                            <li key={i} className="flex items-start gap-2">
                                                                <span className="text-primary-400">•</span>
                                                                <span>{action}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-text-muted mb-2">✅ Progress Signals:</p>
                                                    <ul className="text-sm text-text-main space-y-1">
                                                        {milestone.progressSignals.map((signal, i) => (
                                                            <li key={i} className="flex items-start gap-2">
                                                                <span className="text-success">✓</span>
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
                    <div className="card mt-8">
                        <h3 className="text-xl font-bold text-primary-400 mb-4">💬 Quick Guidance</h3>
                        <p className="text-sm text-text-muted mb-4">
                            Ask a question about your next step. Navigator will keep you focused on your roadmap.
                        </p>

                        <form onSubmit={askGuidance} className="flex gap-3">
                            <input
                                type="text"
                                value={guidanceQuestion}
                                onChange={(e) => setGuidanceQuestion(e.target.value)}
                                placeholder="What should I do first? How do I know if I'm ready?"
                                className="input-field flex-1"
                            />
                            <button
                                type="submit"
                                disabled={guidanceLoading || !guidanceQuestion.trim()}
                                className="btn btn-primary px-6 disabled:opacity-50"
                            >
                                {guidanceLoading ? '...' : 'Ask'}
                            </button>
                        </form>

                        {guidance && (
                            <div className="mt-4 bg-success/10 border border-success/30 rounded-xl p-4">
                                <p className="text-sm text-text-main whitespace-pre-wrap">{guidance}</p>
                            </div>
                        )}
                    </div>

                    {/* Raw Plan (collapsible) */}
                    {roadmap.rawPlan && (
                        <details className="mt-6">
                            <summary className="cursor-pointer text-sm text-text-muted hover:text-text-main font-medium">
                                📄 View Full AI-Generated Plan
                            </summary>
                            <div className="mt-3 card">
                                <pre className="text-sm text-text-main whitespace-pre-wrap font-sans">{roadmap.rawPlan}</pre>
                            </div>
                        </details>
                    )}
                </div>
            )}
        </div>
    );
}

export default Navigator;
