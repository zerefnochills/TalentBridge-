import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import MatchPercentageBadge from '../../components/MatchPercentageBadge';
import SkillMatchBreakdown from '../../components/SkillMatchBreakdown';

function JobDetails() {
    const { jobId } = useParams();
    const { user } = useAuth();
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
            <div className="container flex items-center justify-center py-20">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="container flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="text-5xl mb-4">🔍</div>
                    <p className="text-text-muted mb-4">Job not found</p>
                    <Link to="/student/jobs" className="btn btn-primary">
                        Back to Jobs
                    </Link>
                </div>
            </div>
        );
    }

    const matchPercentage = matchAnalysis?.matchPercentage || 0;
    const isReady = matchPercentage >= 80;

    return (
        <div className="container">
            {/* Back Link */}
            <div className="mb-6">
                <Link to="/student/jobs" className="inline-flex items-center text-primary-400 hover:text-primary-300 font-medium">
                    ← Back to All Jobs
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Job Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Job Header */}
                    <div className="card">
                        <h2 className="text-3xl font-bold text-text-main mb-2">{job.title}</h2>
                        <p className="text-lg text-text-muted mb-4">
                            {job.companyId?.profile?.companyName || 'Company'}
                            {job.companyId?.profile?.industry && (
                                <span className="text-text-muted"> • {job.companyId.profile.industry}</span>
                            )}
                        </p>

                        <div>
                            <h3 className="text-lg font-semibold text-text-main mb-2">Job Description</h3>
                            <p className="text-text-muted whitespace-pre-line">{job.description}</p>
                        </div>
                    </div>

                    {/* Skill Match Breakdown */}
                    {matchAnalysis && (
                        <div className="card">
                            <h3 className="text-2xl font-bold text-text-main mb-4">Your Skill Match Analysis</h3>
                            <SkillMatchBreakdown skillBreakdown={matchAnalysis.skillBreakdown || []} />
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
                            <div className="bg-danger/20 border border-danger/50 text-danger px-3 py-2 rounded-lg text-sm mb-4">
                                {error}
                            </div>
                        )}

                        {/* Application Status */}
                        {hasApplied ? (
                            <div className="bg-success/20 border border-success/50 text-success px-4 py-3 rounded-xl mb-4 text-center">
                                <p className="font-semibold">✓ Application Submitted</p>
                                <p className="text-sm mt-1 opacity-80">The company can now view your profile</p>
                            </div>
                        ) : (
                            <>
                                {isReady ? (
                                    <div className="bg-success/20 border border-success/50 rounded-xl p-4 mb-4">
                                        <h4 className="font-semibold text-success mb-2">
                                            ✓ You're Ready to Apply!
                                        </h4>
                                        <p className="text-sm text-text-muted">
                                            Your skills are a great match for this position. Apply with confidence!
                                        </p>
                                    </div>
                                ) : matchPercentage >= 60 ? (
                                    <div className="bg-warning/20 border border-warning/50 rounded-xl p-4 mb-4">
                                        <h4 className="font-semibold text-warning mb-2">
                                            ⚠ Good Match - Consider Applying
                                        </h4>
                                        <p className="text-sm text-text-muted">
                                            You meet most requirements. Review skill gaps below and decide if you're ready.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-danger/20 border border-danger/50 rounded-xl p-4 mb-4">
                                        <h4 className="font-semibold text-danger mb-2">
                                            ✗ Build Skills First
                                        </h4>
                                        <p className="text-sm text-text-muted">
                                            Strengthen the skills below, then come back to apply when you're ready!
                                        </p>
                                    </div>
                                )}

                                {/* Apply Button */}
                                <button
                                    onClick={handleApply}
                                    disabled={applying || matchPercentage < 60}
                                    className={`btn w-full py-3 justify-center font-semibold ${isReady
                                        ? 'btn-primary'
                                        : matchPercentage >= 60
                                            ? 'bg-warning text-dark-main hover:bg-warning/80'
                                            : 'bg-white/10 text-text-muted cursor-not-allowed'
                                        }`}
                                >
                                    {applying ? 'Submitting...' : 'Apply for This Job'}
                                </button>
                            </>
                        )}

                        {/* Skills Summary */}
                        {matchAnalysis && (
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <h4 className="font-semibold text-text-main mb-3">Skills Summary</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-text-muted">Total Skills:</span>
                                        <span className="font-medium text-text-main">
                                            {matchAnalysis.skillBreakdown?.length || 0}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-success">✓ Meets Requirements:</span>
                                        <span className="font-medium text-text-main">
                                            {matchAnalysis.skillBreakdown?.filter(s => s.status === 'meets').length || 0}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-warning">⚠ Below Threshold:</span>
                                        <span className="font-medium text-text-main">
                                            {matchAnalysis.skillBreakdown?.filter(s => s.status === 'below').length || 0}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-danger">✗ Missing:</span>
                                        <span className="font-medium text-text-main">
                                            {matchAnalysis.skillBreakdown?.filter(s => s.status === 'missing').length || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* No Resume Note */}
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <p className="text-xs text-text-muted text-center">
                                🎯 No resume required. You're evaluated purely on your verified skill confidence.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JobDetails;
