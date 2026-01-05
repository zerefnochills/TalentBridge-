import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SkillInput = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        skill: 'JavaScript',
        lastUsed: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Store skill data in localStorage
        localStorage.setItem('skillData', JSON.stringify(formData));

        // Navigate to assessment
        navigate('/assessment');
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="page">
            <div className="card card-glass" style={{ maxWidth: '600px', width: '100%' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                    Select Your Skill
                </h2>
                <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                    Let's assess your JavaScript proficiency
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Skill to Assess</label>
                        <select
                            name="skill"
                            className="select"
                            value={formData.skill}
                            onChange={handleChange}
                            disabled
                        >
                            <option value="JavaScript">JavaScript</option>
                        </select>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                            * This prototype focuses on JavaScript assessment only
                        </p>
                    </div>

                    <div className="input-group">
                        <label className="input-label">When did you last use this skill?</label>
                        <select
                            name="lastUsed"
                            className="select"
                            value={formData.lastUsed}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select timeframe...</option>
                            <option value="< 1 month">Less than 1 month ago</option>
                            <option value="1-6 months">1-6 months ago</option>
                            <option value="6-12 months">6-12 months ago</option>
                            <option value="> 1 year">More than 1 year ago</option>
                        </select>
                    </div>

                    {formData.lastUsed && (
                        <div style={{
                            padding: '1rem',
                            background: 'rgba(79, 172, 254, 0.1)',
                            borderRadius: '12px',
                            border: '1px solid rgba(79, 172, 254, 0.3)',
                            marginTop: '1rem'
                        }}>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>
                                ℹ️ Skill freshness is a key factor in calculating your Skill Confidence Index (SCI)
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '2rem' }}
                        disabled={!formData.lastUsed}
                    >
                        Start Assessment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SkillInput;
