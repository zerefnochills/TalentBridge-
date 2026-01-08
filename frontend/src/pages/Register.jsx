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
            // Handle network errors specifically
            if (err.isNetworkError) {
                setError('Cannot connect to server. Please ensure the backend is running and accessible.');
            } else if (err.isTimeout) {
                setError('Connection timeout. Please check your network connection.');
            } else if (err.response) {
                // Server responded with error
                setError(err.response.data?.message || 'Registration failed. Please try again.');
            } else {
                // Other errors
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-primary-600 mb-2">TalentBridge</h1>
                    <p className="text-gray-600">Create your account</p>
                </div>

                <div className="card">
                    <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Role Selection */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">I am a:</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'student' })}
                                    className={`py-3 px-4 rounded-lg border-2 transition ${formData.role === 'student'
                                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                                        : 'border-gray-300 hover:border-primary-300'
                                        }`}
                                >
                                    Student / Job Seeker
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'company' })}
                                    className={`py-3 px-4 rounded-lg border-2 transition ${formData.role === 'company'
                                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                                        : 'border-gray-300 hover:border-primary-300'
                                        }`}
                                >
                                    Company / HR
                                </button>
                            </div>
                        </div>

                        {/* Common Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                />
                            </div>
                        </div>

                        {/* Student-specific fields */}
                        {formData.role === 'student' && (
                            <>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-medium mb-2">Education</label>
                                    <input
                                        type="text"
                                        name="education"
                                        value={formData.education}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="e.g., B.Tech in Computer Science"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Years of Experience
                                    </label>
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
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-medium mb-2">Career Goals</label>
                                    <textarea
                                        name="careerGoals"
                                        value={formData.careerGoals}
                                        onChange={handleChange}
                                        className="input-field"
                                        rows="3"
                                        placeholder="What are your career aspirations?"
                                    />
                                </div>
                            </>
                        )}

                        {/* Company-specific fields */}
                        {formData.role === 'company' && (
                            <>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-medium mb-2">Company Name</label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-medium mb-2">Industry</label>
                                    <input
                                        type="text"
                                        name="industry"
                                        value={formData.industry}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="e.g., Technology, Finance, Healthcare"
                                    />
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full mb-4"
                        >
                            {loading ? 'Creating account...' : 'Register'}
                        </button>

                        <p className="text-center text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                                Login here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
