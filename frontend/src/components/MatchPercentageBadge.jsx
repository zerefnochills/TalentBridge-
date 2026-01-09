import React from 'react';

/**
 * MatchPercentageBadge - Large, prominent circular badge showing skill match percentage
 * Color-coded based on match level
 */
function MatchPercentageBadge({ percentage, size = 'large', showLabel = true }) {
    // Defensive check for undefined or null percentage
    const safePercentage = typeof percentage === 'number' ? Math.round(percentage) : 0;

    const getMatchColor = () => {
        if (safePercentage >= 80) return 'bg-green-500 text-white';
        if (safePercentage >= 60) return 'bg-yellow-500 text-white';
        return 'bg-red-500 text-white';
    };

    const getMatchText = () => {
        if (safePercentage >= 80) return 'Excellent Match';
        if (safePercentage >= 60) return 'Good Match';
        return 'Not Ready';
    };

    const getMatchSubtext = () => {
        if (safePercentage >= 80) return 'Apply Now!';
        if (safePercentage >= 60) return 'Consider Applying';
        return 'Build Skills First';
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'small':
                return 'w-16 h-16 text-lg';
            case 'medium':
                return 'w-20 h-20 text-2xl';
            case 'large':
            default:
                return 'w-24 h-24 text-3xl';
        }
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <div
                className={`${getSizeClasses()} ${getMatchColor()} rounded-full flex flex-col items-center justify-center font-bold shadow-lg`}
            >
                <div>{safePercentage}%</div>
                {size === 'large' && (
                    <div className="text-xs font-normal">Match</div>
                )}
            </div>
            {showLabel && (
                <div className="text-center">
                    <p className="text-sm font-semibold text-gray-800">{getMatchText()}</p>
                    <p className="text-xs text-gray-600">{getMatchSubtext()}</p>
                </div>
            )}
        </div>
    );
}

export default MatchPercentageBadge;
