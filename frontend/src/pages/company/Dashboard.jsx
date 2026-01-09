import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

function CompanyDashboard() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        try {
            const res = await api.get('/jobs/company');
            setJobs(res.data.jobs || []);
        } catch (error) {
            console.error('Error loading jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const activeJobs = jobs.filter(job => job.status === 'active');
    const totalApplications = jobs.reduce((sum, job) => sum + (job.applicantCount || 0), 0);
    const avgMatch = jobs.length > 0
        ? Math.round(jobs.reduce((sum, job) => sum + (job.avgMatchPercentage || 0), 0) / jobs.length)
        : 0;

    return (
        <div className="container">
            {/* Welcome Section */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center">
                        <span className="text-white font-black text-lg">CO</span>
                    </div>
                    <h1>{user?.profile?.companyName || 'Company Dashboard'}</h1>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary-500/20 flex items-center justify-center">
                        <span className="text-2xl font-black text-primary-400">J</span>
                    </div>
                    <div>
                        <p className="text-text-muted text-sm">Active Jobs</p>
                        <p className="text-3xl font-black text-text-main">{activeJobs.length}</p>
                    </div>
                </div>

                <div className="card flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-success/20 flex items-center justify-center">
                        <span className="text-2xl font-black text-success">A</span>
                    </div>
                    <div>
                        <p className="text-text-muted text-sm">Total Applications</p>
                        <p className="text-3xl font-black text-text-main">{totalApplications}</p>
                    </div>
                </div>

                <div className="card flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-accent-purple/20 flex items-center justify-center">
                        <span className="text-2xl font-black text-accent-purple">%</span>
                    </div>
                    <div>
                        <p className="text-text-muted text-sm">Avg. Match Quality</p>
                        <p className="text-3xl font-black text-text-main">{avgMatch}%</p>
                    </div>
                </div>
            </div>

            {/* Jobs Section */}
            <div className="card mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-text-main">Job Postings</h2>
                    <Link to="/company/create-job" className="btn btn-primary">
                        + Post New Job
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="loading-spinner mx-auto"></div>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-4xl font-black text-text-muted mb-4">+</div>
                        <p className="text-text-muted mb-4">No jobs posted yet</p>
                        <Link to="/company/create-job" className="btn btn-primary">
                            Post Your First Job
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {jobs.map(job => (
                            <div key={job._id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg text-text-main">{job.title}</h3>
                                        <p className="text-sm text-text-muted">
                                            {job.applicantCount || 0} applicants
                                            {job.avgMatchPercentage && ` | ${job.avgMatchPercentage}% avg match`}
                                        </p>
                                    </div>
                                    <Link
                                        to={`/company/job/${job._id}/candidates`}
                                        className="btn btn-outline text-sm"
                                    >
                                        View Candidates
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="card mb-8">
                <h2 className="text-xl font-bold text-text-main mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link to="/company/create-job" className="btn btn-outline justify-center py-3">
                        Post New Job
                    </Link>
                    <Link to="/company/team-risk" className="btn btn-outline justify-center py-3">
                        Check Team Skill Risks
                    </Link>
                    <Link to="/company/analytics" className="btn btn-outline justify-center py-3">
                        View Analytics
                    </Link>
                </div>
            </div>

            {/* Info Box */}
            <div className="card border-primary-500/30 bg-primary-500/10">
                <div className="flex items-start gap-4">
                    <div className="text-2xl font-black text-primary-400">i</div>
                    <div>
                        <h3 className="font-bold text-primary-400 mb-2">About Skill-First Hiring</h3>
                        <p className="text-sm text-text-muted mb-3">
                            TalentBridge uses transparent, rule-based matching:
                        </p>
                        <ul className="text-sm text-text-muted space-y-1">
                            <li>All candidates are ranked by verified SCI scores</li>
                            <li>Match percentages are calculated from weighted skill requirements</li>
                            <li>Every ranking decision is explainable</li>
                            <li>No hidden algorithms or bias</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompanyDashboard;
