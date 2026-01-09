import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

function Profile() {
    const { user, loadUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        accountType: 'Student',
        githubLink: '',
        linkedinLink: '',
        portfolioLink: '',
        education: '',
        experience: 0,
        careerGoals: '',
        profilePhoto: ''
    });

    useEffect(() => {
        if (user && user.profile) {
            setFormData({
                name: user.profile.name || '',
                username: user.profile.username || '',
                accountType: user.profile.accountType || 'Student',
                githubLink: user.profile.githubLink || '',
                linkedinLink: user.profile.linkedinLink || '',
                portfolioLink: user.profile.portfolioLink || '',
                education: user.profile.education || '',
                experience: user.profile.experience || 0,
                careerGoals: user.profile.careerGoals || '',
                profilePhoto: user.profile.profilePhoto || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const value = e.target.name === 'experience' ? parseInt(e.target.value) || 0 : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setError('');

        try {
            await api.put('/auth/profile', { profile: formData });
            await loadUser();
            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-text-main mb-2">My Profile</h1>
                <p className="text-text-muted">Manage your professional identity</p>
            </div>

            {success && (
                <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
                    <span className="text-xl">✅</span>
                    <span className="font-medium">{success}</span>
                </div>
            )}

            {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
                    <span className="text-xl">❌</span>
                    <span className="font-medium">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Avatar & Account Type */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="card text-center">
                        <div className="relative inline-block group mb-6">
                            <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white text-5xl font-black mx-auto">
                                {formData.profilePhoto ? (
                                    <img src={formData.profilePhoto} alt="Profile" className="w-full h-full object-cover rounded-full" />
                                ) : (
                                    formData.name[0]?.toUpperCase() || '?'
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 text-left">
                            <div>
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Account Type</label>
                                <div className="flex p-1 bg-white/5 rounded-xl">
                                    {['Student', 'Self-learner', 'Professional'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, accountType: type })}
                                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${formData.accountType === type
                                                ? 'bg-primary-500 text-white'
                                                : 'text-text-muted hover:text-text-main'}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Username</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">@</span>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="input-field pl-8"
                                        placeholder="username"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="card">
                        <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">
                            <span>🔗</span> Social Links
                        </h3>
                        <div className="space-y-4">
                            {[
                                { name: 'githubLink', label: 'GitHub', icon: '🐙', placeholder: 'github.com/username' },
                                { name: 'linkedinLink', label: 'LinkedIn', icon: '💼', placeholder: 'linkedin.com/in/username' },
                                { name: 'portfolioLink', label: 'Portfolio', icon: '🌐', placeholder: 'yourwebsite.com' }
                            ].map(link => (
                                <div key={link.name}>
                                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">{link.label}</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2">{link.icon}</span>
                                        <input
                                            type="url"
                                            name={link.name}
                                            value={formData[link.name]}
                                            onChange={handleChange}
                                            className="input-field pl-10 text-sm"
                                            placeholder={link.placeholder}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Personal Info */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="card">
                        <h3 className="font-bold text-text-main mb-6 flex items-center gap-2">
                            <span>📝</span> Personal Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Full Name</label>
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
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Education</label>
                                <input
                                    type="text"
                                    name="education"
                                    value={formData.education}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="University or Degree"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Experience (Years)</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    name="experience"
                                    min="0"
                                    max="40"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    className="flex-1 accent-primary-500"
                                />
                                <span className="w-12 h-12 flex items-center justify-center bg-primary-500/20 text-primary-400 font-bold rounded-xl text-lg">
                                    {formData.experience}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Career Goals & Bio</label>
                            <textarea
                                name="careerGoals"
                                value={formData.careerGoals}
                                onChange={handleChange}
                                className="input-field h-32 resize-none"
                                placeholder="Describe your career aspirations and what you're passionate about..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-xs text-text-muted max-w-sm">
                            Your profile is used for career recommendations and skill gap analysis.
                        </p>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary px-8 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Update Profile'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Profile;
