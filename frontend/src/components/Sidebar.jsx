import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();

    // Determine which routes to show based on user role
    const isCompany = user?.role === 'company';

    const studentLinks = [
        { path: '/student/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/student/skills', label: 'My Skills', icon: '🎯' },
        { path: '/student/gap-analysis', label: 'Gap Analysis', icon: '📈' },
        { path: '/student/ai-tutor', label: 'AI Tutor', icon: '🤖' },
        { path: '/student/navigator', label: 'Navigator', icon: '🧭' },
        { path: '/student/career', label: 'Career Path', icon: '🚀' },
        { path: '/student/jobs', label: 'Find Jobs', icon: '💼' },
    ];

    const companyLinks = [
        { path: '/company/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/company/jobs', label: 'Job Listings', icon: '📝' },
        { path: '/company/candidates', label: 'Candidates', icon: '👥' },
        { path: '/company/analytics', label: 'Analytics', icon: '📈' },
    ];

    const links = isCompany ? companyLinks : studentLinks;

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <span className="text-2xl">🌉</span>
                <span>TalentBridge</span>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav flex-1">
                {links.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`sidebar-item ${isActive(link.path) ? 'active' : ''}`}
                    >
                        <span className="text-lg">{link.icon}</span>
                        <span>{link.label}</span>
                    </Link>
                ))}
            </nav>

            {/* User Section */}
            <div className="mt-auto pt-4 border-t border-white/10">
                <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center text-white font-bold">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-main truncate">{user?.name || 'User'}</p>
                        <p className="text-xs text-text-muted truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="sidebar-item w-full mt-2 text-danger hover:bg-danger/10"
                >
                    <span className="text-lg">🚪</span>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
