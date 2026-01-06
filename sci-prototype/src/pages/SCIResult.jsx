import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSCIInterpretation } from '../utils/sciCalculator';

const SCIResult = () => {
    const navigate = useNavigate();
    const [sciResult, setSciResult] = useState(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Load SCI result from localStorage
        const result = JSON.parse(localStorage.getItem('sciResult'));
        if (!result) {
            navigate('/');
            return;
        }
        setSciResult(result);

        // Animate progress
        setTimeout(() => {
            setProgress(result.totalSCI);
        }, 100);
    }, [navigate]);

    if (!sciResult) return null;

    const circumference = 2 * Math.PI * 90;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="page">
            <div className="container" style={{ maxWidth: '900px' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    Your Skill Confidence Index
                </h1>

                {/* Circular Progress */}
                <div className="circular-progress">
                    <svg width="200" height="200">
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#667eea" />
                                <stop offset="100%" stopColor="#764ba2" />
                            </linearGradient>
                        </defs>
                        <circle
                            className="bg-circle"
                            cx="100"
                            cy="100"
                            r="90"
                        />
                        <circle
                            className="progress-circle"
                            cx="100"
                            cy="100"
                            r="90"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                        />
                    </svg>
                    <div className="percentage">{sciResult.totalSCI}</div>
                </div>

                {/* Interpretation */}
                <div className="card card-glass" style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '1rem' }}>JavaScript Proficiency</h3>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                        {getSCIInterpretation(sciResult.totalSCI)}
                    </p>
                </div>

                {/* Breakdown */}
                <h3 style={{ textAlign: 'center', marginTop: '3rem', marginBottom: '2rem' }}>
                    Score Breakdown
                </h3>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-value">{sciResult.assessmentScore}%</div>
                        <div className="stat-label">Assessment Score</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                            40% weight
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-value">{sciResult.freshnessScore}%</div>
                        <div className="stat-label">Freshness Score</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                            35% weight
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-value">{sciResult.scenarioScore}%</div>
                        <div className="stat-label">Scenario Score</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                            25% weight
                        </div>
                    </div>
                </div>

                {/* Formula Explanation */}
                <div className="card card-glass" style={{ marginTop: '2rem', background: 'rgba(79, 172, 254, 0.1)' }}>
                    <h4 style={{ marginBottom: '1rem' }}>📊 How We Calculate SCI</h4>
                    <p style={{ fontFamily: 'monospace', fontSize: '0.95rem', marginBottom: '1rem' }}>
                        SCI = (Assessment × 0.4) + (Freshness × 0.35) + (Scenario × 0.25)
                    </p>
                    <p style={{ fontSize: '0.9rem', marginBottom: '0' }}>
                        Your SCI = ({sciResult.assessmentScore} × 0.4) + ({sciResult.freshnessScore} × 0.35) + ({sciResult.scenarioScore} × 0.25) = <strong>{sciResult.totalSCI}</strong>
                    </p>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/skill-gap')}
                    style={{ width: '100%', marginTop: '2rem' }}
                >
                    Analyze Skill Gap for Role
                </button>

                <button
                    className="btn btn-outline"
                    onClick={() => navigate('/skill-input')}
                    style={{ width: '100%', marginTop: '1rem' }}
                >
                    Retake Assessment
                </button>
            </div>
        </div>
    );
};

export default SCIResult;
