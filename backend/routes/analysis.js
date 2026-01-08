const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Role = require('../models/Role');
const { protect, authorize } = require('../middleware/auth');
const { analyzeSkillGap, getUpskillRecommendations } = require('../utils/gapAnalyzer');
const { recommendRoles, buildCareerPath } = require('../utils/roleRecommender');

// @route   GET /api/analysis/roles
// @desc    Get all available roles
// @access  Private
router.get('/roles', protect, async (req, res) => {
    try {
        const roles = await Role.find().populate('requiredSkills.skillId');
        res.json({ roles });
    } catch (error) {
        console.error('Get roles error:', error);
        res.status(500).json({ message: 'Server error fetching roles' });
    }
});

// @route   POST /api/analysis/gap
// @desc    Analyze skill gap for a specific role
// @access  Private (student only)
router.post('/gap', protect, authorize('student'), async (req, res) => {
    try {
        const { roleId } = req.body;

        if (!roleId) {
            return res.status(400).json({ message: 'Please provide roleId' });
        }

        const role = await Role.findById(roleId).populate('requiredSkills.skillId');
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }

        const user = await User.findById(req.user._id).populate('skills.skillId');

        const gapAnalysis = analyzeSkillGap(user.skills, role.requiredSkills);
        const recommendations = getUpskillRecommendations(gapAnalysis);

        res.json({
            role: {
                id: role._id,
                title: role.title,
                description: role.description
            },
            analysis: gapAnalysis,
            upskillRecommendations: recommendations
        });
    } catch (error) {
        console.error('Gap analysis error:', error);
        res.status(500).json({ message: 'Server error performing gap analysis' });
    }
});

// @route   GET /api/analysis/recommendations
// @desc    Get role recommendations based on user skills
// @access  Private (student only)
router.get('/recommendations', protect, authorize('student'), async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('skills.skillId');
        const roles = await Role.find().populate('requiredSkills.skillId');

        const recommendations = recommendRoles(user.skills, roles);

        res.json({ recommendations });
    } catch (error) {
        console.error('Role recommendations error:', error);
        res.status(500).json({ message: 'Server error getting role recommendations' });
    }
});

// @route   GET /api/analysis/career-path/:roleId
// @desc    Get career progression path
// @access  Private
router.get('/career-path/:roleId', protect, async (req, res) => {
    try {
        const { roleId } = req.params;

        const currentRole = await Role.findById(roleId).populate('requiredSkills.skillId nextRoles');
        if (!currentRole) {
            return res.status(404).json({ message: 'Role not found' });
        }

        const allRoles = await Role.find().populate('requiredSkills.skillId nextRoles');
        const careerPath = buildCareerPath(currentRole, allRoles, 3);

        res.json({ careerPath });
    } catch (error) {
        console.error('Career path error:', error);
        res.status(500).json({ message: 'Server error building career path' });
    }
});

// @route   GET /api/analysis/upskilling
// @desc    Get personalized upskilling guidance
// @access  Private (student only)
router.get('/upskilling', protect, authorize('student'), async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('skills.skillId');

        // Find skills that need improvement (low SCI or old)
        const skillsNeedingImprovement = user.skills
            .filter(s => s.sci < 60 || s.freshnessScore < 50)
            .sort((a, b) => a.sci - b.sci);

        const guidance = skillsNeedingImprovement.map(skill => ({
            skillName: skill.skillId.name,
            currentSCI: skill.sci,
            freshnessScore: skill.freshnessScore,
            lastUsedDays: Math.ceil((new Date() - new Date(skill.lastUsedDate)) / (1000 * 60 * 60 * 24)),
            recommendation: skill.sci < 40
                ? 'Take assessment to establish baseline, then practice'
                : skill.freshnessScore < 50
                    ? 'Skill may be outdated - refresh knowledge and reassess'
                    : 'Practice and retake assessment to improve score'
        }));

        res.json({ upskillGuidance: guidance });
    } catch (error) {
        console.error('Upskilling guidance error:', error);
        res.status(500).json({ message: 'Server error generating upskilling guidance' });
    }
});

module.exports = router;
