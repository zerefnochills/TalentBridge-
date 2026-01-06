import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { frontendDeveloperRole } from '../utils/mockData';
import { calculateSkillGap } from '../utils/sciCalculator';

const SkillGap = () => {
    const navigate = useNavigate();
    const [gapAnalysis, setGapAnalysis] = useState(null);

    useEffect(() => {
        // Load SCI result
        const sciResult = JSON.parse(localStorage.getItem('sciResult'));
        if (!sciResult) {
            navigate('/');
            return;
        }

        // Calculate gap
        const gap = calculateSkillGap(
            sciResult.totalSCI,
            frontendDeveloperRole.requiredSkills.JavaScript
        );
        setGapAnalysis(gap);
    }, [navigate]);

    if (!gapAnalysis) return null;

    return (
        <div className="page">
            <div className="container" style={{ maxWidth: '800px' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    Skill Gap Analysis
                </h1>

                {/* Role Card */}
                <div className="card card-glass" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💼</div>
                    <h2>{frontendDeveloperRole.role}</h2>
                    <p style={{ marginTop: '1rem', marginBottom: '0' }}>
                        Analyzing your fit for this role
                    </p>
                </div>

                {/* Comparison */}
                <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                    <div className="stat-card">
                        <div className="stat-value">{gapAnalysis.requiredSCI}</div>
                        <div className="stat-label">Required SCI</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                            For Frontend Developer
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-value">{gapAnalysis.userSCI}</div>
                        <div className="stat-label">Your SCI</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                            JavaScript Proficiency
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-value" style={{
                            background: gapAnalysis.isReady
                                ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                                : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            {gapAnalysis.gap}
                        </div>
                        <div className="stat-label">Gap Points</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                            Points to improve
                        </div>
                    </div>
                </div>

                {/* Status Badge */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div className={`badge ${gapAnalysis.isReady ? 'badge-success' : 'badge-danger'}`}
                        style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}>
                        {gapAnalysis.isReady ? '✅ Ready for Role' : '❌ Not Ready Yet'}
                    </div>
                </div>

                {/* Message */}
                <div className="card card-glass" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '0' }}>
                        {gapAnalysis.message}
                    </p>
                </div>

                {/* Recommendations */}
                {!gapAnalysis.isReady && (
                    <>
                        <h3 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            📚 Recommended Actions
                        </h3>

                        <div className="card card-glass">
                            <ul className="recommendations">
                                {frontendDeveloperRole.recommendations.map((rec, index) => (
                                    <li key={index}>{rec}</li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}

                {/* Action Buttons */}
                <div style={{ marginTop: '2rem' }}>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/skill-input')}
                        style={{ width: '100%', marginBottom: '1rem' }}
                    >
                        {gapAnalysis.isReady ? 'Re-assess Your Skills' : 'Retake Assessment'}
                    </button>

                    <button
                        className="btn btn-outline"
                        onClick={() => navigate('/result')}
                        style={{ width: '100%' }}
                    >
                        View SCI Breakdown
                    </button>
                </div>

                {/* Footer Note */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '3rem',
                    padding: '1.5rem',
                    background: 'rgba(102, 126, 234, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(102, 126, 234, 0.3)'
                }}>
                    <p style={{ fontSize: '0.9rem', marginBottom: '0' }}>
                        💡 <strong>Prototype Note:</strong> This demo focuses on JavaScript assessment only.
                        The full system would support multiple skills and roles.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SkillGap;
