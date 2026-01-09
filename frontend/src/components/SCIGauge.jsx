import React, { useEffect, useState } from 'react';

const SCIGauge = ({ score = 0, label = "Skill Confidence Index" }) => {
    const [animatedScore, setAnimatedScore] = useState(0);

    useEffect(() => {
        // Animate the score on mount
        const timer = setTimeout(() => {
            setAnimatedScore(score);
        }, 100);
        return () => clearTimeout(timer);
    }, [score]);

    // Calculate the stroke dash offset
    // The arc is 180 degrees (half circle), which is 141.4 units
    const circumference = 141.4;
    const offset = circumference - (circumference * animatedScore / 100);

    return (
        <div className="relative w-60 h-40 flex justify-center items-end">
            <svg className="w-full h-full" viewBox="0 0 100 60">
                <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Background arc */}
                <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth="8"
                    strokeLinecap="round"
                />

                {/* Progress arc */}
                <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="url(#gaugeGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    filter="url(#glow)"
                    style={{
                        transition: 'stroke-dashoffset 1s ease-out',
                    }}
                />
            </svg>

            {/* Score display */}
            <div className="absolute bottom-0 text-center">
                <span className="text-5xl font-extrabold text-text-main block leading-none">
                    {Math.round(animatedScore)}
                </span>
                <span className="text-sm text-text-muted font-medium">
                    {label}
                </span>
            </div>
        </div>
    );
};

export default SCIGauge;
