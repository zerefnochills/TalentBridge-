import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import MatchPercentageBadge from '../../components/MatchPercentageBadge';

function Jobs() {
    const { user, logout } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, ready, good, notReady
    const navigate = useNavigate();

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        try {
            const res = await api.get('/jobs');
            // Jobs already include matchPercentage for students
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

            {/* Navigation */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8 py-4">
                        <Link to="/student/dashboard" className="text-gray-600 hover:text-primary-600">
                            Dashboard
                        </Link>
                        <Link to="/student/skills" className="text-gray-600 hover:text-primary-600">
                            My Skills
                        </Link>
                        <Link to="/student/gap-analysis" className="text-gray-600 hover:text-primary-600">
                            Gap Analysis
                        </Link>
                        <Link to="/student/career-path" className="text-gray-600 hover:text-primary-600">
                            Career Path
                        </Link>
                        <Link to="/student/jobs" className="text-primary-600 font-medium border-b-2 border-primary-600 pb-1">
                            Find Jobs
                        </Link>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold mb-2">Browse Jobs</h2>
                    <p className="text-gray-600">
                        All jobs show your skill match percentage. Apply only where you're ready!
                    </p>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-3 mb-6">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium ${filter === 'all'
                            ? 'bg-primary-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:border-primary-300'
                            }`}
                    >
                        All Jobs ({jobs.length})
                    </button>
                    <button
                        onClick={() => setFilter('ready')}
                        className={`px-4 py-2 rounded-lg font-medium ${filter === 'ready'
                            ? 'bg-green-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:border-green-300'
                            }`}
                    >
                        Ready to Apply (≥80%)
                    </button>
                    <button
                        onClick={() => setFilter('good')}
                        className={`px-4 py-2 rounded-lg font-medium ${filter === 'good'
                            ? 'bg-yellow-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:border-yellow-300'
                            }`}
                    >
                        Good Match (60-79%)
                    </button>
                    <button
                        onClick={() => setFilter('notReady')}
                        className={`px-4 py-2 rounded-lg font-medium ${filter === 'notReady'
                            ? 'bg-red-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:border-red-300'
                            }`}
                    >
                        Build Skills (&lt;60%)
                    </button>
                </div>

                {/* Jobs List */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Loading jobs...</p>
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="card text-center py-12">
                        <p className="text-gray-500 mb-4">
                            {filter === 'all'
                                ? 'No jobs available at the moment'
                                : `No jobs in this category. Try a different filter.`}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredJobs.map(job => (
                            <div key={job._id} className="card hover:shadow-lg transition-shadow">
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
                                        <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                                        <p className="text-sm text-gray-600 mb-2">
                                            {job.companyId?.profile?.companyName || 'Company'}
                                            {job.companyId?.profile?.industry &&
                                                ` • ${job.companyId.profile.industry}`}
                                        </p>
                                        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                                            {job.description}
                                        </p>

                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-sm text-gray-600">
                                                {job.requiredSkills?.length || 0} skills required
                                            </span>
                                            {job.applications?.length > 0 && (
                                                <>
                                                    <span className="text-gray-400">•</span>
                                                    <span className="text-sm text-gray-600">
                                                        {job.applications.length} applicants
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        {/* Action Button */}
                                        <Link
                                            to={`/student/job/${job._id}`}
                                            className={`inline-block px-4 py-2 rounded-lg font-medium text-sm ${job.matchPercentage >= 80
                                                ? 'bg-green-600 text-white hover:bg-green-700'
                                                : job.matchPercentage >= 60
                                                    ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-bold text-blue-900 mb-2">💡 How Job Matching Works</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Match % is calculated from your verified SCI scores across required skills</li>
                        <li>• Each skill has an importance weight set by the company (1-5 stars)</li>
                        <li>• Higher importance skills count more toward your match percentage</li>
                        <li>• 80%+ match = Ready to apply confidently</li>
                        <li>• Below 80%? Build those skills and come back stronger!</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Jobs;
