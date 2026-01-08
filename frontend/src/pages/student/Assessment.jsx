import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

function Assessment() {
    const { skillId } = useParams();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [loading, setLoading] = useState(true);
    const [assessmentData, setAssessmentData] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
    const [startTime] = useState(Date.now());
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        startAssessment();
    }, [skillId]);

    // Timer countdown
    useEffect(() => {
        if (!assessmentData || timeRemaining <= 0) return;

        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    handleSubmit(true); // Auto-submit when time runs out
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [assessmentData, timeRemaining]);

    const startAssessment = async () => {
        try {
            const res = await api.post('/assessments/start', { skillId });
            setAssessmentData(res.data);
            setTimeRemaining(res.data.timeLimit || 600);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to start assessment');
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionId, answer) => {
        setAnswers({
            ...answers,
            [questionId]: answer
        });
    };

    const handleSubmit = async (autoSubmit = false) => {
        if (!autoSubmit && !confirm('Are you sure you want to submit? You cannot change answers after submission.')) {
            return;
        }

        setSubmitting(true);

        try {
            const timeTaken = Math.floor((Date.now() - startTime) / 1000);

            const formattedAnswers = assessmentData.questions.map(q => ({
                questionId: q._id,
                userAnswer: answers[q._id] || null
            }));

            const res = await api.post('/assessments/submit', {
                skillId,
                answers: formattedAnswers,
                timeTaken
            });

            // Navigate to results page with data
            navigate('/student/assessment-result', {
                state: {
                    result: res.data,
                    skillName: assessmentData.skillName
                }
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit assessment');
            setSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getTimeColor = () => {
        if (timeRemaining < 60) return 'text-red-600';
        if (timeRemaining < 180) return 'text-yellow-600';
        return 'text-green-600';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-purple-50/20 to-blue-50/30">
                <div className="flex flex-col items-center gap-4">
                    <div className="loading-spinner w-12 h-12"></div>
                    <div className="text-xl font-semibold text-gradient">Loading assessment...</div>
                </div>
            </div>
        );
    }

    if (error && !assessmentData) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-2xl mx-auto">
                    <div className="card bg-red-50 border-red-200">
                        <h2 className="text-xl font-bold text-red-800 mb-2">Unable to Start Assessment</h2>
                        <p className="text-red-700 mb-4">{error}</p>
                        <Link to="/student/skills" className="btn-primary">
                            Back to Skills
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = assessmentData?.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / assessmentData?.questions.length) * 100;
    const answeredCount = Object.keys(answers).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-blue-50/30">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 shadow-lg sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-black text-white mb-1">
                                📝 {assessmentData?.skillName} Assessment
                            </h1>
                            <p className="text-sm text-purple-100">
                                Question {currentQuestionIndex + 1} of {assessmentData?.questions.length}
                            </p>
                        </div>
                        <div className={`text-3xl font-black ${getTimeColor()} bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl`}>
                            ⏱️ {formatTime(timeRemaining)}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-full h-3">
                        <div
                            className="progress-fill h-3 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-slide-up">
                <div className="card-glass">
                    {/* Question */}
                    <div className="mb-6">
                        <div className="flex items-start justify-between mb-5">
                            <h2 className="text-xl font-bold text-gray-800 leading-relaxed">
                                {currentQuestion?.question}
                            </h2>
                            <div className="ml-4 px-4 py-2 bg-gradient-to-r from-blue-400 to-purple-500 text-white text-sm font-bold rounded-xl">
                                {currentQuestion?.points} pts
                            </div>
                        </div>

                        {/* Options */}
                        <div className="space-y-3">
                            {currentQuestion?.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswerSelect(currentQuestion._id, option)}
                                    className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${answers[currentQuestion._id] === option
                                        ? 'border-primary-600 bg-gradient-to-br from-primary-50 to-purple-50 shadow-glow'
                                        : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-all ${answers[currentQuestion._id] === option
                                            ? 'border-primary-600 bg-primary-600 scale-110'
                                            : 'border-gray-400'
                                            }`}>
                                            {answers[currentQuestion._id] === option && (
                                                <div className="w-2.5 h-2.5 bg-white rounded-full" />
                                            )}
                                        </div>
                                        <span className="font-medium">{option}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center pt-6 border-t">
                        <button
                            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                            disabled={currentQuestionIndex === 0}
                            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ← Previous
                        </button>

                        <div className="text-sm text-gray-600">
                            {answeredCount} / {assessmentData?.questions.length} answered
                        </div>

                        {currentQuestionIndex < assessmentData?.questions.length - 1 ? (
                            <button
                                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                className="btn-primary"
                            >
                                Next →
                            </button>
                        ) : (
                            <button
                                onClick={() => handleSubmit(false)}
                                disabled={submitting || answeredCount < assessmentData?.questions.length}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Submitting...' : 'Submit Assessment'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Quick Navigation */}
                <div className="card-glass mt-6">
                    <h3 className="font-bold mb-4 text-gradient">Question Navigator</h3>
                    <div className="flex flex-wrap gap-2">
                        {assessmentData?.questions.map((q, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentQuestionIndex(idx)}
                                className={`w-12 h-12 rounded-xl font-bold transition-all duration-300 transform hover:scale-110 ${idx === currentQuestionIndex
                                    ? 'bg-gradient-to-br from-primary-600 to-purple-600 text-white shadow-glow'
                                    : answers[q._id]
                                        ? 'bg-gradient-to-br from-green-100 to-emerald-100 text-green-800 border-2 border-green-300'
                                        : 'bg-white text-gray-600 border-2 border-gray-300 hover:border-primary-400'
                                    }`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Warning */}
                {answeredCount < assessmentData?.questions.length && (
                    <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">
                            ⚠️ You have {assessmentData?.questions.length - answeredCount} unanswered question(s).
                            Unanswered questions will be marked as incorrect.
                        </p>
                    </div>
                )}

                {error && (
                    <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Assessment;
