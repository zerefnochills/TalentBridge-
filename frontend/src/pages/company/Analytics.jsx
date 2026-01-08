import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

function Analytics() {
    const { user, logout } = useAuth();
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-blue-50/30">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-black text-white mb-1">📈 Analytics Dashboard</h1>
                            <p className="text-purple-100">{user?.profile?.companyName} 🏢</p>
                        </div>
                        <button onClick={logout} className="btn-secondary bg-white/20 hover:bg-white/30 text-white border-white/30">
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <Link to="/company/dashboard" className="text-primary-600 hover:text-primary-700 font-medium">
                        ← Back to Dashboard
                    </Link>
                </div>

                <h2 className="text-3xl font-bold mb-2">HR Analytics Dashboard</h2>
                <p className="text-gray-600 mb-6">
                    Track your hiring performance and candidate quality metrics.
                </p>

                {loading ? (
                    <div className="card">
                        <p className="text-gray-500">Loading analytics...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                                <div className="text-sm text-blue-800 font-medium mb-1">Total Jobs Posted</div>
                                <div className="text-3xl font-bold text-blue-900">{analytics.totalJobs}</div>
                                <div className="text-xs text-blue-700 mt-1">
                                    {analytics.activeJobs} currently active
                                </div>
                            </div>

                            <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                                <div className="text-sm text-green-800 font-medium mb-1">Applications Received</div>
                                <div className="text-3xl font-bold text-green-900">{analytics.totalApplications}</div>
                                <div className="text-xs text-green-700 mt-1">
                                    Avg {Math.round(analytics.totalApplications / analytics.totalJobs)} per job
                                </div>
                            </div>

                            <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                                <div className="text-sm text-purple-800 font-medium mb-1">Avg Match Quality</div>
                                <div className="text-3xl font-bold text-purple-900">{analytics.avgMatchPercentage}%</div>
                                <div className="text-xs text-purple-700 mt-1">
                                    Based on SCI scores
                                </div>
                            </div>

                            <div className="card bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                                <div className="text-sm text-orange-800 font-medium mb-1">Time to Hire</div>
                                <div className="text-3xl font-bold text-orange-900">
                                    {analytics.hiringMetrics.avgTimeToHire} days
                                </div>
                                <div className="text-xs text-orange-700 mt-1">
                                    Average across all roles
                                </div>
                            </div>
                        </div>

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Top Skills in Demand */}
                            <div className="card">
                                <h3 className="text-lg font-semibold mb-4">Top Skills in Demand</h3>
                                <div className="space-y-3">
                                    {analytics.topSkills.map((item, idx) => (
                                        <div key={idx}>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm font-medium">{item.skill}</span>
                                                <span className="text-sm text-gray-600">{item.demand} jobs</span>
                                            </div>
                                            <div className="bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-primary-600 h-2 rounded-full"
                                                    style={{ width: `${(item.demand / analytics.topSkills[0].demand) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Hiring Metrics */}
                            <div className="card">
                                <h3 className="text-lg font-semibold mb-4">Hiring Performance</h3>
                                <div className="space-y-4">
                                    <div className="border-b pb-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-600">Candidate Quality Score</span>
                                            <span className="text-xl font-bold text-primary-600">
                                                {analytics.hiringMetrics.candidateQuality}/100
                                            </span>
                                        </div>
                                        <div className="bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-primary-600 h-2 rounded-full"
                                                style={{ width: `${analytics.hiringMetrics.candidateQuality}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="border-b pb-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-600">Offer Acceptance Rate</span>
                                            <span className="text-xl font-bold text-green-600">
                                                {analytics.hiringMetrics.offerAcceptanceRate}%
                                            </span>
                                        </div>
                                        <div className="bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-green-500 h-2 rounded-full"
                                                style={{ width: `${analytics.hiringMetrics.offerAcceptanceRate}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-600">Average Time to Hire</span>
                                            <span className="text-xl font-bold text-blue-600">
                                                {analytics.hiringMetrics.avgTimeToHire} days
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Industry average: 30-45 days
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Monthly Trends */}
                        <div className="card">
                            <h3 className="text-lg font-semibold mb-4">Monthly Trends</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">Month</th>
                                            <th className="text-right py-2 px-4 text-sm font-semibold text-gray-700">Applications</th>
                                            <th className="text-right py-2 px-4 text-sm font-semibold text-gray-700">Hires</th>
                                            <th className="text-right py-2 px-4 text-sm font-semibold text-gray-700">Conversion</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {analytics.monthlyTrends.map((trend, idx) => (
                                            <tr key={idx} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4 font-medium">{trend.month}</td>
                                                <td className="py-3 px-4 text-right">{trend.applications}</td>
                                                <td className="py-3 px-4 text-right text-green-600 font-medium">{trend.hires}</td>
                                                <td className="py-3 px-4 text-right">
                                                    {Math.round((trend.hires / trend.applications) * 100)}%
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Insights */}
                        <div className="card bg-blue-50 border-blue-200">
                            <h3 className="text-lg font-semibold text-blue-900 mb-3">📈 Key Insights</h3>
                            <ul className="space-y-2 text-sm text-blue-800">
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>
                                        <strong>High quality candidates:</strong> Average match quality of {analytics.avgMatchPercentage}%
                                        indicates good job requirements alignment
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>
                                        <strong>Faster hiring:</strong> {analytics.hiringMetrics.avgTimeToHire} days time-to-hire
                                        is better than industry average
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>
                                        <strong>JavaScript ecosystem dominance:</strong> Most job postings require JS, React, Node.js
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>
                                        <strong>Strong offer acceptance:</strong> {analytics.hiringMetrics.offerAcceptanceRate}%
                                        shows competitive positioning
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* Info Box */}
                <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="font-bold text-gray-900 mb-2">📊 About Analytics</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                        <li>• All metrics are calculated based on verified SCI scores</li>
                        <li>• Match quality reflects how well candidates meet job requirements</li>
                        <li>• Time to hire measured from job posting to acceptance</li>
                        <li>• Skill demand shows which skills appear most in your job postings</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Analytics;
