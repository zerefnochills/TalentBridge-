import { freshnessScoreMap } from './mockData';

/**
 * Calculate SCI (Skill Confidence Index)
 * @param {number} assessmentScore - Score from MCQs (0-100)
 * @param {string} lastUsed - When skill was last used
 * @param {number} scenarioScore - Score from scenario question (0-100)
 * @returns {Object} - SCI breakdown and total
 */
export const calculateSCI = (assessmentScore, lastUsed, scenarioScore) => {
    // Get freshness score from mapping
    const freshnessScore = freshnessScoreMap[lastUsed] || 50;

    // Apply weights: Assessment (40%), Freshness (35%), Scenario (25%)
    const weightedAssessment = assessmentScore * 0.4;
    const weightedFreshness = freshnessScore * 0.35;
    const weightedScenario = scenarioScore * 0.25;

    // Calculate total SCI
    const totalSCI = Math.round(weightedAssessment + weightedFreshness + weightedScenario);

    return {
        assessmentScore: Math.round(assessmentScore),
        freshnessScore,
        scenarioScore,
        totalSCI,
        breakdown: {
            assessment: Math.round(weightedAssessment),
            freshness: Math.round(weightedFreshness),
            scenario: Math.round(weightedScenario)
        }
    };
};

/**
 * Get SCI interpretation text
 * @param {number} sci - SCI score (0-100)
 * @returns {string} - Interpretation text
 */
export const getSCIInterpretation = (sci) => {
    if (sci >= 80) {
        return "You have high confidence in JavaScript. Your knowledge is strong and up-to-date.";
    } else if (sci >= 60) {
        return "You have moderate confidence in JavaScript. Your knowledge is decent, but the skill may not be recently practiced.";
    } else if (sci >= 40) {
        return "You have basic confidence in JavaScript. Consider refreshing your knowledge and practicing more.";
    } else {
        return "You have low confidence in JavaScript. Significant learning and practice is recommended.";
    }
};

/**
 * Calculate skill gap
 * @param {number} userSCI - User's SCI score
 * @param {number} requiredSCI - Required SCI for role
 * @returns {Object} - Gap analysis result
 */
export const calculateSkillGap = (userSCI, requiredSCI) => {
    const gap = requiredSCI - userSCI;
    const isReady = userSCI >= requiredSCI;

    return {
        userSCI,
        requiredSCI,
        gap: Math.max(0, gap),
        isReady,
        message: isReady
            ? `Congratulations! You meet the skill requirements for this role.`
            : `You need to improve your JavaScript skill by ${gap} points to qualify for this role. Focus on improving skill freshness and practical application.`
    };
};
