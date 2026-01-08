import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

function Candidates() {
    const { jobId } = useParams();
    const { user, logout } = useAuth();
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
        if (percentage >= 80) return 'text-green-600';
        if (percentage >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-primary-600">TalentBridge</h1>
                            <p className="text-gray-600">{user?.profile?.companyName || 'Company'}</p>
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
                    <Link to="/company/dashboard" className="text-primary-600 hover:text-primary-700 font-medium">
                        ← Back to Dashboard
                    </Link>
                </div>

                <div className="mb-6">
                    <h2 className="text-3xl font-bold">{job?.title || 'Job'}</h2>
                    <p className="text-gray-600">Candidates ranked by skill match</p>
                </div>

                {loading ? (
                    <div className="card text-center py-12">
                        <p className="text-gray-500">Loading candidates...</p>
                    </div>
                ) : candidates.length === 0 ? (
                    <div className="card text-center py-12">
                        <p className="text-gray-500 mb-4">No applications yet</p>
                        <p className="text-sm text-gray-600">Candidates will appear here when they apply</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {candidates.map((candidate, index) => (
                            <div key={candidate.candidateId} className="card">
                                <div className="flex items-start gap-6">
                                    {/* Rank Badge */}
                                    <div className="flex-shrink-0 w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                                        <span className="text-2xl font-bold text-primary-600">#{index + 1}</span>
                                    </div>

                                    {/* Candidate Info */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold">{candidate.candidateName}</h3>
                                                <p className="text-sm text-gray-600">{candidate.candidateEmail}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-3xl font-bold ${getMatchColor(candidate.matchPercentage)}`}>
                                                    {candidate.matchPercentage}%
                                                </div>
                                                <p className="text-xs text-gray-500">Match</p>
                                            </div>
                                        </div>

                                        {/* Skills Summary */}
                                        <div className="flex gap-4 text-sm mb-3">
                                            <span className="text-green-600">
                                                ✓ {candidate.skillBreakdown?.filter(s => s.status === 'meets').length || 0} skills met
                                            </span>
                                            <span className="text-yellow-600">
                                                ⚠ {candidate.skillBreakdown?.filter(s => s.status === 'below').length || 0} below threshold
                                            </span>
                                            <span className="text-red-600">
                                                ✗ {candidate.skillBreakdown?.filter(s => s.status === 'missing').length || 0} missing
                                            </span>
                                        </div>

                                        {/* Top Skills */}
                                        {candidate.skillBreakdown && candidate.skillBreakdown.length > 0 && (
                                            <div className="border-t pt-3">
                                                <p className="text-xs text-gray-600 mb-2">Top Skills:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {candidate.skillBreakdown
                                                        .filter(s => s.status === 'meets')
                                                        .slice(0, 5)
                                                        .map((skill, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
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
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-bold text-blue-900 mb-2">💡 How Ranking Works</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Candidates are ranked by skill match percentage</li>
                        <li>• Match % is calculated from verified SCI scores</li>
                        <li>• Skill importance weights affect the ranking</li>
                        <li>• All rankings are transparent and explainable</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Candidates;
