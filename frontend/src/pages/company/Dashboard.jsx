import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

function CompanyDashboard() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [jobsRes, analyticsRes] = await Promise.all([
                api.get('/jobs'),
                api.get('/company/analytics')
            ]);
            setJobs(jobsRes.data.jobs.filter(j => j.companyId._id === user._id));
            setAnalytics(analyticsRes.data.analytics);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const openJobs = jobs.filter(j => j.status === 'open');
    const totalApplications = jobs.reduce((sum, job) => sum + (job.applications?.length || 0), 0);

    return (
        <div className="container">
            {/* Welcome Section */}
            <div className="hero">
                <div className="welcome-msg">
                    <h1>🏢 {user?.profile?.companyName || 'Company Dashboard'}</h1>
                    <p>Manage your job postings and find the best talent with skill-first hiring.</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="card hover:scale-105 transition-transform cursor-pointer">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-text-muted mb-2">Total Jobs</h3>
                            <p className="text-4xl font-black text-gradient">{jobs.length}</p>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-purple rounded-2xl flex items-center justify-center">
                            <span className="text-3xl">💼</span>
                        </div>
                    </div>
                </div>

                <div className="card hover:scale-105 transition-transform cursor-pointer">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-text-muted mb-2">Open Positions</h3>
                            <p className="text-4xl font-black text-success">{openJobs.length}</p>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-success to-accent-teal rounded-2xl flex items-center justify-center">
                            <span className="text-3xl">✅</span>
                        </div>
                    </div>
                </div>

                <div className="card hover:scale-105 transition-transform cursor-pointer">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-text-muted mb-2">Total Applications</h3>
                            <p className="text-4xl font-black text-primary-400">{totalApplications}</p>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-accent-blue to-accent-cyan rounded-2xl flex items-center justify-center">
                            <span className="text-3xl">📄</span>
                        </div>
                    </div>
                </div>

                <div className="card hover:scale-105 transition-transform cursor-pointer">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-text-muted mb-2">Avg Match Rate</h3>
                            <p className="text-4xl font-black text-accent-purple">
                                {analytics?.avgCandidateMatchPercentage || 0}%
                            </p>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-accent-purple to-accent-pink rounded-2xl flex items-center justify-center">
                            <span className="text-3xl">🎯</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Jobs */}
                <div className="card">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-text-main">Your Job Postings</h2>
                        <Link to="/company/create-job" className="btn btn-primary text-sm">
                            Post New Job
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="loading-spinner"></div>
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="empty-state">
                            <div className="text-5xl mb-4">📝</div>
                            <p className="text-text-muted mb-4">No jobs posted yet</p>
                            <Link to="/company/create-job" className="btn btn-primary">
                                Create Your First Job
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {jobs.slice(0, 5).map(job => (
                                <div key={job._id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-text-main">{job.title}</h3>
                                            <p className="text-sm text-text-muted mt-1">
                                                {job.requiredSkills?.length || 0} skills required
                                            </p>
                                            <p className="text-sm text-text-muted">
                                                {job.applications?.length || 0} applications
                                            </p>
                                        </div>
                                        <span className={`badge ${job.status === 'open' ? 'badge-success' : 'badge-primary'
                                            }`}>
                                            {job.status}
                                        </span>
                                    </div>
                                    {job.applications && job.applications.length > 0 && (
                                        <Link
                                            to={`/company/candidates/${job._id}`}
                                            className="mt-3 inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm font-medium"
                                        >
                                            View {job.applications.length} Candidate(s) →
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions & Analytics */}
                <div className="space-y-6">
                    <div className="card">
                        <h2 className="text-xl font-bold text-text-main mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <Link to="/company/create-job" className="btn btn-primary w-full justify-center">
                                📝 Post New Job
                            </Link>
                            <Link to="/company/team-risk" className="btn btn-outline w-full justify-center">
                                ⚠️ Check Team Skill Risks
                            </Link>
                            <Link to="/company/analytics" className="btn btn-outline w-full justify-center">
                                📊 View Analytics
                            </Link>
                        </div>
                    </div>

                    {analytics && (
                        <div className="card">
                            <h2 className="text-xl font-bold text-text-main mb-4">Top Skills in Demand</h2>
                            <div className="space-y-3">
                                {analytics.topSkillsInDemand?.slice(0, 5).map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                                        <span className="text-sm text-text-main">{item.skill}</span>
                                        <span className="badge badge-primary">
                                            {item.jobCount} {item.jobCount === 1 ? 'job' : 'jobs'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Info Box */}
            <div className="mt-8 card border-primary-500/30 bg-primary-500/10">
                <div className="flex items-start gap-4">
                    <div className="text-3xl">💡</div>
                    <div>
                        <h3 className="font-bold text-primary-400 mb-2">Skill-First Hiring with TalentBridge</h3>
                        <p className="text-sm text-text-muted">
                            All candidate rankings are based on transparent, explainable SCI (Skill Confidence Index) scores.
                            No black-box algorithms - every ranking decision is clearly explained to ensure fair hiring practices.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompanyDashboard;
