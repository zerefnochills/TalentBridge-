import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student',
        name: '',
        education: '',
        experience: '',
        careerGoals: '',
        companyName: '',
        industry: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const profile = formData.role === 'student'
                ? {
                    name: formData.name,
                    education: formData.education,
                    experience: parseInt(formData.experience) || 0,
                    careerGoals: formData.careerGoals
                }
                : {
                    name: formData.name,
                    companyName: formData.companyName,
                    industry: formData.industry
                };

            await register(formData.email, formData.password, formData.role, profile);
            navigate(formData.role === 'student' ? '/student/dashboard' : '/company/dashboard');
        } catch (err) {
            if (err.isNetworkError) {
                setError('Cannot connect to server. Please ensure the backend is running.');
            } else if (err.response) {
                setError(err.response.data?.message || 'Registration failed. Please try again.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-gradient-to-br from-dark-main to-dark-secondary">
            {/* Animated Background Blobs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-blue/20 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl"></div>

            <div className="max-w-3xl w-full relative z-10 animate-slide-up">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/login">
                        <div className="text-5xl font-black text-gradient mb-2 cursor-pointer hover:scale-105 transition-transform">
                            TalentBridge
                        </div>
                    </Link>
                    <p className="text-text-muted font-medium">Join the Skill-First Revolution</p>
                </div>

                {/* Register Card */}
                <div className="card">
                    <h2 className="text-3xl font-bold text-text-main mb-6 text-center">Create Account</h2>

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

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Role Selection */}
                        <div>
                            <label className="block text-text-main font-bold mb-3">I am a:</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'student' })}
                                    className={`relative overflow-hidden py-4 px-6 rounded-xl border-2 font-semibold transition-all duration-300 ${formData.role === 'student'
                                        ? 'border-primary-500 bg-primary-500/20 text-text-main'
                                        : 'border-white/10 hover:border-primary-500/50 text-text-muted'
                                        }`}
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-3xl">🎓</span>
                                        <span>Student / Job Seeker</span>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'company' })}
                                    className={`relative overflow-hidden py-4 px-6 rounded-xl border-2 font-semibold transition-all duration-300 ${formData.role === 'company'
                                        ? 'border-primary-500 bg-primary-500/20 text-text-main'
                                        : 'border-white/10 hover:border-primary-500/50 text-text-muted'
                                        }`}
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-3xl">🏢</span>
                                        <span>Company / HR</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Common Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-text-main font-semibold mb-2">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-text-main font-semibold mb-2">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-text-main font-semibold mb-2">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Minimum 6 characters"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-text-main font-semibold mb-2">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Re-enter password"
                                    required
                                />
                            </div>
                        </div>

                        {/* Student-specific fields */}
                        {formData.role === 'student' && (
                            <div className="space-y-4 p-5 bg-primary-500/10 rounded-xl border border-primary-500/30">
                                <h3 className="font-bold text-primary-400 flex items-center gap-2">
                                    <span>🎓</span>
                                    <span>Student Information</span>
                                </h3>
                                <div>
                                    <label className="block text-text-main font-semibold mb-2">Education</label>
                                    <input
                                        type="text"
                                        name="education"
                                        value={formData.education}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="e.g., B.Tech in Computer Science"
                                    />
                                </div>
                                <div>
                                    <label className="block text-text-main font-semibold mb-2">Years of Experience</label>
                                    <input
                                        type="number"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        className="input-field"
                                        min="0"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-text-main font-semibold mb-2">Career Goals</label>
                                    <textarea
                                        name="careerGoals"
                                        value={formData.careerGoals}
                                        onChange={handleChange}
                                        className="input-field"
                                        rows="3"
                                        placeholder="What are your career aspirations?"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Company-specific fields */}
                        {formData.role === 'company' && (
                            <div className="space-y-4 p-5 bg-primary-500/10 rounded-xl border border-primary-500/30">
                                <h3 className="font-bold text-primary-400 flex items-center gap-2">
                                    <span>🏢</span>
                                    <span>Company Information</span>
                                </h3>
                                <div>
                                    <label className="block text-text-main font-semibold mb-2">Company Name</label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="Your Company Ltd."
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-text-main font-semibold mb-2">Industry</label>
                                    <input
                                        type="text"
                                        name="industry"
                                        value={formData.industry}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="e.g., Technology, Finance, Healthcare"
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full text-lg py-4 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-3">
                                    <div className="loading-spinner w-5 h-5 border-2"></div>
                                    <span>Creating your account...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <span>Create Account</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </div>
                            )}
                        </button>

                        <div className="text-center pt-4 border-t border-white/10">
                            <p className="text-text-muted">
                                Already have an account?{' '}
                                <Link to="/login" className="text-primary-400 font-bold hover:text-primary-300">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
