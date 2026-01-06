/**
 * Role Recommender - Suggests career paths based on user skills
 * Uses rule-based matching to find suitable roles
 */

const { analyzeSkillGap } = require('./gapAnalyzer');

/**
 * Recommend roles for a user based on their current skills
 * 
 * @param {Array} userSkills - User's skills from User model
 * @param {Array} allRoles - All available roles from Role model
 * @returns {Array} Recommended roles sorted by readiness
 */
function recommendRoles(userSkills, allRoles) {
    const recommendations = allRoles.map(role => {
        const gapAnalysis = analyzeSkillGap(userSkills, role.requiredSkills || []);

        return {
            roleId: role._id,
            roleTitle: role.title,
            roleDescription: role.description,
            avgSalary: role.avgSalary,
            readinessPercentage: gapAnalysis.readinessPercentage,
            missingSkillsCount: gapAnalysis.missingSkills.length,
            weakSkillsCount: gapAnalysis.weakSkills.length,
            strongSkillsCount: gapAnalysis.strongSkills.length,
            overallAssessment: gapAnalysis.overallAssessment,
            nextRoles: role.nextRoles || []
        };
    });

    // Sort by readiness (descending)
    recommendations.sort((a, b) => b.readinessPercentage - a.readinessPercentage);

    // Categorize recommendations
    const categorized = {
        ready: recommendations.filter(r => r.readinessPercentage >= 80),
        nearlyReady: recommendations.filter(r => r.readinessPercentage >= 60 && r.readinessPercentage < 80),
        developing: recommendations.filter(r => r.readinessPercentage >= 40 && r.readinessPercentage < 60),
        longTerm: recommendations.filter(r => r.readinessPercentage < 40)
    };

    return {
        all: recommendations,
        categorized
    };
}

/**
 * Build career path progression for a user
 * 
 * @param {Object} currentRole - Starting role
 * @param {Array} allRoles - All available roles
 * @param {number} depth - How many levels to show
 * @returns {Object} Career path tree
 */
function buildCareerPath(currentRole, allRoles, depth = 2) {
    if (!currentRole || depth === 0) {
        return null;
    }

    // Create role map for quick lookup
    const roleMap = new Map();
    allRoles.forEach(role => {
        roleMap.set(role._id.toString(), role);
    });

    function buildPath(role, currentDepth) {
        if (!role || currentDepth === 0) {
            return null;
        }

        const nextRoleIds = role.nextRoles || [];
        const nextRoles = nextRoleIds
            .map(roleId => roleMap.get(roleId.toString()))
            .filter(r => r !== undefined)
            .map(nextRole => buildPath(nextRole, currentDepth - 1));

        return {
            roleId: role._id,
            roleTitle: role.title,
            description: role.description,
            avgSalary: role.avgSalary,
            requiredSkills: role.requiredSkills || [],
            nextRoles: nextRoles.filter(r => r !== null)
        };
    }

    return buildPath(currentRole, depth);
}

module.exports = {
    recommendRoles,
    buildCareerPath
};
