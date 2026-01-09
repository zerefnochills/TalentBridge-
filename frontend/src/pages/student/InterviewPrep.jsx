import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMySkills } from '../../services/skillService';

const INTERVIEW_QUESTIONS = {
    "React": {
        expert: [
            { q: "Explain the Reconciliation process in React.", type: 'conceptual' },
            { q: "How does React Fiber improve performance?", type: 'conceptual' },
            { q: "Design a custom hook for handling WebSocket connections.", type: 'system-design' }
        ],
        beginner: [
            { q: "What are the differences between Props and State?", type: 'conceptual' },
            { q: "Explain the useEffect hook lifecycle.", type: 'conceptual' },
            { q: "What is JSX?", type: 'conceptual' }
        ]
    },
    "JavaScript": {
        expert: [
            { q: "Explain the Event Loop and Microtask Queue.", type: 'conceptual' },
            { q: "How does Prototypal Inheritance work under the hood?", type: 'conceptual' },
            { q: "Write a polyfill for Promise.all.", type: 'coding' }
        ],
        beginner: [
            { q: "What is the difference between let, const, and var?", type: 'conceptual' },
            { q: "Explain closures in JavaScript.", type: 'conceptual' },
            { q: "What is 'this' keyword?", type: 'conceptual' }
        ]
    },
    "Node.js": {
        expert: [
            { q: "How would you scale a Node.js application to handle 10k RPS?", type: 'system-design' },
            { q: "Explain Node.js Streams and Backpressure.", type: 'conceptual' }
        ],
        beginner: [
            { q: "What is non-blocking I/O?", type: 'conceptual' },
            { q: "Explain module.exports vs exports.", type: 'conceptual' }
        ]
    },
    "Python": {
        expert: [
            { q: "Explain Python's GIL and how to work around it.", type: 'conceptual' },
            { q: "How would you implement a decorator with arguments?", type: 'coding' }
        ],
        beginner: [
            { q: "What are Python decorators?", type: 'conceptual' },
            { q: "Explain list comprehensions.", type: 'conceptual' }
        ]
    },
    "Behavioral": [
        { q: "Tell me about a time you failed to meet a deadline. How did you handle it?", type: 'behavioral' },
        { q: "Describe a conflict you had with a team member.", type: 'behavioral' },
        { q: "What is your greatest weakness?", type: 'behavioral' },
        { q: "Tell me about a project you're most proud of.", type: 'behavioral' }
    ]
};

