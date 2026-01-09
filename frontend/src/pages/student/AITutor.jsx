import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

function AITutor() {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [gapAnalysis, setGapAnalysis] = useState(null);
    const [loadingGaps, setLoadingGaps] = useState(false);
    const [aiProvider, setAiProvider] = useState('none');

    useEffect(() => {
        setMessages([{
            role: 'assistant',
            content: `👋 Hi ${user?.profile?.name || 'there'}! I'm your AI Learning Tutor.\n\nI can help you:\n• Analyze your skill gaps\n• Get personalized learning recommendations\n• Find the best resources for your goals\n• Plan your learning journey\n\nWhat would you like to work on today?`,
            timestamp: new Date()
        }]);
    }, [user]);

    const loadSkillGaps = async () => {
        setLoadingGaps(true);
        try {
            const skillsRes = await api.get('/skills/user');
            const recsRes = await api.get('/analysis/recommendations');
            const recommendations = recsRes.data.recommendations;

            if (recommendations && recommendations.length > 0) {
                const topRole = recommendations[0];
                const gapRes = await api.post('/analysis/gap', { roleId: topRole.role._id });
                setGapAnalysis(gapRes.data);
            }
        } catch (error) {
            console.error('Error loading skill gaps:', error);
        } finally {
            setLoadingGaps(false);
        }
    };

    const getRecommendations = async () => {
        if (!gapAnalysis) {
            await loadSkillGaps();
        }

        setLoading(true);

        const botMessage = {
            role: 'assistant',
            content: '🤔 Analyzing your skills and generating personalized recommendations...',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);

        try {
            const skillGaps = gapAnalysis?.analysis?.skillBreakdown?.filter(s =>
                s.status === 'below' || s.status === 'missing'
            ).map(s => ({
                skillName: s.skillName,
                currentSCI: s.userSCI || 0,
                targetSCI: s.requiredSCI
            })) || [];

            const res = await api.post('/tutor/recommend', {
                roleId: gapAnalysis?.role?.id,
                skillGaps
            });

            const aiMessage = {
                role: 'assistant',
                content: res.data.recommendations,
                mode: res.data.mode,
                timestamp: new Date()
            };

            if (res.data.provider) {
                setAiProvider(res.data.provider);
            }

            setMessages(prev => [...prev.slice(0, -1), aiMessage]);
        } catch (error) {
            console.error('Error getting recommendations:', error);
            setMessages(prev => [...prev.slice(0, -1), {
                role: 'assistant',
                content: '❌ Sorry, I encountered an error. Please try again or check your Gap Analysis page for manual insights.',
                timestamp: new Date()
            }]);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!inputMessage.trim() || loading) return;

        const userMessage = {
            role: 'user',
            content: inputMessage,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setLoading(true);

        const loadingMessage = {
            role: 'assistant',
            content: '💭 Thinking...',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, loadingMessage]);

        try {
            const conversationHistory = messages.map(m => ({
                role: m.role,
                content: m.content
            }));

            const res = await api.post('/tutor/chat', {
                message: inputMessage,
                conversationHistory
            });

            const aiMessage = {
                role: 'assistant',
                content: res.data.reply,
                mode: res.data.mode,
                timestamp: new Date()
            };

            if (res.data.provider) {
                setAiProvider(res.data.provider);
            }

            setMessages(prev => [...prev.slice(0, -1), aiMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev.slice(0, -1), {
                role: 'assistant',
                content: '❌ Sorry, I encountered an error. Please try again.',
                timestamp: new Date()
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="container">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-text-main mb-2">🤖 AI Learning Tutor</h1>
                <p className="text-text-muted">Your Personal Learning Assistant</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar - Quick Actions */}
                <div className="lg:col-span-1">
                    <div className="card sticky top-4">
                        <h3 className="font-bold mb-4 text-primary-400">Quick Actions</h3>
                        <div className="space-y-2">
                            <button
                                onClick={getRecommendations}
                                disabled={loadingGaps}
                                className="w-full btn btn-primary text-sm py-2.5 justify-center disabled:opacity-50"
                            >
                                {loadingGaps ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="loading-spinner w-4 h-4 border-2"></div>
                                        <span>Loading...</span>
                                    </div>
                                ) : (
                                    '🎯 Get Learning Plan'
                                )}
                            </button>
                            <Link
                                to="/student/gap-analysis"
                                className="w-full btn btn-outline text-sm py-2.5 block text-center justify-center"
                            >
                                📊 Analyze Gaps
                            </Link>
                            <Link
                                to="/student/skills"
                                className="w-full btn btn-outline text-sm py-2.5 block text-center justify-center"
                            >
                                ⚡ Take Assessment
                            </Link>
                        </div>

                        <div className="mt-6 pt-6 border-t border-white/10">
                            <h4 className="text-xs font-bold text-text-main mb-3">💡 Example Questions</h4>
                            <ul className="text-xs text-text-muted space-y-2">
                                <li className="flex items-start">
                                    <span className="text-primary-400 mr-2">•</span>
                                    <span>How do I improve my JavaScript skills?</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary-400 mr-2">•</span>
                                    <span>What should I learn next?</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary-400 mr-2">•</span>
                                    <span>Best free resources for React?</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary-400 mr-2">•</span>
                                    <span>How to prepare for interviews?</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="lg:col-span-3">
                    <div className="card h-[calc(100vh-280px)] flex flex-col p-0 overflow-hidden">
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-5 py-3 ${msg.role === 'user'
                                            ? 'chat-message-user'
                                            : 'chat-message-ai'
                                            }`}
                                    >
                                        <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                                        {msg.mode && (
                                            <div className="text-xs mt-2 opacity-70 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 bg-current rounded-full"></span>
                                                <span>{msg.mode}</span>
                                            </div>
                                        )}
                                        <div className="text-xs mt-1 opacity-50">
                                            {msg.timestamp.toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="border-t border-white/10 p-4 bg-white/5">
                            <div className="flex gap-3">
                                <textarea
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask me anything about learning, skills, or career paths..."
                                    className="flex-1 input-field resize-none"
                                    rows="2"
                                    disabled={loading}
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={loading || !inputMessage.trim()}
                                    className="btn btn-primary px-6 self-end disabled:opacity-50 flex items-center gap-2"
                                >
                                    {loading ? (
                                        <div className="loading-spinner w-5 h-5 border-2"></div>
                                    ) : (
                                        <>
                                            <span>Send</span>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-text-muted mt-2">
                                Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs border border-white/20">Enter</kbd> to send,
                                <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs border border-white/20 ml-1">Shift+Enter</kbd> for new line
                            </p>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="mt-4 card border-primary-500/30 bg-primary-500/10">
                        <div className="flex items-start gap-3">
                            <div className="text-2xl">💡</div>
                            <div>
                                <h4 className="text-sm font-bold text-primary-400 mb-1">About AI Tutor</h4>
                                <p className="text-xs text-text-muted">
                                    Your AI Tutor analyzes your skill gaps and provides personalized recommendations.
                                    For best results, take assessments and complete your Gap Analysis first.
                                    {aiProvider === 'groq' && ' ⚡ Powered by Groq (Lightning fast!)'}
                                    {aiProvider === 'openai' && ' Powered by OpenAI'}
                                    {aiProvider === 'none' && ' Currently running in rule-based mode.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AITutor;
