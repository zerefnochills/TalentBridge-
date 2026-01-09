/**
 * Candidate Ranker - Transparently ranks job applicants by skill match
 * All ranking logic is rule-based and explainable
 */

/**
 * Calculate skill match percentage for a candidate against job requirements
 * 
 * @param {Array} candidateSkills - Candidate's skills from User model
 * @param {Array} jobRequiredSkills - Required skills from Job model
 * @returns {Object} Match analysis
 */
function calculateSkillMatch(candidateSkills, jobRequiredSkills) {
    let totalScore = 0;
    let maxPossibleScore = 0;
    const skillBreakdown = [];

    // Create skill lookup map
    const candidateSkillMap = new Map();
    candidateSkills.forEach(skill => {
        if (!skill.skillId) return; // Skip if skillId is undefined
        const skillId = skill.skillId._id ? skill.skillId._id.toString() : skill.skillId.toString();
        candidateSkillMap.set(skillId, skill);
    });

    jobRequiredSkills.forEach(reqSkill => {
        if (!reqSkill.skillId) return; // Skip if skillId is undefined
        const skillId = reqSkill.skillId._id ? reqSkill.skillId._id.toString() : reqSkill.skillId.toString();
        const importance = reqSkill.importance || 3;
        const minSCI = reqSkill.minSCI || 50;

        maxPossibleScore += (importance * 100); // Max score per skill is importance × 100

        const candidateSkill = candidateSkillMap.get(skillId);

        if (!candidateSkill) {
            // Candidate doesn't have this skill
            skillBreakdown.push({
                skillName: reqSkill.skillId.name || 'Unknown',
                required: true,
                importance,
                minSCI,
                candidateSCI: 0,
                score: 0,
                maxScore: importance * 100,
                status: 'missing'
            });
        } else {
            // Candidate has the skill - score based on SCI
            const sci = candidateSkill.sci || 0;
            const skillScore = importance * sci; // Score = importance × SCI

            totalScore += skillScore;

            skillBreakdown.push({
                skillName: reqSkill.skillId.name || candidateSkill.skillId.name || 'Unknown',
                required: true,
                importance,
                minSCI,
                candidateSCI: sci,
                score: skillScore,
                maxScore: importance * 100,
                status: sci >= minSCI ? 'meets' : 'below',
                freshnessScore: candidateSkill.freshnessScore || 0
            });
        }
    });

    const matchPercentage = maxPossibleScore > 0
        ? Math.round((totalScore / maxPossibleScore) * 100)
        : 0;

    return {
        matchPercentage,
        totalScore,
        maxPossibleScore,
        skillBreakdown
    };
}

/**
 * Rank candidates for a job
 * 
 * @param {Array} candidates - Array of candidate user objects with skills
 * @param {Array} jobRequiredSkills - Required skills from job posting
 * @returns {Array} Ranked candidates with explanations
 */
function rankCandidates(candidates, jobRequiredSkills) {
    const rankedCandidates = candidates.map(candidate => {
        const matchResult = calculateSkillMatch(candidate.skills || [], jobRequiredSkills);

        return {
            candidateId: candidate._id,
            candidateName: candidate.profile?.name || 'Unknown',
            candidateEmail: candidate.email,
            matchPercentage: matchResult.matchPercentage,
            totalScore: matchResult.totalScore,
            skillBreakdown: matchResult.skillBreakdown,
            experience: candidate.profile?.experience || 0
        };
    });

    // Sort by match percentage (descending), then by experience
    rankedCandidates.sort((a, b) => {
        if (b.matchPercentage !== a.matchPercentage) {
            return b.matchPercentage - a.matchPercentage;
        }
        return b.experience - a.experience;
    });

    // Add ranking position
    rankedCandidates.forEach((candidate, index) => {
        candidate.ranking = index + 1;
    });

    return rankedCandidates;
}

/**
 * Generate explanation for a candidate's ranking
 * 
 * @param {Object} candidate - Ranked candidate object
 * @returns {string} Human-readable explanation
 */
function generateRankingExplanation(candidate) {
    const { matchPercentage, skillBreakdown, ranking } = candidate;

    const meetsCount = skillBreakdown.filter(s => s.status === 'meets').length;
    const missingCount = skillBreakdown.filter(s => s.status === 'missing').length;
    const belowCount = skillBreakdown.filter(s => s.status === 'below').length;

    let explanation = `Ranked #${ranking} with ${matchPercentage}% skill match. `;

    if (meetsCount > 0) {
        explanation += `Meets requirements for ${meetsCount} skill(s). `;
    }

    if (belowCount > 0) {
        explanation += `${belowCount} skill(s) below required threshold. `;
    }

    if (missingCount > 0) {
        explanation += `Missing ${missingCount} required skill(s). `;
    }

    return explanation.trim();
}

module.exports = {
    calculateSkillMatch,
    rankCandidates,
    generateRankingExplanation
};
