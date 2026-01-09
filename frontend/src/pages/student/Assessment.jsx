import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

function Assessment() {
    const { skillId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [assessmentData, setAssessmentData] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(600);
    const [startTime] = useState(Date.now());
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        startAssessment();
    }, [skillId]);

    useEffect(() => {
        if (!assessmentData || timeRemaining <= 0) return;

        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    handleSubmit(true);
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
        if (timeRemaining < 60) return 'text-danger';
        if (timeRemaining < 180) return 'text-warning';
        return 'text-success';
    };

    if (loading) {
        return (
            <div className="container flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                    <div className="loading-spinner w-12 h-12"></div>
                    <div className="text-xl font-semibold text-text-main">Loading assessment...</div>
                </div>
            </div>
        );
    }

    if (error && !assessmentData) {
        return (
            <div className="container py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="card border-danger/30 bg-danger/10">
                        <h2 className="text-xl font-bold text-danger mb-2">Unable to Start Assessment</h2>
                        <p className="text-text-muted mb-4">{error}</p>
                        <Link to="/student/skills" className="btn btn-primary">
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
        <div className="container py-0">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-accent-purple -mx-8 -mt-8 px-8 py-6 mb-8 rounded-b-2xl">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-black text-white mb-1">
                            📝 {assessmentData?.skillName} Assessment
                        </h1>
                        <p className="text-sm text-white/80">
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
                        className="bg-gradient-to-r from-primary-400 to-accent-pink h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <div className="card mb-6">
                <div className="mb-6">
                    <div className="flex items-start justify-between mb-5">
                        <h2 className="text-xl font-bold text-text-main leading-relaxed">
                            {currentQuestion?.question}
                        </h2>
                        <div className="ml-4 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-purple text-white text-sm font-bold rounded-xl">
                            {currentQuestion?.points} pts
                        </div>
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                        {currentQuestion?.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswerSelect(currentQuestion._id, option)}
                                className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.01] ${answers[currentQuestion._id] === option
                                    ? 'border-primary-500 bg-primary-500/20'
                                    : 'border-white/10 hover:border-primary-500/50 hover:bg-white/5'
                                    }`}
                            >
                                <div className="flex items-center">
                                    <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-all ${answers[currentQuestion._id] === option
                                        ? 'border-primary-500 bg-primary-500 scale-110'
                                        : 'border-white/40'
                                        }`}>
                                        {answers[currentQuestion._id] === option && (
                                            <div className="w-2.5 h-2.5 bg-white rounded-full" />
                                        )}
                                    </div>
                                    <span className="font-medium text-text-main">{option}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center pt-6 border-t border-white/10">
                    <button
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        ← Previous
                    </button>

                    <div className="text-sm text-text-muted">
                        {answeredCount} / {assessmentData?.questions.length} answered
                    </div>

                    {currentQuestionIndex < assessmentData?.questions.length - 1 ? (
                        <button
                            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                            className="btn btn-primary"
                        >
                            Next →
                        </button>
                    ) : (
                        <button
                            onClick={() => handleSubmit(false)}
                            disabled={submitting || answeredCount < assessmentData?.questions.length}
                            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Submitting...' : 'Submit Assessment'}
                        </button>
                    )}
                </div>
            </div>

            {/* Quick Navigation */}
            <div className="card">
                <h3 className="font-bold text-primary-400 mb-4">Question Navigator</h3>
                <div className="flex flex-wrap gap-2">
                    {assessmentData?.questions.map((q, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentQuestionIndex(idx)}
                            className={`w-12 h-12 rounded-xl font-bold transition-all duration-300 transform hover:scale-110 ${idx === currentQuestionIndex
                                ? 'bg-gradient-to-br from-primary-500 to-accent-purple text-white'
                                : answers[q._id]
                                    ? 'bg-success/20 text-success border-2 border-success/50'
                                    : 'bg-white/5 text-text-muted border-2 border-white/10 hover:border-primary-500/50'
                                }`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* Warning */}
            {answeredCount < assessmentData?.questions.length && (
                <div className="mt-6 card border-warning/30 bg-warning/10">
                    <p className="text-sm text-text-main">
                        ⚠️ You have {assessmentData?.questions.length - answeredCount} unanswered question(s).
                        Unanswered questions will be marked as incorrect.
                    </p>
                </div>
            )}

            {error && (
                <div className="mt-6 card border-danger/30 bg-danger/10">
                    <p className="text-sm text-danger">{error}</p>
                </div>
            )}
        </div>
    );
}

export default Assessment;
