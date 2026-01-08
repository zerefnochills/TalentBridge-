import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

function CompanyDashboard() {
    const { user, logout } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-blue-50/30">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-black text-white mb-1">TalentBridge</h1>
                            <p className="text-purple-100">
                                {user?.profile?.companyName || 'Company Dashboard'} 🏢
                            </p>
                        </div>
                        <button onClick={logout} className="btn-secondary bg-white/20 hover:bg-white/30 text-white border-white/30">
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8 py-4">
                        <Link to="/company/dashboard" className="text-primary-600 font-medium border-b-2 border-primary-600 pb-1">
                            Dashboard
                        </Link>
                        <Link to="/company/create-job" className="text-gray-600 hover:text-primary-600">
                            Post Job
                        </Link>
                        <Link to="/company/team-risk" className="text-gray-600 hover:text-primary-600">
                            Team Risk Meter
                        </Link>
                        <Link to="/company/analytics" className="text-gray-600 hover:text-primary-600">
                            Analytics
                        </Link>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slide-up">
                    <div className="card-gradient hover-lift group cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Jobs</h3>
                                <p className="text-4xl font-black text-gradient">{jobs.length}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-purple-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                                <span className="text-3xl">💼</span>
                            </div>
                        </div>
                    </div>
                    <div className="card-gradient hover-lift group cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-600 mb-2">Open Positions</h3>
                                <p className="text-4xl font-black text-green-600">{openJobs.length}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                                <span className="text-3xl">✅</span>
                            </div>
                        </div>
                    </div>
                    <div className="card-gradient hover-lift group cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Applications</h3>
                                <p className="text-4xl font-black text-blue-600">{totalApplications}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                                <span className="text-3xl">📄</span>
                            </div>
                        </div>
                    </div>
                    <div className="card-gradient hover-lift group cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-600 mb-2">Avg Match Rate</h3>
                                <p className="text-4xl font-black text-purple-600">
                                    {analytics?.avgCandidateMatchPercentage || 0}%
                                </p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                                <span className="text-3xl">🎯</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Jobs */}
                    <div className="card">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Your Job Postings</h2>
                            <Link to="/company/create-job" className="btn-primary">
                                Post New Job
                            </Link>
                        </div>

                        {loading ? (
                            <p className="text-gray-500">Loading...</p>
                        ) : jobs.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">No jobs posted yet</p>
                                <Link to="/company/create-job" className="btn-primary">
                                    Create Your First Job
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {jobs.slice(0, 5).map(job => (
                                    <div key={job._id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold">{job.title}</h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {job.requiredSkills?.length || 0} skills required
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {job.applications?.length || 0} applications
                                                </p>
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${job.status === 'open'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {job.status}
                                            </span>
                                        </div>
                                        {job.applications && job.applications.length > 0 && (
                                            <Link
                                                to={`/company/candidates/${job._id}`}
                                                className="mt-3 inline-block text-primary-600 hover:text-primary-700 text-sm font-medium"
                                            >
                                                View {job.applications.length} Candidate(s) →
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-6">
                        <div className="card">
                            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                            <div className="space-y-3">
                                <Link to="/company/create-job" className="btn-primary w-full text-center">
                                    📝 Post New Job
                                </Link>
                                <Link to="/company/team-risk" className="btn-secondary w-full text-center">
                                    ⚠️ Check Team Skill Risks
                                </Link>
                                <Link to="/company/analytics" className="btn-secondary w-full text-center">
                                    📊 View Analytics
                                </Link>
                            </div>
                        </div>

                        {analytics && (
                            <div className="card">
                                <h2 className="text-xl font-bold mb-4">Top Skills in Demand</h2>
                                <div className="space-y-2">
                                    {analytics.topSkillsInDemand?.slice(0, 5).map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center">
                                            <span className="text-sm">{item.skill}</span>
                                            <span className="text-sm font-medium text-gray-600">
                                                {item.jobCount} {item.jobCount === 1 ? 'job' : 'jobs'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-bold text-blue-900 mb-2">
                        💡 Skill-First Hiring with TalentBridge
                    </h3>
                    <p className="text-sm text-blue-800">
                        All candidate rankings are based on transparent, explainable SCI (Skill Confidence Index) scores.
                        No black-box algorithms - every ranking decision is clearly explained to ensure fair hiring practices.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default CompanyDashboard;
