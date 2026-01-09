import { useState } from "react";
import SCIBreakdown from "./SCIBreakdown";

function SCI() {
    const [skillLevel, setSkillLevel] = useState(70);
    const [lastUsedDate, setLastUsedDate] = useState("2024-12-01");
    const [proofScore, setProofScore] = useState(60);
    const [sci, setSci] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const calculateSCI = async () => {
        console.log("SCI button clicked");
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("http://localhost:5000/api/sci/calculate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    skillLevel,
                    lastUsedDate,
                    proofScore,
                }),
            });

            const data = await response.json();
            setSci(data.sciScore);
        } catch (err) {
            console.error("Error calculating SCI:", err);
            setError("Failed to calculate SCI. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getSCIColor = (score) => {
        if (score >= 80) return "text-green-600";
        if (score >= 60) return "text-blue-600";
        if (score >= 40) return "text-yellow-600";
        return "text-red-600";
    };

    const getSCILevel = (score) => {
        if (score >= 80) return "Expert";
        if (score >= 60) return "Proficient";
        if (score >= 40) return "Intermediate";
        if (score >= 20) return "Beginner";
        return "Novice";
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-6 text-gray-800">Calculate Your SCI</h2>

                {/* Skill Level Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Skill Level (0-100)
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={skillLevel}
                        onChange={(e) => setSkillLevel(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span>0</span>
                        <span className="font-bold text-primary-600">{skillLevel}</span>
                        <span>100</span>
                    </div>
                </div>

                {/* Last Used Date Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Used Date
                    </label>
                    <input
                        type="date"
                        value={lastUsedDate}
                        onChange={(e) => setLastUsedDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>

                {/* Proof Score Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Proof/Assessment Score (0-100)
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={proofScore}
                        onChange={(e) => setProofScore(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span>0</span>
                        <span className="font-bold text-primary-600">{proofScore}</span>
                        <span>100</span>
                    </div>
                </div>

                {/* Calculate Button */}
                <button
                    onClick={calculateSCI}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Calculating..." : "Calculate SCI"}
                </button>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}
            </div>

            {/* SCI Result */}
            {sci !== null && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Your SCI Score</h3>

                    <div className="flex items-center justify-center mb-6">
                        <div className="relative w-32 h-32">
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke="#e5e7eb"
                                    strokeWidth="12"
                                    fill="none"
                                />
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke="url(#gradient)"
                                    strokeWidth="12"
                                    fill="none"
                                    strokeDasharray={`${(sci / 100) * 352} 352`}
                                    strokeLinecap="round"
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#6366f1" />
                                        <stop offset="100%" stopColor="#a855f7" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-3xl font-black ${getSCIColor(sci)}`}>{Math.round(sci)}</span>
                                <span className="text-xs text-gray-500">SCI</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <span className={`text-lg font-bold ${getSCIColor(sci)}`}>
                            {getSCILevel(sci)}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">
                            Your Skill Confidence Index is calculated based on skill level, recency, and proof of competence.
                        </p>
                    </div>

                    {/* Breakdown Component */}
                    <div className="mt-6">
                        <SCIBreakdown
                            skill={{
                                sci: sci,
                                assessmentScore: proofScore,
                                freshnessScore: calculateFreshnessScore(),
                                scenarioScore: proofScore,
                                lastAssessed: new Date()
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );

    function calculateFreshnessScore() {
        if (!lastUsedDate) return 0;
        const now = new Date();
        const lastUsed = new Date(lastUsedDate);
        const diffTime = Math.abs(now - lastUsed);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffMonths = diffDays / 30;

        if (diffMonths < 1) return 100;
        if (diffMonths < 6) return 80;
        if (diffMonths < 12) return 50;
        return 20;
    }
}

export default SCI;
