/**
 * SCI (Skill Confidence Index) Calculator
 * 
 * Formula: SCI = (Assessment Score × 0.4) + (Freshness Score × 0.35) + (Scenario Score × 0.25)
 * 
 * This is a RULE-BASED, TRANSPARENT calculation - no AI/ML involved.
 * All weights are configurable and the calculation is fully explainable.
 */

// Configurable weights for SCI components
const SCI_WEIGHTS = {
    assessment: 0.4,
    freshness: 0.35,
    scenario: 0.25
};

/**
 * Calculate skill freshness score based on last used date
 * 
 * Mapping:
 * - < 1 month: 100
 * - 1-6 months: 80
 * - 6-12 months: 50
 * - > 1 year: 20
 * 
 * @param {Date} lastUsedDate - When the skill was last used
 * @returns {number} Freshness score (0-100)
 */
function calculateFreshnessScore(lastUsedDate) {
    if (!lastUsedDate) {
        return 0;
    }

    const now = new Date();
    const diffTime = Math.abs(now - new Date(lastUsedDate));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = diffDays / 30;

    if (diffMonths < 1) {
        return 100;
    } else if (diffMonths < 6) {
        return 80;
    } else if (diffMonths < 12) {
        return 50;
    } else {
        return 20;
    }
}

/**
 * Calculate SCI for a skill
 * 
 * @param {number} assessmentScore - Score from assessment (0-100)
 * @param {Date} lastUsedDate - When skill was last used
 * @param {number} scenarioScore - Score from scenario validation (0-100)
 * @returns {Object} { sci, breakdown }
 */
function calculateSCI(assessmentScore = 0, lastUsedDate, scenarioScore = 0) {
    const freshnessScore = calculateFreshnessScore(lastUsedDate);

    const sci = (
        (assessmentScore * SCI_WEIGHTS.assessment) +
        (freshnessScore * SCI_WEIGHTS.freshness) +
        (scenarioScore * SCI_WEIGHTS.scenario)
    );

    return {
        sci: Math.round(sci * 100) / 100, // Round to 2 decimal places
        breakdown: {
            assessmentScore,
            assessmentContribution: assessmentScore * SCI_WEIGHTS.assessment,
            freshnessScore,
            freshnessContribution: freshnessScore * SCI_WEIGHTS.freshness,
            scenarioScore,
            scenarioContribution: scenarioScore * SCI_WEIGHTS.scenario,
            weights: SCI_WEIGHTS,
            lastUsedDate,
            daysAgo: lastUsedDate ? Math.ceil(Math.abs(new Date() - new Date(lastUsedDate)) / (1000 * 60 * 60 * 24)) : null
        }
    };
}

/**
 * Update user skill with new SCI
 * This should be called after an assessment or when last-used date changes
 * 
 * @param {Object} skillData - Skill object from user.skills array
 * @param {number} assessmentScore - New assessment score (optional)
 * @param {number} scenarioScore - New scenario score (optional)
 * @returns {Object} Updated skill data with new SCI
 */
function updateSkillSCI(skillData, assessmentScore = null, scenarioScore = null) {
    const currentAssessment = assessmentScore !== null ? assessmentScore : skillData.assessmentScore;
    const currentScenario = scenarioScore !== null ? scenarioScore : skillData.scenarioScore;

    const sciResult = calculateSCI(
        currentAssessment,
        skillData.lastUsedDate,
        currentScenario
    );

    return {
        ...skillData,
        assessmentScore: currentAssessment,
        scenarioScore: currentScenario,
        freshnessScore: sciResult.breakdown.freshnessScore,
        sci: sciResult.sci,
        lastAssessed: assessmentScore !== null ? new Date() : skillData.lastAssessed
    };
}

/**
 * Get SCI interpretation for display
 * 
 * @param {number} sci - SCI score (0-100)
 * @returns {Object} { level, color, message }
 */
function getSCIInterpretation(sci) {
    if (sci >= 80) {
        return {
            level: 'Expert',
            color: 'green',
            message: 'Strong, current skill confidence'
        };
    } else if (sci >= 60) {
        return {
            level: 'Proficient',
            color: 'blue',
            message: 'Good skill confidence'
        };
    } else if (sci >= 40) {
        return {
            level: 'Intermediate',
            color: 'yellow',
            message: 'Moderate skill confidence - consider reassessment'
        };
    } else if (sci >= 20) {
        return {
            level: 'Beginner',
            color: 'orange',
            message: 'Low confidence - skill may be outdated'
        };
    } else {
        return {
            level: 'Unverified',
            color: 'red',
            message: 'Very low confidence - reassessment needed'
        };
    }
}

module.exports = {
    calculateSCI,
    calculateFreshnessScore,
    updateSkillSCI,
    getSCIInterpretation,
    SCI_WEIGHTS
};
