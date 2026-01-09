import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

// Mock Data
const TALENT_STATS = [
    { name: 'JavaScript', count: 120, avgSCI: 78 },
    { name: 'React', count: 85, avgSCI: 65 },
    { name: 'Node.js', count: 64, avgSCI: 62 },
    { name: 'Python', count: 45, avgSCI: 82 },
    { name: 'SQL', count: 90, avgSCI: 70 }
];

const READINESS_FUNNEL = [
    { name: 'Total Students', value: 450 },
    { name: 'Skill Verified', value: 310 },
    { name: 'Job Ready (SCI > 70)', value: 125 },
    { name: 'Shortlisted', value: 35 }
];

const TOP_STUDENTS = [
    { id: 1, name: 'Alice Johnson', topSkill: 'React', sci: 92, status: 'Interviewing' },
    { id: 2, name: 'Bob Smith', topSkill: 'Python', sci: 88, status: 'Ready' },
    { id: 3, name: 'Charlie Davis', topSkill: 'Node.js', sci: 85, status: 'Ready' },
    { id: 4, name: 'Diana Prince', topSkill: 'JavaScript', sci: 84, status: 'Shortlisted' }
];

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

function MentorDashboard() {
    const { user } = useAuth();

    return (
        <div className="container">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-text-main mb-2">Career Mentor Portal</h1>
                <p className="text-text-muted">Monitor talent pool and provide feedback</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="card text-center">
                    <p className="text-xs font-bold text-text-muted uppercase mb-2">Active Students</p>
                    <h2 className="text-3xl font-black text-text-main">1,248</h2>
                    <p className="text-xs text-green-400 mt-2">+12% vs last month</p>
                </div>
                <div className="card text-center">
                    <p className="text-xs font-bold text-text-muted uppercase mb-2">Avg Talent SCI</p>
                    <h2 className="text-3xl font-black text-primary-400">64.2</h2>
                    <div className="w-full bg-white/10 h-1.5 rounded-full mt-4">
                        <div className="bg-primary-500 h-full rounded-full" style={{ width: '64%' }}></div>
                    </div>
                </div>
                <div className="card text-center">
                    <p className="text-xs font-bold text-text-muted uppercase mb-2">Assessments Taken</p>
                    <h2 className="text-3xl font-black text-success">8,421</h2>
                    <p className="text-xs text-text-muted mt-2">Quality validation active</p>
                </div>
                <div className="card text-center">
                    <p className="text-xs font-bold text-text-muted uppercase mb-2">High-Risk Students</p>
                    <h2 className="text-3xl font-black text-error">42</h2>
                    <p className="text-xs text-text-muted mt-2">SCI decay detected</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Skill Market & Student Table */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="card">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-text-main">Skill Prevalence & Proficiency</h3>
                            <span className="text-xs text-text-muted">Updated hourly</span>
                        </div>
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={TALENT_STATS}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(17,24,39,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    />
                                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={35} name="Students" />
                                    <Bar dataKey="avgSCI" fill="#fbbf24" radius={[4, 4, 0, 0]} barSize={15} name="Avg SCI" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Students Table */}
                    <div className="card p-0 overflow-hidden">
                        <div className="p-4 border-b border-white/10 flex justify-between items-center">
                            <h3 className="font-bold text-text-main">Top Ready Students</h3>
                            <Link to="/company/candidates" className="text-xs font-bold text-primary-400 hover:text-primary-300">
                                View All →
                            </Link>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-xs uppercase font-bold text-text-muted tracking-wider">
                                <tr>
                                    <th className="px-4 py-3">Student</th>
                                    <th className="px-4 py-3">Top Skill</th>
                                    <th className="px-4 py-3">SCI</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {TOP_STUDENTS.map(s => (
                                    <tr key={s.id} className="hover:bg-white/5 transition">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center font-bold text-primary-400 text-xs">
                                                    {s.name[0]}
                                                </div>
                                                <span className="font-medium text-text-main">{s.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-text-muted">{s.topSkill}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-text-main">{s.sci}</span>
                                                <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                                                    <div className="bg-primary-500 h-full" style={{ width: `${s.sci}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${s.status === 'Interviewing' ? 'bg-primary-500/20 text-primary-400' :
                                                    s.status === 'Shortlisted' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-green-500/20 text-green-400'
                                                }`}>
                                                {s.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button className="text-xs font-medium py-1 px-3 border border-white/20 rounded-lg hover:bg-white/10 transition">
                                                Feedback
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right: Analytics */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="card">
                        <h3 className="font-bold text-text-main mb-4">Readiness Funnel</h3>
                        <div className="h-[220px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={READINESS_FUNNEL}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {READINESS_FUNNEL.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(17,24,39,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    />
                                    <Legend
                                        wrapperStyle={{ fontSize: '11px' }}
                                        formatter={(value) => <span style={{ color: '#94a3b8' }}>{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Alerts */}
                    <div className="card">
                        <h3 className="font-bold text-text-main mb-4">Growth Alerts</h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-primary-500/10 border-l-4 border-primary-500 rounded-r-xl">
                                <p className="text-xs font-bold text-primary-400 mb-1">New Milestone</p>
                                <p className="text-xs text-text-muted">15 students crossed 80 SCI in 'Python' this week.</p>
                            </div>
                            <div className="p-3 bg-yellow-500/10 border-l-4 border-yellow-500 rounded-r-xl">
                                <p className="text-xs font-bold text-yellow-400 mb-1">Skill Decay Warning</p>
                                <p className="text-xs text-text-muted">Average 'React' SCI for 2024 batch is dropping.</p>
                            </div>
                            <div className="p-3 bg-green-500/10 border-l-4 border-green-500 rounded-r-xl">
                                <p className="text-xs font-bold text-green-400 mb-1">High Demand</p>
                                <p className="text-xs text-text-muted">Companies searching for 'SQL' & 'Data Analysis'.</p>
                            </div>
                        </div>
                        <button className="w-full mt-4 btn btn-primary">
                            Broadcast Learning Mission
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MentorDashboard;
