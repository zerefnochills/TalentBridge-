import React from 'react';

function SCIBreakdown({ skill }) {
    if (!skill || skill.sci === undefined) {
        return null;
    }

    const getSCIColor = (sci) => {
        if (sci >= 80) return 'bg-green-500';
        if (sci >= 60) return 'bg-blue-500';
        if (sci >= 40) return 'bg-yellow-500';
        if (sci >= 20) return 'bg-orange-500';
        return 'bg-red-500';
    };

    const getSCILabel = (sci) => {
        if (sci >= 80) return 'Expert';
        if (sci >= 60) return 'Proficient';
        if (sci >= 40) return 'Intermediate';
        if (sci >= 20) return 'Beginner';
        return 'Unverified';
    };

    return (
        <div className="space-y-3">
            {/* Overall SCI Score */}
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Skill Confidence Index (SCI)</span>
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{Math.round(skill.sci)}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getSCIColor(skill.sci)}`}>
                        {getSCILabel(skill.sci)}
                    </span>
                </div>
            </div>

            {/* SCI Formula Breakdown */}
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs">
                <div className="font-medium text-gray-700 mb-2">
                    SCI = (Assessment × 0.4) + (Freshness × 0.35) + (Scenario × 0.25)
                </div>
                <div className="space-y-1 text-gray-600">
                    <div className="flex justify-between">
                        <span>Assessment Score:</span>
                        <span className="font-medium">{skill.assessmentScore || 0} × 0.4 = {((skill.assessmentScore || 0) * 0.4).toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Freshness Score:</span>
                        <span className="font-medium">{skill.freshnessScore || 0} × 0.35 = {((skill.freshnessScore || 0) * 0.35).toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Scenario Score:</span>
                        <span className="font-medium">{skill.scenarioScore || 0} × 0.25 = {((skill.scenarioScore || 0) * 0.25).toFixed(1)}</span>
                    </div>
                </div>
            </div>

            {/* Visual Breakdown */}
            <div className="space-y-2">
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span>Assessment ({skill.assessmentScore || 0})</span>
                        <span>40%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${skill.assessmentScore || 0}%` }}
                        />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span>Freshness ({skill.freshnessScore || 0})</span>
                        <span>35%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${skill.freshnessScore || 0}%` }}
                        />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span>Scenario ({skill.scenarioScore || 0})</span>
                        <span>25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${skill.scenarioScore || 0}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Last Updated */}
            {skill.lastAssessed && (
                <div className="text-xs text-gray-500 pt-2 border-t">
                    Last assessed: {new Date(skill.lastAssessed).toLocaleDateString()}
                </div>
            )}
        </div>
    );
}

export default SCIBreakdown;
