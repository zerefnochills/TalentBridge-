import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import SCIGauge from '../../components/SCIGauge';
import FeatureCard from '../../components/FeatureCard';

function StudentDashboard() {
    const { user } = useAuth();
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);

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
        if (sci >= 80) return 'text-success';
        if (sci >= 60) return 'text-primary-400';
        if (sci >= 40) return 'text-warning';
        return 'text-danger';
    };

    const needsReassessment = (skill) => {
        return skill.freshnessScore < 50 || skill.sci < 40;
    };

    const skillsNeedingAttention = skills.filter(s => needsReassessment(s));
    const avgSCI = skills.length > 0
        ? Math.round(skills.reduce((sum, s) => sum + (s.sci || 0), 0) / skills.length)
        : 0;

    // Calculate readiness percentage
    const readinessPercent = avgSCI;

    return (
        <div className="container">
            {/* Hero Section */}
            <div className="hero">
                <div className="welcome-msg">
                    <h1>Welcome back, {user?.profile?.name || 'Student'}</h1>
                    <p>Your current skill readiness for Software Roles: {readinessPercent}%</p>
                </div>

                {/* Readiness Progress */}
                <div className="readiness-box">
                    <div className="progress-info">
                        <span>Overall Readiness</span>
                        <span>{readinessPercent}%</span>
                    </div>
                    <div className="progress-track">
                        <div
                            className="progress-fill"
                            style={{ width: `${readinessPercent}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Dashboard Grid */}
            <div className="dashboard-grid">
                {/* SCI Card - Spans 7 columns */}
                <div className="card col-span-12 lg:col-span-7">
                    <h2 className="text-xl font-bold text-text-main mb-6">Skill Confidence Index</h2>

                    <div className="flex flex-col lg:flex-row items-center gap-8">
                        {/* Gauge */}
                        <SCIGauge score={avgSCI} label="Overall SCI" />

                        {/* Stats */}
                        <div className="flex-1 w-full space-y-4">
                            <div className="flex justify-between border-b border-white/10 pb-2">
                                <span className="text-text-muted text-sm">Total Skills</span>
                                <span className="font-semibold text-text-main">{skills.length}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/10 pb-2">
                                <span className="text-text-muted text-sm">Needs Attention</span>
                                <span className="font-semibold text-danger">{skillsNeedingAttention.length}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/10 pb-2">
                                <span className="text-text-muted text-sm">Avg Freshness</span>
                                <span className="font-semibold text-success">
                                    {skills.length > 0
                                        ? Math.round(skills.reduce((sum, s) => sum + (s.freshnessScore || 0), 0) / skills.length)
                                        : 0}%
                                </span>
                            </div>
                            <Link to="/student/skills" className="btn btn-primary w-full justify-center mt-4">
                                View Details
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Feature Cards - Spans 5 columns */}
                <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-4">
                    <FeatureCard
                        icon="AI"
                        title="AI Tutor"
                        description="Get personalized learning recommendations"
                        linkTo="/student/ai-tutor"
                        buttonText="Start Learning"
                    />
                    <FeatureCard
                        icon="MAP"
                        title="Roadmap"
                        description="Follow a step-by-step learning path"
                        linkTo="/student/roadmap"
                        buttonText="View Roadmap"
                    />
                    <FeatureCard
                        icon="PATH"
                        title="Career Path"
                        description="Plan and visualize your career progress"
                        linkTo="/student/career"
                        buttonText="Explore"
                    />
                    <FeatureCard
                        icon="JOBS"
                        title="Find Jobs"
                        description="Discover jobs matching your skills"
                        linkTo="/student/jobs"
                        buttonText="Browse"
                    />
                </div>

                {/* Gap Analysis - Full Width */}
                <div className="card col-span-12 flex flex-col lg:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="text-3xl font-black text-primary-400">GAP</div>
                        <div>
                            <h2 className="text-xl font-bold text-text-main mb-2">Skill Gap Analysis</h2>
                            <p className="text-text-muted text-sm mb-3">Identify and address missing key skills</p>
                            <div className="flex flex-wrap gap-2">
                                {skillsNeedingAttention.slice(0, 3).map(skill => (
                                    <span key={skill._id} className="tag tag-priority">
                                        {skill.skillId?.name}
                                    </span>
                                ))}
                                {skillsNeedingAttention.length === 0 && (
                                    <span className="tag">No gaps detected</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <Link to="/student/gap-analysis" className="btn btn-primary">
                        Run Analysis
                    </Link>
                </div>

                {/* Skill Freshness - Full Width */}
                <div className="card col-span-12 flex flex-col lg:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6 flex-1">
                        <div className="text-3xl font-black text-primary-400">FRESH</div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-text-main mb-2">Skill Freshness & Decay</h2>
                            <p className="text-text-muted text-sm mb-4">Skills decay when not practiced regularly</p>

                            {/* Freshness Bars */}
                            {loading ? (
                                <div className="loading-spinner"></div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <span className="text-xs text-text-muted block mb-2">Recently Used</span>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill-success"
                                                style={{
                                                    width: `${skills.filter(s => s.freshnessScore >= 70).length / Math.max(skills.length, 1) * 100}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs text-text-muted block mb-2">Needs Practice</span>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill-warning"
                                                style={{
                                                    width: `${skills.filter(s => s.freshnessScore >= 40 && s.freshnessScore < 70).length / Math.max(skills.length, 1) * 100}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs text-text-muted block mb-2">Outdated</span>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill-danger"
                                                style={{
                                                    width: `${skills.filter(s => s.freshnessScore < 40).length / Math.max(skills.length, 1) * 100}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <Link to="/student/skills" className="btn btn-outline">
                        Take Refresh Quiz
                    </Link>
                </div>

                {/* Skills List - Full Width */}
                <div className="card col-span-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-text-main">Your Skills</h2>
                        <Link to="/student/skills" className="btn btn-outline text-sm">
                            Manage Skills
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="loading-spinner"></div>
                        </div>
                    ) : skills.length === 0 ? (
                        <div className="empty-state">
                            <div className="text-4xl font-black text-text-muted mb-4">+</div>
                            <p className="text-text-muted mb-4">No skills added yet</p>
                            <Link to="/student/skills" className="btn btn-primary">
                                Add Your First Skill
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {skills.slice(0, 6).map((skill) => (
                                <div key={skill._id} className="skill-card">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-text-main">{skill.skillId?.name || 'Unknown Skill'}</h3>
                                            <span className="text-xs text-text-muted">{skill.category}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-3xl font-black ${getSCIColor(skill.sci)}`}>
                                                {Math.round(skill.sci)}
                                            </span>
                                            <p className="text-xs text-text-muted font-semibold">SCI</p>
                                        </div>
                                    </div>

                                    {/* Freshness bar */}
                                    <div className="mt-3">
                                        <div className="flex justify-between text-xs text-text-muted mb-1">
                                            <span>Freshness</span>
                                            <span>{Math.round(skill.freshnessScore || 0)}%</span>
                                        </div>
                                        <div className="progress-bar h-1.5">
                                            <div
                                                className={`h-full rounded-full ${skill.freshnessScore >= 70 ? 'bg-success' :
                                                    skill.freshnessScore >= 40 ? 'bg-warning' : 'bg-danger'
                                                    }`}
                                                style={{ width: `${skill.freshnessScore || 0}%` }}
                                            />
                                        </div>
                                    </div>

                                    {needsReassessment(skill) && skill.skillId?._id && (
                                        <Link
                                            to={`/student/assessment/${skill.skillId._id}`}
                                            className="mt-3 inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 font-semibold"
                                        >
                                            <span>Take Assessment</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {skills.length > 6 && (
                        <Link to="/student/skills" className="block text-center text-primary-400 hover:text-primary-300 font-semibold pt-6">
                            View all {skills.length} skills →
                        </Link>
                    )}
                </div>

                {/* SCI Info Box */}
                <div className="card col-span-12">
                    <div className="flex items-start gap-4">
                        <div className="text-3xl font-black text-primary-400">i</div>
                        <div>
                            <h3 className="font-bold text-text-main mb-2">About Skill Confidence Index (SCI)</h3>
                            <p className="text-sm text-text-muted mb-4">
                                SCI is a transparent, rule-based score measuring your skill confidence:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <p className="font-bold text-primary-400 mb-1">Assessment 40%</p>
                                    <p className="text-text-muted text-xs">Your test performance</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <p className="font-bold text-primary-400 mb-1">Freshness 35%</p>
                                    <p className="text-text-muted text-xs">How recently used</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <p className="font-bold text-primary-400 mb-1">Scenario 25%</p>
                                    <p className="text-text-muted text-xs">Real-world solving</p>
                                </div>
                            </div>
                            <p className="text-xs text-primary-400 mt-4 font-semibold">
                                Take assessments regularly to keep your SCI up to date!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard;
