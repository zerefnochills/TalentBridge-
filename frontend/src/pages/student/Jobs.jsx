import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import MatchPercentageBadge from '../../components/MatchPercentageBadge';

function Jobs() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        try {
            const res = await api.get('/jobs');
            setJobs(res.data.jobs);
        } catch (error) {
            console.error('Error loading jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const getFilteredJobs = () => {
        switch (filter) {
            case 'ready':
                return jobs.filter(job => job.matchPercentage >= 80);
            case 'good':
                return jobs.filter(job => job.matchPercentage >= 60 && job.matchPercentage < 80);
            case 'notReady':
                return jobs.filter(job => job.matchPercentage < 60);
            default:
                return jobs;
        }
    };

    const filteredJobs = getFilteredJobs();

    return (
        <div className="container">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-main mb-2">💼 Find Your Dream Job</h1>
                <p className="text-text-muted">
                    All jobs show your skill match percentage. Apply only where you're ready!
                </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${filter === 'all'
                        ? 'bg-primary-500 text-white shadow-lg'
                        : 'bg-white/5 text-text-muted border border-white/10 hover:border-primary-500/50'
                        }`}
                >
                    All Jobs ({jobs.length})
                </button>
                <button
                    onClick={() => setFilter('ready')}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${filter === 'ready'
                        ? 'bg-success text-white shadow-lg'
                        : 'bg-white/5 text-text-muted border border-white/10 hover:border-success/50'
                        }`}
                >
                    Ready to Apply (≥80%)
                </button>
                <button
                    onClick={() => setFilter('good')}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${filter === 'good'
                        ? 'bg-warning text-dark-main shadow-lg'
                        : 'bg-white/5 text-text-muted border border-white/10 hover:border-warning/50'
                        }`}
                >
                    Good Match (60-79%)
                </button>
                <button
                    onClick={() => setFilter('notReady')}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${filter === 'notReady'
                        ? 'bg-danger text-white shadow-lg'
                        : 'bg-white/5 text-text-muted border border-white/10 hover:border-danger/50'
                        }`}
                >
                    Build Skills (&lt;60%)
                </button>
            </div>

            {/* Jobs List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="loading-spinner"></div>
                </div>
            ) : filteredJobs.length === 0 ? (
                <div className="card text-center py-12">
                    <div className="text-5xl mb-4">🔍</div>
                    <p className="text-text-muted">
                        {filter === 'all'
                            ? 'No jobs available at the moment'
                            : `No jobs in this category. Try a different filter.`}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredJobs.map(job => (
                        <div key={job._id} className="card hover:scale-[1.02] transition-transform">
                            <div className="flex gap-6">
                                {/* Match Badge */}
                                <div className="flex-shrink-0">
                                    <MatchPercentageBadge
                                        percentage={job.matchPercentage}
                                        size="large"
                                        showLabel={false}
                                    />
                                </div>

                                {/* Job Info */}
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-text-main mb-1">{job.title}</h3>
                                    <p className="text-sm text-text-muted mb-2">
                                        {job.companyId?.profile?.companyName || 'Company'}
                                        {job.companyId?.profile?.industry &&
                                            ` • ${job.companyId.profile.industry}`}
                                    </p>
                                    <p className="text-sm text-text-muted mb-3 line-clamp-2">
                                        {job.description}
                                    </p>

                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-sm text-text-muted">
                                            {job.requiredSkills?.length || 0} skills required
                                        </span>
                                        {job.applications?.length > 0 && (
                                            <>
                                                <span className="text-text-muted">•</span>
                                                <span className="text-sm text-text-muted">
                                                    {job.applications.length} applicants
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {/* Action Button */}
                                    <Link
                                        to={`/student/jobs/${job._id}`}
                                        className={`btn text-sm ${job.matchPercentage >= 80
                                            ? 'btn-primary'
                                            : job.matchPercentage >= 60
                                                ? 'bg-warning text-dark-main hover:bg-warning/80'
                                                : 'btn-outline'
                                            }`}
                                    >
                                        {job.matchPercentage >= 80
                                            ? '✓ View & Apply'
                                            : job.matchPercentage >= 60
                                                ? 'View Details'
                                                : 'See What\'s Needed'}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Info Section */}
            <div className="mt-8 card border-primary-500/30 bg-primary-500/10">
                <div className="flex items-start gap-4">
                    <div className="text-3xl">💡</div>
                    <div>
                        <h3 className="font-bold text-primary-400 mb-2">How Job Matching Works</h3>
                        <ul className="text-sm text-text-muted space-y-1">
                            <li>• Match % is calculated from your verified SCI scores across required skills</li>
                            <li>• Each skill has an importance weight set by the company (1-5 stars)</li>
                            <li>• Higher importance skills count more toward your match percentage</li>
                            <li>• 80%+ match = Ready to apply confidently</li>
                            <li>• Below 80%? Build those skills and come back stronger!</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Jobs;
