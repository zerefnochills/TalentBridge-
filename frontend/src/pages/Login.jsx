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
        <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>

            <div className="max-w-md w-full relative z-10 animate-slide-up">
                {/* Logo/Brand */}
                <div className="text-center mb-10">
                    <div className="inline-block mb-4">
                        <div className="text-6xl font-black bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent 
                                      animate-gradient bg-[length:200%_auto]">
                            TalentBridge
                        </div>
                    </div>
                    <p className="text-gray-600 text-lg font-medium">Skill-First Career & Hiring Platform</p>
                    <div className="mt-2 flex items-center justify-center gap-2">
                        <div className="h-1 w-12 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"></div>
                        <div className="h-1 w-1 bg-primary-500 rounded-full"></div>
                        <div className="h-1 w-1 bg-purple-500 rounded-full"></div>
                    </div>
                </div>

                {/* Login Card */}
                <div className="card-glass hover-lift">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-gradient mb-2">Welcome Back!</h2>
                        <p className="text-gray-600">Login to continue your journey</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 animate-scale-in">
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
                            <label className="block text-gray-700 font-semibold mb-2.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            <label className="block text-gray-700 font-semibold mb-2.5">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            className="btn-primary w-full text-lg py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
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

                        <div className="text-center pt-4 border-t border-gray-200">
                            <p className="text-gray-600">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-gradient font-bold hover:underline">
                                    Register here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Feature Highlights */}
                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                    <div className="group">
                        <div className="bg-gradient-to-br from-primary-100 to-purple-100 w-12 h-12 rounded-xl mx-auto mb-2 
                                      flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <span className="text-2xl">🎯</span>
                        </div>
                        <p className="text-xs font-medium text-gray-600">Skill-First</p>
                    </div>
                    <div className="group">
                        <div className="bg-gradient-to-br from-blue-100 to-cyan-100 w-12 h-12 rounded-xl mx-auto mb-2 
                                      flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <span className="text-2xl">🤖</span>
                        </div>
                        <p className="text-xs font-medium text-gray-600">AI Tutor</p>
                    </div>
                    <div className="group">
                        <div className="bg-gradient-to-br from-pink-100 to-rose-100 w-12 h-12 rounded-xl mx-auto mb-2 
                                      flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <span className="text-2xl">📊</span>
                        </div>
                        <p className="text-xs font-medium text-gray-600">Analytics</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
