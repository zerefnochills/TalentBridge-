import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await login(email, password);
            // Redirect based on role
            if (data.user.role === 'student') {
                navigate('/student/dashboard');
            } else {
                navigate('/company/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-gradient-to-br from-dark-main to-dark-secondary">
            {/* Animated Background Blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl"></div>

            <div className="max-w-md w-full relative z-10 animate-slide-up">
                {/* Logo/Brand */}
                <div className="text-center mb-10">
                    <div className="inline-block mb-4">
                        <div className="text-6xl font-black text-gradient">
                            TalentBridge
                        </div>
                    </div>
                    <p className="text-text-muted text-lg font-medium">Skill-First Career & Hiring Platform</p>
                    <div className="mt-3 flex items-center justify-center gap-2">
                        <div className="h-1 w-12 bg-gradient-to-r from-primary-500 to-accent-purple rounded-full"></div>
                        <div className="h-1 w-1 bg-primary-500 rounded-full"></div>
                        <div className="h-1 w-1 bg-accent-purple rounded-full"></div>
                    </div>
                </div>

                {/* Login Card */}
                <div className="card">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-text-main mb-2">Welcome Back!</h2>
                        <p className="text-text-muted">Login to continue your journey</p>
                    </div>

                    {error && (
                        <div className="bg-danger/20 border border-danger/50 text-danger px-4 py-3 rounded-xl mb-6 animate-scale-in">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">{error}</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-text-main font-semibold mb-2.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field pl-10"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-text-main font-semibold mb-2.5">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field pl-10"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full text-lg py-3.5 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-3">
                                    <div className="loading-spinner w-5 h-5 border-2"></div>
                                    <span>Logging in...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <span>Login</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </div>
                            )}
                        </button>

                        <div className="text-center pt-4 border-t border-white/10">
                            <p className="text-text-muted">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-primary-400 font-bold hover:text-primary-300">
                                    Register here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Feature Highlights */}
                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                    <div className="group">
                        <div className="bg-gradient-to-br from-primary-500/30 to-accent-purple/30 w-12 h-12 rounded-xl mx-auto mb-2 
                                      flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/10">
                            <span className="text-2xl">🎯</span>
                        </div>
                        <p className="text-xs font-medium text-text-muted">Skill-First</p>
                    </div>
                    <div className="group">
                        <div className="bg-gradient-to-br from-accent-blue/30 to-accent-cyan/30 w-12 h-12 rounded-xl mx-auto mb-2 
                                      flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/10">
                            <span className="text-2xl">🤖</span>
                        </div>
                        <p className="text-xs font-medium text-text-muted">AI Tutor</p>
                    </div>
                    <div className="group">
                        <div className="bg-gradient-to-br from-accent-pink/30 to-accent-rose/30 w-12 h-12 rounded-xl mx-auto mb-2 
                                      flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/10">
                            <span className="text-2xl">📊</span>
                        </div>
                        <p className="text-xs font-medium text-text-muted">Analytics</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
