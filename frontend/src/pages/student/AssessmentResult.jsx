import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SCIBreakdown from '../../components/SCIBreakdown';

function AssessmentResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const { result, skillName } = location.state || {};

    if (!result) {
        return (
            <div className="container py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="card">
                        <h2 className="text-2xl font-bold mb-4 text-text-main">No Results Found</h2>
                        <p className="text-text-muted mb-4">
                            Unable to load assessment results. Please try taking the assessment again.
                        </p>
                        <Link to="/student/skills" className="btn btn-primary">
                            Back to Skills
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const scorePercentage = result.score || 0;
    const getScoreColor = () => {
        if (scorePercentage >= 80) return 'text-success';
        if (scorePercentage >= 60) return 'text-primary-400';
        if (scorePercentage >= 40) return 'text-warning';
        return 'text-danger';
    };

    const getScoreMessage = () => {
        if (scorePercentage >= 80) return 'Excellent work! 🎉';
        if (scorePercentage >= 60) return 'Good job! Keep it up! 👍';
        if (scorePercentage >= 40) return 'Not bad! Room for improvement. 💪';
        return 'Keep practicing! You\'ll get better. 📚';
    };

    const getScoreBadge = () => {
        if (scorePercentage >= 90) return { text: 'Expert', color: 'bg-accent-purple' };
        if (scorePercentage >= 80) return { text: 'Advanced', color: 'bg-success' };
        if (scorePercentage >= 60) return { text: 'Intermediate', color: 'bg-primary-500' };
        if (scorePercentage >= 40) return { text: 'Beginner+', color: 'bg-warning' };
        return { text: 'Beginner', color: 'bg-gray-500' };
    };

    const badge = getScoreBadge();
    const newSCI = result.skillData?.sci || 0;

    return (
        <div className="container">
            {/* Results Card */}
            <div className="card text-center mb-6">
                <div className="mb-4">
                    <h2 className="text-3xl font-black text-text-main mb-3">
                        {skillName} Assessment Results
                    </h2>
                    <p className="text-text-muted text-lg font-medium">{getScoreMessage()}</p>
                </div>

                {/* Score Display */}
                <div className="relative my-8">
                    <div className={`text-8xl font-black ${getScoreColor()} mb-4`}>
                        {scorePercentage}%
                    </div>
                    <div className={`inline-block px-6 py-3 ${badge.color} text-white text-lg font-bold rounded-2xl`}>
                        {badge.text}
                    </div>
                </div>

                {/* Points Breakdown */}
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mt-8">
                    <div className="bg-primary-500/20 rounded-2xl p-6 border border-primary-500/30">
                        <div className="text-4xl font-black text-primary-400 mb-2">{result.earnedPoints}</div>
                        <div className="text-sm font-semibold text-text-muted">Points Earned</div>
                    </div>
                    <div className="bg-accent-purple/20 rounded-2xl p-6 border border-accent-purple/30">
                        <div className="text-4xl font-black text-accent-purple mb-2">{result.totalPoints}</div>
                        <div className="text-sm font-semibold text-text-muted">Total Points</div>
                    </div>
                </div>
            </div>

            {/* SCI Update */}
            {result.skillData && (
                <div className="card mb-6">
                    <h3 className="text-2xl font-bold mb-6 text-text-main">
                        Your Updated SCI (Skill Confidence Index)
                    </h3>
                    <div className="flex items-center justify-center mb-6">
                        <div className="text-center">
                            <div className="relative">
                                <div className={`text-7xl font-black ${newSCI >= 80 ? 'text-success' :
                                    newSCI >= 60 ? 'text-primary-400' :
                                        newSCI >= 40 ? 'text-warning' :
                                            'text-danger'
                                    } bg-white/10 rounded-full w-40 h-40 flex items-center justify-center`}>
                                    {Math.round(newSCI)}
                                </div>
                            </div>
                            <div className="text-sm font-semibold text-text-muted mt-4">New SCI Score</div>
                        </div>
                    </div>

                    <SCIBreakdown
                        assessmentScore={result.skillData.assessmentScore}
                        freshnessScore={result.skillData.freshnessScore}
                        scenarioScore={result.skillData.scenarioScore}
                        totalSCI={result.skillData.sci}
                    />
                </div>
            )}

            {/* Cooldown Notice */}
            {result.canRetakeAt && (
                <div className="card border-primary-500/30 bg-primary-500/10 mb-6">
                    <div className="flex items-start gap-4">
                        <div className="text-3xl">📅</div>
                        <div>
                            <h4 className="font-bold text-primary-400 mb-2">Assessment Cooldown</h4>
                            <p className="text-sm text-text-muted">
                                To prevent cheating, you can retake this assessment after{' '}
                                <strong className="text-text-main">{new Date(result.canRetakeAt).toLocaleString()}</strong>
                            </p>
                            <p className="text-xs text-text-muted mt-2">
                                Use this time to practice and improve your skills!
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Next Steps */}
            <div className="card">
                <div className="flex items-start gap-4 mb-6">
                    <div className="text-3xl">🎯</div>
                    <div>
                        <h3 className="text-xl font-bold text-text-main mb-3">What's Next?</h3>
                        <ul className="space-y-3 text-sm text-text-muted">
                            <li className="flex items-start">
                                <span className="text-primary-400 mr-3 text-lg">•</span>
                                <span className="font-medium">Practice more to improve your skills and SCI score</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-primary-400 mr-3 text-lg">•</span>
                                <span className="font-medium">Check out Gap Analysis to see what skills you need for your target role</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-primary-400 mr-3 text-lg">•</span>
                                <span className="font-medium">Browse job postings to find matches based on your SCI</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-primary-400 mr-3 text-lg">•</span>
                                <span className="font-medium">Use the AI Tutor to get personalized learning recommendations</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                    <Link to="/student/gap-analysis" className="btn btn-primary text-center justify-center py-3">
                        📊 Gap Analysis
                    </Link>
                    <Link to="/student/ai-tutor" className="btn btn-primary text-center justify-center py-3">
                        🤖 AI Tutor
                    </Link>
                    <Link to="/student/jobs" className="btn btn-outline text-center justify-center py-3">
                        💼 Browse Jobs
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default AssessmentResult;
