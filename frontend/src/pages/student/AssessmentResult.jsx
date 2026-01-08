import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SCIBreakdown from '../../components/SCIBreakdown';

function AssessmentResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const { result, skillName } = location.state || {};

    if (!result) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-blue-50/30 p-8">
                <div className="max-w-2xl mx-auto">
                    <div className="card-glass">
                        <h2 className="text-2xl font-bold mb-4 text-gradient">No Results Found</h2>
                        <p className="text-gray-600 mb-4">
                            Unable to load assessment results. Please try taking the assessment again.
                        </p>
                        <Link to="/student/skills" className="btn-primary">
                            Back to Skills
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const scorePercentage = result.score || 0;
    const getScoreColor = () => {
        if (scorePercentage >= 80) return 'text-green-600';
        if (scorePercentage >= 60) return 'text-blue-600';
        if (scorePercentage >= 40) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreMessage = () => {
        if (scorePercentage >= 80) return 'Excellent work! 🎉';
        if (scorePercentage >= 60) return 'Good job! Keep it up! 👍';
        if (scorePercentage >= 40) return 'Not bad! Room for improvement. 💪';
        return 'Keep practicing! You\'ll get better. 📚';
    };

    const getScoreBadge = () => {
        if (scorePercentage >= 90) return { text: 'Expert', gradient: 'from-purple-500 to-pink-500' };
        if (scorePercentage >= 80) return { text: 'Advanced', gradient: 'from-green-500 to-emerald-500' };
        if (scorePercentage >= 60) return { text: 'Intermediate', gradient: 'from-blue-500 to-cyan-500' };
        if (scorePercentage >= 40) return { text: 'Beginner+', gradient: 'from-yellow-500 to-orange-500' };
        return { text: 'Beginner', gradient: 'from-gray-500 to-gray-600' };
    };

    const badge = getScoreBadge();
    const newSCI = result.skillData?.sci || 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-blue-50/30">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 shadow-lg">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-black text-white mb-1">TalentBridge</h1>
                            <p className="text-purple-100">Welcome, {user?.profile?.name || 'Student'}! 👋</p>
                        </div>
                        <button onClick={logout} className="btn-secondary bg-white/20 hover:bg-white/30 text-white border-white/30">
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 animate-slide-up">
                    <Link to="/student/skills" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold group">
                        <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Skills
                    </Link>
                </div>

                {/* Results Card */}
                <div className="card-glass text-center mb-6 animate-scale-in">
                    <div className="mb-4">
                        <h2 className="text-3xl font-black text-gradient mb-3">
                            {skillName} Assessment Results
                        </h2>
                        <p className="text-gray-600 text-lg font-medium">{getScoreMessage()}</p>
                    </div>

                    {/* Confetti effect for high scores */}
                    {scorePercentage >= 80 && (
                        <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden pointer-events-none opacity-30">
                            <div className="text-6xl animate-bounce-slow">🎉</div>
                        </div>
                    )}

                    {/* Score Display */}
                    <div className="relative my-8">
                        <div className="score-display text-8xl mb-4">
                            {scorePercentage}%
                        </div>
                        <div className={`inline-block px-6 py-3 bg-gradient-to-r ${badge.gradient} text-white text-lg font-bold rounded-2xl shadow-glow`}>
                            {badge.text}
                        </div>
                    </div>

                    {/* Points Breakdown */}
                    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mt-8">
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
                            <div className="text-4xl font-black text-gradient mb-2">{result.earnedPoints}</div>
                            <div className="text-sm font-semibold text-gray-600">Points Earned</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                            <div className="text-4xl font-black text-gradient mb-2">{result.totalPoints}</div>
                            <div className="text-sm font-semibold text-gray-600">Total Points</div>
                        </div>
                    </div>
                </div>

                {/* SCI Update */}
                {result.skillData && (
                    <div className="card-glass mb-6 animate-slide-up">
                        <h3 className="text-2xl font-bold mb-6 text-gradient">
                            Your Updated SCI (Skill Confidence Index)
                        </h3>
                        <div className="flex items-center justify-center mb-6">
                            <div className="text-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full blur-xl opacity-30"></div>
                                    <div className={`relative text-7xl font-black ${newSCI >= 80 ? 'text-green-600' :
                                        newSCI >= 60 ? 'text-blue-600' :
                                            newSCI >= 40 ? 'text-yellow-600' :
                                                'text-red-600'
                                        } bg-white rounded-full w-40 h-40 flex items-center justify-center shadow-lg`}>
                                        {Math.round(newSCI)}
                                    </div>
                                </div>
                                <div className="text-sm font-semibold text-gray-600 mt-4">New SCI Score</div>
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
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-2xl p-6 mb-6 animate-slide-up">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                <span className="text-2xl">📅</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-blue-900 mb-2">Assessment Cooldown</h4>
                                <p className="text-sm text-blue-800">
                                    To prevent cheating, you can retake this assessment after{' '}
                                    <strong>{new Date(result.canRetakeAt).toLocaleString()}</strong>
                                </p>
                                <p className="text-xs text-blue-700 mt-2">
                                    Use this time to practice and improve your skills!
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Next Steps */}
                <div className="card-gradient border-2 border-primary-200 animate-slide-up">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">🎯</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gradient mb-3">What's Next?</h3>
                            <ul className="space-y-3 text-sm text-gray-700">
                                <li className="flex items-start">
                                    <span className="text-primary-500 mr-3 text-lg">•</span>
                                    <span className="font-medium">Practice more to improve your skills and SCI score</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary-500 mr-3 text-lg">•</span>
                                    <span className="font-medium">Check out Gap Analysis to see what skills you need for your target role</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary-500 mr-3 text-lg">•</span>
                                    <span className="font-medium">Browse job postings to find matches based on your SCI</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary-500 mr-3 text-lg">•</span>
                                    <span className="font-medium">Use the AI Tutor to get personalized learning recommendations</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                        <Link to="/student/gap-analysis" className="btn-primary text-center py-3">
                            📊 Gap Analysis
                        </Link>
                        <Link to="/student/ai-tutor" className="btn-primary text-center py-3">
                            🤖 AI Tutor
                        </Link>
                        <Link to="/student/jobs" className="btn-secondary text-center py-3">
                            💼 Browse Jobs
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AssessmentResult;
