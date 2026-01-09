/**
 * Gap Analyzer - Compares user skills against role requirements
 * Provides transparent skill gap analysis for career guidance
 */

const { calculateSCI } = require('./sciCalculator');

/**
 * Analyze skill gap between user and a target role
 * 
 * @param {Array} userSkills - User's skills array from User model
 * @param {Array} roleRequiredSkills - Required skills from Role model
 * @returns {Object} Gap analysis result
 */
function analyzeSkillGap(userSkills, roleRequiredSkills) {
    const analysis = {
        readinessPercentage: 0,
        missingSkills: [],
        weakSkills: [],
        strongSkills: [],
        overallAssessment: ''
    };

    // Create a map of user skills by skillId for quick lookup
    const userSkillMap = new Map();
    userSkills.forEach(skill => {
        if (skill.skillId) {
            const skillIdStr = skill.skillId._id ? skill.skillId._id.toString() : skill.skillId.toString();
            userSkillMap.set(skillIdStr, skill);
        }
    });

    let totalRequiredSkills = roleRequiredSkills.length;
    let metRequirements = 0;

    roleRequiredSkills.forEach(reqSkill => {
        const skillIdStr = reqSkill.skillId._id ? reqSkill.skillId._id.toString() : reqSkill.skillId.toString();
        const userSkill = userSkillMap.get(skillIdStr);

        if (!userSkill) {
            // User doesn't have this skill at all
            analysis.missingSkills.push({
                skillId: reqSkill.skillId,
                skillName: reqSkill.skillId.name || 'Unknown',
                requiredSCI: reqSkill.minimumSCI || 60,
                userSCI: 0,
                gap: reqSkill.minimumSCI || 60
            });
        } else {
            const requiredSCI = reqSkill.minimumSCI || 60;

            if (userSkill.sci >= requiredSCI) {
                // Skill meets or exceeds requirement
                analysis.strongSkills.push({
                    skillId: reqSkill.skillId,
                    skillName: reqSkill.skillId.name || userSkill.skillId.name || 'Unknown',
                    requiredSCI,
                    userSCI: userSkill.sci,
                    exceeds: userSkill.sci - requiredSCI
                });
                metRequirements++;
            } else {
                // Skill exists but below required SCI
                analysis.weakSkills.push({
                    skillId: reqSkill.skillId,
                    skillName: reqSkill.skillId.name || userSkill.skillId.name || 'Unknown',
                    requiredSCI,
                    userSCI: userSkill.sci,
                    gap: requiredSCI - userSkill.sci
                });
            }
        }
    });

    // Calculate readiness percentage
    analysis.readinessPercentage = Math.round((metRequirements / totalRequiredSkills) * 100);

    // Generate assessment
    if (analysis.readinessPercentage >= 80) {
        analysis.overallAssessment = 'Ready to apply - strong skill match';
    } else if (analysis.readinessPercentage >= 60) {
        analysis.overallAssessment = 'Nearly ready - minor skill gaps to address';
    } else if (analysis.readinessPercentage >= 40) {
        analysis.overallAssessment = 'Developing - significant upskilling needed';
    } else {
        analysis.overallAssessment = 'Not ready - focus on building foundational skills';
    }

    return analysis;
}

/**
 * Get upskilling recommendations based on gap analysis
 * 
 * @param {Object} gapAnalysis - Result from analyzeSkillGap
 * @returns {Array} Prioritized list of skills to improve
 */
function getUpskillRecommendations(gapAnalysis) {
    const recommendations = [];

    // Prioritize missing skills first
    gapAnalysis.missingSkills.forEach(skill => {
        recommendations.push({
            skillName: skill.skillName,
            skillId: skill.skillId,
            priority: 'HIGH',
            reason: `Missing required skill (target SCI: ${skill.requiredSCI})`,
            targetSCI: skill.requiredSCI,
            currentSCI: 0,
            action: 'Learn this skill from scratch'
        });
    });

    // Then weak skills (sorted by gap size)
    const sortedWeakSkills = gapAnalysis.weakSkills.sort((a, b) => b.gap - a.gap);

    sortedWeakSkills.forEach(skill => {
        recommendations.push({
            skillName: skill.skillName,
            skillId: skill.skillId,
            priority: skill.gap > 20 ? 'HIGH' : 'MEDIUM',
            reason: `Current SCI (${skill.userSCI}) below required (${skill.requiredSCI})`,
            targetSCI: skill.requiredSCI,
            currentSCI: skill.userSCI,
            action: 'Practice and reassess to improve confidence'
        });
    });

    return recommendations;
}

module.exports = {
    analyzeSkillGap,
    getUpskillRecommendations
};
