import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

function CompanyProfile() {
    const { user, loadUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        companyName: '',
        industry: '',
        companySize: '1-10',
        foundedYear: '',
        location: '',
        website: '',
        description: '',
        linkedinCompany: '',
        twitterCompany: '',
        githubOrg: '',
        profilePhoto: ''
    });

    useEffect(() => {
        if (user && user.profile) {
            setFormData({
                name: user.profile.name || '',
                companyName: user.profile.companyName || '',
                industry: user.profile.industry || '',
                companySize: user.profile.companySize || '1-10',
                foundedYear: user.profile.foundedYear || '',
                location: user.profile.location || '',
                website: user.profile.website || '',
                description: user.profile.description || '',
                linkedinCompany: user.profile.linkedinCompany || '',
                twitterCompany: user.profile.twitterCompany || '',
                githubOrg: user.profile.githubOrg || '',
                profilePhoto: user.profile.profilePhoto || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setError('');

        try {
            await api.put('/auth/profile', { profile: formData });
            await loadUser();
            setSuccess('Company profile updated successfully!');
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
                <h1 className="text-3xl font-bold text-text-main mb-2">Company Profile</h1>
                <p className="text-text-muted">Manage your organization's identity</p>
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
                {/* Left Column */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="card text-center">
                        <div className="relative inline-block group mb-6">
                            <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-4xl font-black mx-auto">
                                {formData.profilePhoto ? (
                                    <img src={formData.profilePhoto} alt="Logo" className="w-full h-full object-cover rounded-full" />
                                ) : (
                                    formData.companyName[0]?.toUpperCase() || 'C'
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 text-left">
                            <div>
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Company Size</label>
                                <select
                                    name="companySize"
                                    value={formData.companySize}
                                    onChange={handleChange}
                                    className="input-field"
                                >
                                    {['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'].map(size => (
                                        <option key={size} value={size}>{size} Employees</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Founded Year</label>
                                <input
                                    type="number"
                                    name="foundedYear"
                                    value={formData.foundedYear}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="e.g. 2015"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="card">
                        <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">
                            <span>🌐</span> Social Presence
                        </h3>
                        <div className="space-y-4">
                            {[
                                { name: 'linkedinCompany', label: 'LinkedIn', icon: '💼', placeholder: 'linkedin.com/company/...' },
                                { name: 'twitterCompany', label: 'Twitter / X', icon: '🐦', placeholder: 'twitter.com/...' },
                                { name: 'githubOrg', label: 'GitHub Org', icon: '🐙', placeholder: 'github.com/org' }
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

                {/* Right Column */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="card">
                        <h3 className="font-bold text-text-main mb-6 flex items-center gap-2">
                            <span>📋</span> Company Identity
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Company Name</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Organization Name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Industry</label>
                                <input
                                    type="text"
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="e.g. Fintech, Healthcare"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="City, Country"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Website</label>
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="https://company.com"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Company Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                maxLength="300"
                                className="input-field h-24 resize-none"
                                placeholder="Describe your company mission..."
                            />
                            <div className="flex justify-end mt-1">
                                <span className="text-xs text-text-muted">{formData.description.length}/300</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10">
                            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Recruiter Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Your Name"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <p className="text-xs text-text-muted uppercase tracking-wider">Profile Active</p>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary px-8 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Update Company Profile'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CompanyProfile;
