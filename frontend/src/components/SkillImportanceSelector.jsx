import React from 'react';

/**
 * SkillImportanceSelector - Visual component for selecting skill importance (1-5)
 * Displays as interactive star rating
 */
function SkillImportanceSelector({ value = 3, onChange, readonly = false }) {
    const stars = [1, 2, 3, 4, 5];

    const getStarColor = (starIndex) => {
        if (starIndex <= value) {
            if (value >= 5) return 'text-red-500';
            if (value >= 4) return 'text-orange-500';
            if (value >= 3) return 'text-yellow-500';
            return 'text-blue-500';
        }
        return 'text-gray-300';
    };

    const getImportanceLabel = (level) => {
        const labels = {
            1: 'Nice to Have',
            2: 'Beneficial',
            3: 'Important',
            4: 'Very Important',
            5: 'Critical'
        };
        return labels[level] || 'Important';
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                {stars.map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => !readonly && onChange && onChange(star)}
                        disabled={readonly}
                        className={`text-2xl transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
                            } ${getStarColor(star)}`}
                        aria-label={`Set importance to ${star}`}
                    >
                        {star <= value ? '★' : '☆'}
                    </button>
                ))}
                <span className="text-sm font-medium text-gray-700 ml-2">
                    {getImportanceLabel(value)}
                </span>
            </div>
            {!readonly && (
                <p className="text-xs text-gray-500">
                    Click stars to set importance level (1 = Nice to Have, 5 = Critical)
                </p>
            )}
        </div>
    );
}

export default SkillImportanceSelector;
