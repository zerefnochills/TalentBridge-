import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

function Candidates() {
    const { jobId } = useParams();
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCandidates();
    }, [jobId]);

    const loadCandidates = async () => {
        try {
            const res = await api.get(`/jobs/${jobId}/candidates`);
            setJob(res.data.job || { title: 'Job' });
            setCandidates(res.data.candidates || []);
        } catch (error) {
            console.error('Error loading candidates:', error);
        } finally {
            setLoading(false);
        }
    };

    const getMatchColor = (percentage) => {
        if (percentage >= 80) return 'text-success';
        if (percentage >= 60) return 'text-warning';
        return 'text-danger';
    };

    return (
        <div className="container">
            {/* Back Link */}
            <div className="mb-6">
                <Link to="/company/dashboard" className="inline-flex items-center text-primary-400 hover:text-primary-300 font-medium">
                    ← Back to Dashboard
                </Link>
            </div>

            <div className="mb-6">
                <h2 className="text-3xl font-bold text-text-main">{job?.title || 'Job'}</h2>
                <p className="text-text-muted">Candidates ranked by skill match</p>
            </div>

            {loading ? (
                <div className="card text-center py-12">
                    <div className="loading-spinner mx-auto"></div>
                </div>
            ) : candidates.length === 0 ? (
                <div className="card text-center py-12">
                    <div className="text-5xl mb-4">👥</div>
                    <p className="text-text-muted mb-2">No applications yet</p>
                    <p className="text-sm text-text-muted">Candidates will appear here when they apply</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {candidates.map((candidate, index) => (
                        <div key={candidate.candidateId} className="card">
                            <div className="flex items-start gap-6">
                                {/* Rank Badge */}
                                <div className="flex-shrink-0 w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center">
                                    <span className="text-2xl font-bold text-primary-400">#{index + 1}</span>
                                </div>

                                {/* Candidate Info */}
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-xl font-bold text-text-main">{candidate.candidateName}</h3>
                                            <p className="text-sm text-text-muted">{candidate.candidateEmail}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-3xl font-bold ${getMatchColor(candidate.matchPercentage)}`}>
                                                {candidate.matchPercentage}%
                                            </div>
                                            <p className="text-xs text-text-muted">Match</p>
                                        </div>
                                    </div>

                                    {/* Skills Summary */}
                                    <div className="flex gap-4 text-sm mb-3">
                                        <span className="text-success">
                                            ✓ {candidate.skillBreakdown?.filter(s => s.status === 'meets').length || 0} skills met
                                        </span>
                                        <span className="text-warning">
                                            ⚠ {candidate.skillBreakdown?.filter(s => s.status === 'below').length || 0} below threshold
                                        </span>
                                        <span className="text-danger">
                                            ✗ {candidate.skillBreakdown?.filter(s => s.status === 'missing').length || 0} missing
                                        </span>
                                    </div>

                                    {/* Top Skills */}
                                    {candidate.skillBreakdown && candidate.skillBreakdown.length > 0 && (
                                        <div className="border-t border-white/10 pt-3">
                                            <p className="text-xs text-text-muted mb-2">Top Skills:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {candidate.skillBreakdown
                                                    .filter(s => s.status === 'meets')
                                                    .slice(0, 5)
                                                    .map((skill, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="tag tag-success"
                                                        >
                                                            {skill.skillName} ({Math.round(skill.candidateSCI)})
                                                        </span>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Info Box */}
            <div className="mt-8 card border-primary-500/30 bg-primary-500/10">
                <div className="flex items-start gap-4">
                    <div className="text-3xl">💡</div>
                    <div>
                        <h3 className="font-bold text-primary-400 mb-2">How Ranking Works</h3>
                        <ul className="text-sm text-text-muted space-y-1">
                            <li>• Candidates are ranked by skill match percentage</li>
                            <li>• Match % is calculated from verified SCI scores</li>
                            <li>• Skill importance weights affect the ranking</li>
                            <li>• All rankings are transparent and explainable</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Candidates;
