import React from 'react';
import SkillImportanceSelector from './SkillImportanceSelector';

/**
 * SkillMatchBreakdown - Detailed visualization of per-skill match analysis
 * Shows importance, required vs actual SCI, and pass/fail status
 */
function SkillMatchBreakdown({ skillBreakdown }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'meets':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'below':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            case 'missing':
                return 'bg-red-50 border-red-200 text-red-800';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'meets':
                return '✓';
            case 'below':
                return '⚠';
            case 'missing':
                return '✗';
            default:
                return '?';
        }
    };

    const getStatusText = (status, candidateSCI, minSCI) => {
        switch (status) {
            case 'meets':
                return `Meets requirement (SCI: ${Math.round(candidateSCI)})`;
            case 'below':
                return `Below threshold (SCI: ${Math.round(candidateSCI)} / Required: ${minSCI})`;
            case 'missing':
                return 'Skill not acquired yet';
            default:
                return 'Unknown status';
        }
    };

    if (!skillBreakdown || skillBreakdown.length === 0) {
        return (
            <div className="text-center py-4 text-gray-500">
                No skill breakdown available
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 mb-3">Skill-by-Skill Breakdown</h3>
            {skillBreakdown.map((skill, index) => (
                <div
                    key={index}
                    className={`border rounded-lg p-4 ${getStatusColor(skill.status)}`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-2xl">{getStatusIcon(skill.status)}</span>
                                <h4 className="font-semibold">{skill.skillName}</h4>
                            </div>
                            <p className="text-sm mb-2">
                                {getStatusText(skill.status, skill.candidateSCI, skill.minSCI)}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-bold">
                                {Math.round(skill.score)} / {skill.maxScore}
                            </div>
                            <div className="text-xs text-gray-600">points</div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600 w-20">Importance:</span>
                            <SkillImportanceSelector value={skill.importance} readonly={true} />
                        </div>

                        {skill.status !== 'missing' && (
                            <>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-600 w-20">Progress:</span>
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${skill.status === 'meets' ? 'bg-green-500' : 'bg-yellow-500'
                                                }`}
                                            style={{ width: `${Math.min(skill.candidateSCI, 100)}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs font-medium w-12 text-right">
                                        {Math.round(skill.candidateSCI)}%
                                    </span>
                                </div>

                                {skill.freshnessScore !== undefined && (
                                    <div className="text-xs text-gray-600">
                                        Freshness: {Math.round(skill.freshnessScore)}%
                                        {skill.freshnessScore < 50 && (
                                            <span className="text-orange-600 ml-2">
                                                (Consider reassessment)
                                            </span>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default SkillMatchBreakdown;
