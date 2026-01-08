import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import MatchPercentageBadge from '../../components/MatchPercentageBadge';
import SkillMatchBreakdown from '../../components/SkillMatchBreakdown';

function JobDetails() {
    const { jobId } = useParams();
    const { user, logout } = useAuth();
    const [job, setJob] = useState(null);
    const [matchAnalysis, setMatchAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadJobDetails();
    }, [jobId]);

    const loadJobDetails = async () => {
        try {
            const res = await api.get(`/jobs/${jobId}`);
            setJob(res.data.job);
            setMatchAnalysis(res.data.matchAnalysis);

            // Check if already applied
            const alreadyApplied = res.data.job.applications?.some(
                app => app.candidateId === user._id
            );
            setHasApplied(alreadyApplied);
        } catch (error) {
            console.error('Error loading job:', error);
            setError('Failed to load job details');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async () => {
        if (hasApplied) return;

        setApplying(true);
        setError('');

        try {
            await api.post(`/jobs/${jobId}/apply`);
            setHasApplied(true);
            alert('Application submitted successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to apply for job');
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">Loading job details...</p>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Job not found</p>
                    <Link to="/student/jobs" className="btn-primary">
                        Back to Jobs
                    </Link>
                </div>
            </div>
        );
    }

    const matchPercentage = matchAnalysis?.matchPercentage || 0;
    const isReady = matchPercentage >= 80;

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

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <Link to="/student/jobs" className="text-primary-600 hover:text-primary-700 font-medium">
                        ← Back to All Jobs
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Job Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Job Header */}
                        <div className="card">
                            <h2 className="text-3xl font-bold mb-2">{job.title}</h2>
                            <p className="text-lg text-gray-600 mb-4">
                                {job.companyId?.profile?.companyName || 'Company'}
                                {job.companyId?.profile?.industry && (
                                    <span className="text-gray-500"> • {job.companyId.profile.industry}</span>
                                )}
                            </p>

                            <div className="prose max-w-none">
                                <h3 className="text-lg font-semibold mb-2">Job Description</h3>
                                <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                            </div>
                        </div>

                        {/* Skill Match Breakdown */}
                        {matchAnalysis && (
                            <div className="card">
                                <h3 className="text-2xl font-bold mb-4">Your Skill Match Analysis</h3>
                                <SkillMatchBreakdown skillBreakdown={matchAnalysis.skillBreakdown} />
                            </div>
                        )}
                    </div>

                    {/* Right Column - Application Card */}
                    <div className="lg:col-span-1">
                        <div className="card sticky top-4">
                            {/* Match Badge */}
                            <div className="flex justify-center mb-6">
                                <MatchPercentageBadge
                                    percentage={matchPercentage}
                                    size="large"
                                    showLabel={true}
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm mb-4">
                                    {error}
                                </div>
                            )}

                            {/* Application Status */}
                            {hasApplied ? (
                                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4 text-center">
                                    <p className="font-semibold">✓ Application Submitted</p>
                                    <p className="text-sm mt-1">The company can now view your profile</p>
                                </div>
                            ) : (
                                <>
                                    {isReady ? (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                            <h4 className="font-semibold text-green-900 mb-2">
                                                ✓ You're Ready to Apply!
                                            </h4>
                                            <p className="text-sm text-green-800">
                                                Your skills are a great match for this position. Apply with confidence!
                                            </p>
                                        </div>
                                    ) : matchPercentage >= 60 ? (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                                            <h4 className="font-semibold text-yellow-900 mb-2">
                                                ⚠ Good Match - Consider Applying
                                            </h4>
                                            <p className="text-sm text-yellow-800">
                                                You meet most requirements. Review skill gaps below and decide if you're ready.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                            <h4 className="font-semibold text-red-900 mb-2">
                                                ✗ Build Skills First
                                            </h4>
                                            <p className="text-sm text-red-800">
                                                Strengthen the skills below, then come back to apply when you're ready!
                                            </p>
                                        </div>
                                    )}

                                    {/* Apply Button */}
                                    <button
                                        onClick={handleApply}
                                        disabled={applying}
                                        className={`w-full py-3 rounded-lg font-semibold text-white ${isReady
                                                ? 'bg-green-600 hover:bg-green-700'
                                                : matchPercentage >= 60
                                                    ? 'bg-yellow-600 hover:bg-yellow-700'
                                                    : 'bg-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        {applying ? 'Submitting...' : 'Apply for This Job'}
                                    </button>
                                </>
                            )}

                            {/* Skills Summary */}
                            {matchAnalysis && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h4 className="font-semibold mb-3">Skills Summary</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Skills:</span>
                                            <span className="font-medium">
                                                {matchAnalysis.skillBreakdown.length}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-green-600">✓ Meets Requirements:</span>
                                            <span className="font-medium">
                                                {matchAnalysis.skillBreakdown.filter(s => s.status === 'meets').length}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-yellow-600">⚠ Below Threshold:</span>
                                            <span className="font-medium">
                                                {matchAnalysis.skillBreakdown.filter(s => s.status === 'below').length}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-red-600">✗ Missing:</span>
                                            <span className="font-medium">
                                                {matchAnalysis.skillBreakdown.filter(s => s.status === 'missing').length}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* No Resume Note */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <p className="text-xs text-gray-600 text-center">
                                    🎯 No resume required. You're evaluated purely on your verified skill confidence.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JobDetails;
