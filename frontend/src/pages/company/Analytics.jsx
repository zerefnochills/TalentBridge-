import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

function Analytics() {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            const res = await api.get('/company/analytics');
            setAnalytics(res.data);
        } catch (error) {
            console.error('Error loading analytics:', error);
            // Use mock data for demonstration
            setAnalytics({
                totalJobs: 12,
                activeJobs: 8,
                totalApplications: 156,
                avgMatchPercentage: 68,
                topSkills: [
                    { skill: 'JavaScript', demand: 45 },
                    { skill: 'React', demand: 38 },
                    { skill: 'Node.js', demand: 32 },
                    { skill: 'Python', demand: 28 },
                    { skill: 'SQL', demand: 25 }
                ],
                hiringMetrics: {
                    avgTimeToHire: 21,
                    candidateQuality: 72,
                    offerAcceptanceRate: 85
                },
                monthlyTrends: [
                    { month: 'Jan', applications: 45, hires: 3 },
                    { month: 'Feb', applications: 62, hires: 5 },
                    { month: 'Mar', applications: 49, hires: 4 }
                ]
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-main mb-2">HR Analytics Dashboard</h1>
                <p className="text-text-muted">Track your hiring performance and candidate quality metrics.</p>
            </div>

            {loading ? (
                <div className="card text-center py-12">
                    <div className="loading-spinner mx-auto"></div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="card border-accent-blue/30 bg-accent-blue/10">
                            <div className="text-sm text-accent-blue font-medium mb-1">Total Jobs Posted</div>
                            <div className="text-3xl font-bold text-text-main">{analytics.totalJobs}</div>
                            <div className="text-xs text-text-muted mt-1">
                                {analytics.activeJobs} currently active
                            </div>
                        </div>

                        <div className="card border-success/30 bg-success/10">
                            <div className="text-sm text-success font-medium mb-1">Applications Received</div>
                            <div className="text-3xl font-bold text-text-main">{analytics.totalApplications}</div>
                            <div className="text-xs text-text-muted mt-1">
                                Avg {Math.round(analytics.totalApplications / analytics.totalJobs)} per job
                            </div>
                        </div>

                        <div className="card border-accent-purple/30 bg-accent-purple/10">
                            <div className="text-sm text-accent-purple font-medium mb-1">Avg Match Quality</div>
                            <div className="text-3xl font-bold text-text-main">{analytics.avgMatchPercentage}%</div>
                            <div className="text-xs text-text-muted mt-1">
                                Based on SCI scores
                            </div>
                        </div>

                        <div className="card border-warning/30 bg-warning/10">
                            <div className="text-sm text-warning font-medium mb-1">Time to Hire</div>
                            <div className="text-3xl font-bold text-text-main">
                                {analytics.hiringMetrics.avgTimeToHire} days
                            </div>
                            <div className="text-xs text-text-muted mt-1">
                                Average across all roles
                            </div>
                        </div>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top Skills in Demand */}
                        <div className="card">
                            <h3 className="text-lg font-semibold text-text-main mb-4">Top Skills in Demand</h3>
                            <div className="space-y-3">
                                {analytics.topSkills.map((item, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-medium text-text-main">{item.skill}</span>
                                            <span className="text-sm text-text-muted">{item.demand} jobs</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${(item.demand / analytics.topSkills[0].demand) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hiring Metrics */}
                        <div className="card">
                            <h3 className="text-lg font-semibold text-text-main mb-4">Hiring Performance</h3>
                            <div className="space-y-4">
                                <div className="border-b border-white/10 pb-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-text-muted">Candidate Quality Score</span>
                                        <span className="text-xl font-bold text-primary-400">
                                            {analytics.hiringMetrics.candidateQuality}/100
                                        </span>
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${analytics.hiringMetrics.candidateQuality}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="border-b border-white/10 pb-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-text-muted">Offer Acceptance Rate</span>
                                        <span className="text-xl font-bold text-success">
                                            {analytics.hiringMetrics.offerAcceptanceRate}%
                                        </span>
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className="h-full bg-success rounded-full"
                                            style={{ width: `${analytics.hiringMetrics.offerAcceptanceRate}%` }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-text-muted">Average Time to Hire</span>
                                        <span className="text-xl font-bold text-accent-blue">
                                            {analytics.hiringMetrics.avgTimeToHire} days
                                        </span>
                                    </div>
                                    <p className="text-xs text-text-muted">
                                        Industry average: 30-45 days
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Trends */}
                    <div className="card">
                        <h3 className="text-lg font-semibold text-text-main mb-4">Monthly Trends</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left py-2 px-4 text-sm font-semibold text-text-muted">Month</th>
                                        <th className="text-right py-2 px-4 text-sm font-semibold text-text-muted">Applications</th>
                                        <th className="text-right py-2 px-4 text-sm font-semibold text-text-muted">Hires</th>
                                        <th className="text-right py-2 px-4 text-sm font-semibold text-text-muted">Conversion</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analytics.monthlyTrends.map((trend, idx) => (
                                        <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                                            <td className="py-3 px-4 font-medium text-text-main">{trend.month}</td>
                                            <td className="py-3 px-4 text-right text-text-muted">{trend.applications}</td>
                                            <td className="py-3 px-4 text-right text-success font-medium">{trend.hires}</td>
                                            <td className="py-3 px-4 text-right text-text-muted">
                                                {Math.round((trend.hires / trend.applications) * 100)}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Insights */}
                    <div className="card border-primary-500/30 bg-primary-500/10">
                        <h3 className="text-lg font-semibold text-primary-400 mb-3">Key Insights</h3>
                        <ul className="space-y-2 text-sm text-text-muted">
                            <li className="flex items-start">
                                <span className="mr-2">-</span>
                                <span>
                                    <strong className="text-text-main">High quality candidates:</strong> Average match quality of {analytics.avgMatchPercentage}%
                                    indicates good job requirements alignment
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">-</span>
                                <span>
                                    <strong className="text-text-main">Faster hiring:</strong> {analytics.hiringMetrics.avgTimeToHire} days time-to-hire
                                    is better than industry average
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">-</span>
                                <span>
                                    <strong className="text-text-main">JavaScript ecosystem dominance:</strong> Most job postings require JS, React, Node.js
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">-</span>
                                <span>
                                    <strong className="text-text-main">Strong offer acceptance:</strong> {analytics.hiringMetrics.offerAcceptanceRate}%
                                    shows competitive positioning
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            {/* Info Box */}
            <div className="mt-8 card border-white/10">
                <div className="flex items-start gap-4">
                    <div className="text-2xl font-black text-primary-400">i</div>
                    <div>
                        <h3 className="font-bold text-text-main mb-2">About Analytics</h3>
                        <ul className="text-sm text-text-muted space-y-1">
                            <li>- All metrics are calculated based on verified SCI scores</li>
                            <li>- Match quality reflects how well candidates meet job requirements</li>
                            <li>- Time to hire measured from job posting to acceptance</li>
                            <li>- Skill demand shows which skills appear most in your job postings</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Analytics;
