import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();

    // Determine which routes to show based on user role
    const isCompany = user?.role === 'company';

    const studentLinks = [
        { path: '/student/dashboard', label: 'Dashboard', icon: 'HOME' },
        { path: '/student/skills', label: 'My Skills', icon: 'SKILLS' },
        { path: '/student/gap-analysis', label: 'Gap Analysis', icon: 'GAP' },
        { path: '/student/ai-tutor', label: 'AI Tutor', icon: 'AI' },
        { path: '/student/navigator', label: 'Navigator', icon: 'NAV' },
        { path: '/student/roadmap', label: 'Roadmap', icon: 'MAP' },
        { path: '/student/analytics', label: 'Analytics', icon: 'CHART' },
        { path: '/student/interview-prep', label: 'Interview Prep', icon: 'MIC' },
        { path: '/student/career', label: 'Career Path', icon: 'PATH' },
        { path: '/student/jobs', label: 'Find Jobs', icon: 'JOBS' },
        { path: '/student/profile', label: 'Profile', icon: 'USER' },
    ];

    const companyLinks = [
        { path: '/company/dashboard', label: 'Dashboard', icon: 'HOME' },
        { path: '/company/mentor', label: 'Mentor Portal', icon: 'TEAM' },
        { path: '/company/create-job', label: 'Post Job', icon: 'POST' },
        { path: '/company/analytics', label: 'Analytics', icon: 'STATS' },
        { path: '/company/team-risk', label: 'Team Risk', icon: 'RISK' },
        { path: '/company/profile', label: 'Profile', icon: 'USER' },
    ];

    const links = isCompany ? companyLinks : studentLinks;

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <span className="text-2xl font-black text-primary-400">TB</span>
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
                        <span className="text-xs font-bold text-primary-400 w-12">{link.icon}</span>
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
                    <span className="text-xs font-bold w-12">EXIT</span>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