function InterviewPrep() {
    const { user } = useAuth();
    const [userSkills, setUserSkills] = useState([]);
    const [selectedMode, setSelectedMode] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        let interval;
        if (isTimerRunning) {
            interval = setInterval(() => setTimer(t => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const loadData = async () => {
        try {
            const data = await getMySkills();
            setUserSkills(Array.isArray(data) ? data : (data.skills || []));
        } catch (error) {
            console.error('Error loading skills:', error);
        }
    };

    const startSession = (mode) => {
        setSelectedMode(mode);
        setFeedback(null);
        setUserAnswer('');
        setIsTimerRunning(true);
        setTimer(0);

        let questionsPool = [];

        if (mode === 'behavioral') {
            questionsPool = INTERVIEW_QUESTIONS["Behavioral"];
        } else if (mode === 'strength') {
            const strongSkills = userSkills.filter(s => (s.sci || 0) >= 60);
            strongSkills.forEach(s => {
                const q = INTERVIEW_QUESTIONS[s.skillId?.name] || INTERVIEW_QUESTIONS[s.name];
                if (q) questionsPool = [...questionsPool, ...q.expert];
            });
            if (questionsPool.length === 0) questionsPool = INTERVIEW_QUESTIONS["JavaScript"].expert;
        } else {
            const weakSkills = userSkills.filter(s => (s.sci || 0) < 60);
            weakSkills.forEach(s => {
                const q = INTERVIEW_QUESTIONS[s.skillId?.name] || INTERVIEW_QUESTIONS[s.name];
                if (q) questionsPool = [...questionsPool, ...q.beginner];
            });
            if (questionsPool.length === 0) questionsPool = INTERVIEW_QUESTIONS["JavaScript"].beginner;
        }

        const randomQ = questionsPool[Math.floor(Math.random() * questionsPool.length)];
        setCurrentQuestion(randomQ);
    };

    const handleSubmit = () => {
        setIsTimerRunning(false);
        const wordCount = userAnswer.trim().split(/\s+/).length;
        let score = 0;
        let message = "";

        if (wordCount < 10) {
            score = 30;
            message = "Your answer is too short. Try to elaborate more with specific examples.";
        } else if (wordCount > 50) {
            score = 90;
            message = "Excellent depth! You covered key points with good detail.";
        } else if (wordCount > 30) {
            score = 75;
            message = "Good answer! Try adding specific examples to strengthen it.";
        } else {
            score = 55;
            message = "Decent start. Add more technical details and examples.";
        }

        setFeedback({ score, message, timeTaken: timer });
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="container">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-text-main mb-2">Interview Prep</h1>
                <p className="text-text-muted">Practice with skill-based questions and get instant feedback</p>
            </div>

            {!selectedMode ? (
                <div className="space-y-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-text-main mb-2">Choose Your Practice Mode</h2>
                        <p className="text-text-muted">Select a mode based on your SCI profile</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <button
                            onClick={() => startSession('strength')}
                            className="card text-left hover:border-green-500/50 transition-all group"
                        >
                            <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span className="text-3xl">💪</span>
                            </div>
                            <h3 className="text-xl font-bold text-text-main mb-2">Build on Strengths</h3>
                            <p className="text-sm text-text-muted">Deep-dive technical questions on your highest SCI skills.</p>
                        </button>

                        <button
                            onClick={() => startSession('weakness')}
                            className="card text-left hover:border-orange-500/50 transition-all group"
                        >
                            <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span className="text-3xl">🛠️</span>
                            </div>
                            <h3 className="text-xl font-bold text-text-main mb-2">Fix Weaknesses</h3>
                            <p className="text-sm text-text-muted">Fundamental questions on lower SCI skills to bridge gaps.</p>
                        </button>

                        <button
                            onClick={() => startSession('behavioral')}
                            className="card text-left hover:border-blue-500/50 transition-all group"
                        >
                            <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span className="text-3xl">🤝</span>
                            </div>
                            <h3 className="text-xl font-bold text-text-main mb-2">Behavioral</h3>
                            <p className="text-sm text-text-muted">Prepare for HR rounds with standard behavioral scenarios.</p>
                        </button>
                    </div>

                    {/* Tips */}
                    <div className="card bg-gradient-to-r from-primary-500/10 to-purple-500/10 border-primary-500/30">
                        <div className="flex items-start gap-4">
                            <span className="text-2xl">💡</span>
                            <div>
                                <h4 className="font-bold text-text-main mb-2">Interview Tips</h4>
                                <ul className="text-sm text-text-muted space-y-1">
                                    <li>• Use the STAR method for behavioral questions</li>
                                    <li>• Speak out loud while typing to simulate real interviews</li>
                                    <li>• Aim for 2-3 minute responses</li>
                                    <li>• Always mention trade-offs in technical answers</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="max-w-2xl mx-auto">
                    <div className="card">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                            <button
                                onClick={() => setSelectedMode(null)}
                                className="text-text-muted hover:text-primary-400 font-medium flex items-center gap-2"
                            >
                                ← End Session
                            </button>
                            <div className="bg-white/10 px-4 py-2 rounded-xl font-mono font-bold text-text-main">
                                {formatTime(timer)}
                            </div>
                        </div>

                        {feedback ? (
                            <div className="text-center py-6">
                                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl font-black mb-4 ${feedback.score >= 70 ? 'bg-green-500/20 text-green-400' :
                                        feedback.score >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-red-500/20 text-red-400'
                                    }`}>
                                    {feedback.score}
                                </div>
                                <h3 className="text-xl font-bold text-text-main mb-2">Feedback</h3>
                                <p className="text-text-muted mb-4">{feedback.message}</p>
                                <p className="text-sm text-text-muted mb-6">Time: {formatTime(feedback.timeTaken)}</p>

                                <div className="bg-white/5 p-4 rounded-xl text-left mb-6">
                                    <p className="text-xs font-bold text-text-muted uppercase mb-2">Pro Tip</p>
                                    <p className="text-sm text-text-muted italic">
                                        Use structured thinking (STAR for behavioral) and mention trade-offs (for technical) to score bonus points.
                                    </p>
                                </div>

                                <button onClick={() => startSession(selectedMode)} className="btn btn-primary w-full">
                                    Next Question →
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div className="mb-6">
                                    <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full mb-3 uppercase tracking-wider ${currentQuestion?.type === 'conceptual' ? 'bg-blue-500/20 text-blue-400' :
                                            currentQuestion?.type === 'system-design' ? 'bg-purple-500/20 text-purple-400' :
                                                currentQuestion?.type === 'coding' ? 'bg-green-500/20 text-green-400' :
                                                    'bg-orange-500/20 text-orange-400'
                                        }`}>
                                        {currentQuestion?.type} Question
                                    </span>
                                    <h3 className="text-xl font-bold text-text-main">{currentQuestion?.q}</h3>
                                </div>

                                <textarea
                                    className="input-field w-full h-48 resize-none mb-4"
                                    placeholder="Type your answer here... (Speak out loud while typing for better practice)"
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    autoFocus
                                />

                                <button
                                    onClick={handleSubmit}
                                    disabled={userAnswer.length < 5}
                                    className="btn btn-primary w-full disabled:opacity-50"
                                >
                                    Submit Answer
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default InterviewPrep;
