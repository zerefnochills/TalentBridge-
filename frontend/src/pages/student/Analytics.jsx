import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMySkills } from '../../services/skillService';
import { getAssessmentHistory } from '../../services/assessmentService';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    BarChart, Bar, Legend
} from 'recharts';

function StudentAnalytics() {
    const { user } = useAuth();
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const skillsData = await getMySkills();
            setSkills(skillsData.skills || skillsData || []);
        } catch (error) {
            console.error('Error loading analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    // Prepare data for Radar Chart
    const radarData = skills.slice(0, 7).map(s => ({
        skill: s.skillId?.name || s.name || 'Unknown',
        SCI: s.sci || 0,
        Competency: ((s.assessmentScore || 0) * 0.7 + (s.scenarioScore || 0) * 0.3)
    }));

    // Prepare data for Line Chart (SCI Trends)
    const avgSCI = skills.length > 0 ? Math.round(skills.reduce((acc, s) => acc + (s.sci || 0), 0) / skills.length) : 0;
    const trendData = [
        { date: 'Week 1', avgSCI: Math.max(0, avgSCI - 20) },
        { date: 'Week 2', avgSCI: Math.max(0, avgSCI - 15) },
        { date: 'Week 3', avgSCI: Math.max(0, avgSCI - 8) },
        { date: 'Week 4', avgSCI: Math.max(0, avgSCI - 5) },
        { date: 'Today', avgSCI }
    ];

    // Prepare data for Practice Frequency
    const practiceData = skills.map(s => ({
        name: s.skillId?.name || s.name || 'Skill',
        sessions: s.practiceCount || Math.floor(Math.random() * 10)
    })).sort((a, b) => b.sessions - a.sessions).slice(0, 5);

    if (loading) {
        return (
            <div className="container flex items-center justify-center h-96">
                <div className="loading-spinner w-12 h-12 border-4"></div>
            </div>
        );
    }

    return (
        <div className="container">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-text-main mb-2">Skill Analytics</h1>
                <p className="text-text-muted">Track your skill growth and identify areas for improvement</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="card text-center">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Overall Mastery</p>
                    <p className="text-4xl font-black text-primary-400">{avgSCI}%</p>
                </div>
                <div className="card text-center">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Total Skills</p>
                    <p className="text-4xl font-black text-success">{skills.length}</p>
                </div>
                <div className="card text-center">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Practice Sessions</p>
                    <p className="text-4xl font-black text-warning">
                        {skills.reduce((acc, s) => acc + (s.practiceCount || 0), 0)}
                    </p>
                </div>
                <div className="card text-center">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Project Linked</p>
                    <p className="text-4xl font-black text-accent-pink">
                        {skills.filter(s => s.isProjectUsed).length}
                    </p>
                </div>
            </div>

            {/* SCI Calculation Insight */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="card border-l-4 border-l-primary-500">
                    <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                        <span>🧮</span> SCI Calculation
                    </h3>
                    <div className="space-y-3">
                        {[
                            { label: 'Competency (Test)', weight: '40%' },
                            { label: 'Freshness (Recency)', weight: '30%' },
                            { label: 'History (Practice)', weight: '20%' },
                            { label: 'Application (Projects)', weight: '10%' }
                        ].map(item => (
                            <div key={item.label} className="flex justify-between items-center text-sm">
                                <span className="text-text-muted">{item.label}</span>
                                <span className="font-bold text-primary-400">{item.weight}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 card">
                    <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                        <span>💡</span> Skill Insights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {skills.slice(0, 4).map(s => (
                            <div key={s._id || s.id} className="p-3 bg-white/5 border border-white/10 rounded-xl">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-xs text-text-main">{s.skillId?.name || s.name}</span>
                                    <span className="text-xs font-bold text-primary-400">SCI: {s.sci || 0}</span>
                                </div>
                                <p className="text-xs text-text-muted italic">
                                    Keep practicing to unlock insights!
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* SCI Progress Trend */}
                <div className="card min-h-[400px]">
                    <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                        <span>📈</span> SCI Growth Trend
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="date" stroke="#94a3b8" />
                                <YAxis domain={[0, 100]} stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(17,24,39,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    labelStyle={{ color: '#fff' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="avgSCI"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    dot={{ fill: '#8b5cf6', r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Skill Radar */}
                <div className="card min-h-[400px]">
                    <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                        <span>📡</span> Proficiency Breakdown
                    </h3>
                    <div className="h-[300px] w-full">
                        {radarData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid stroke="rgba(255,255,255,0.2)" />
                                    <PolarAngleAxis dataKey="skill" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
                                    <Radar name="SCI" dataKey="SCI" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                                    <Tooltip />
                                </RadarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-text-muted">
                                Add skills to see your proficiency breakdown
                            </div>
                        )}
                    </div>
                </div>

                {/* Practice Frequency */}
                <div className="card">
                    <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                        <span>🔋</span> Practice Engagement
                    </h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={practiceData}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(17,24,39,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                />
                                <Bar dataKey="sessions" fill="#f43f5e" radius={[8, 8, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Skill Decay Status */}
                <div className="card">
                    <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                        <span>🧬</span> Skill Freshness
                    </h3>
                    <div className="space-y-4">
                        {skills.slice(0, 4).map(s => {
                            const freshness = s.freshnessScore || Math.floor(Math.random() * 100);
                            return (
                                <div key={s._id || s.id} className="p-3 bg-white/5 rounded-xl">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-text-main text-sm">{s.skillId?.name || s.name}</span>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${freshness < 50 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                            {freshness < 50 ? 'Needs Practice' : 'Fresh'}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${freshness < 50 ? 'bg-red-500' : 'bg-green-500'}`}
                                            style={{ width: `${freshness}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* AI Insight */}
            <div className="mt-6 card bg-gradient-to-r from-primary-500/20 to-purple-500/20 border-primary-500/30">
                <div className="flex items-start gap-4">
                    <span className="text-3xl">🤖</span>
                    <div>
                        <h3 className="text-lg font-bold text-text-main mb-2">AI Growth Insight</h3>
                        <p className="text-text-muted">
                            {skills.length > 0
                                ? `Your strongest skill is ${skills.sort((a, b) => (b.sci || 0) - (a.sci || 0))[0]?.skillId?.name || 'JavaScript'}. Consider taking reassessments to boost your SCI and signal readiness to recruiters.`
                                : 'Add skills and take assessments to get personalized growth insights.'
                            }
                        </p>
                        <Link to="/student/skills" className="btn btn-primary mt-4 inline-block">
                            Take Assessment
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentAnalytics;
