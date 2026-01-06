const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Skill = require('../models/Skill');
const { protect, authorize } = require('../middleware/auth');
const { updateSkillSCI } = require('../utils/sciCalculator');

// @route   GET /api/skills
// @desc    Get all available skills
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const skills = await Skill.find().select('-assessmentQuestions');
        res.json({ skills });
    } catch (error) {
        console.error('Get skills error:', error);
        res.status(500).json({ message: 'Server error fetching skills' });
    }
});

// @route   GET /api/skills/user
// @desc    Get user's skills with SCI
// @access  Private
router.get('/user', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('skills.skillId', 'name category description');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ skills: user.skills });
    } catch (error) {
        console.error('Get user skills error:', error);
        res.status(500).json({ message: 'Server error fetching user skills' });
    }
});

// @route   POST /api/skills/user
// @desc    Add skill to user profile
// @access  Private (student/employee only)
router.post('/user', protect, authorize('student'), async (req, res) => {
    try {
        const { skillId, lastUsedDate, selfRating, category } = req.body;

        if (!skillId || !lastUsedDate) {
            return res.status(400).json({ message: 'Please provide skillId and lastUsedDate' });
        }

        // Check if skill exists
        const skill = await Skill.findById(skillId);
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user already has this skill
        const existingSkillIndex = user.skills.findIndex(
            s => s.skillId.toString() === skillId
        );

        if (existingSkillIndex >= 0) {
            return res.status(400).json({ message: 'Skill already added' });
        }

        // Calculate initial SCI (without assessment)
        const sciResult = updateSkillSCI({
            lastUsedDate: new Date(lastUsedDate),
            assessmentScore: 0,
            scenarioScore: 0
        });

        // Add skill to user
        user.skills.push({
            skillId,
            selfRating: selfRating || 3,
            lastUsedDate: new Date(lastUsedDate),
            ...sciResult,
            category: category || 'core'
        });

        await user.save();

        const updatedUser = await User.findById(req.user._id)
            .populate('skills.skillId', 'name category description');

        res.json({
            message: 'Skill added successfully',
            skills: updatedUser.skills
        });
    } catch (error) {
        console.error('Add skill error:', error);
        res.status(500).json({ message: 'Server error adding skill' });
    }
});

// @route   PUT /api/skills/user/:skillId
// @desc    Update user skill (last used, self-rating)
// @access  Private (student only)
router.put('/user/:skillId', protect, authorize('student'), async (req, res) => {
    try {
        const { skillId } = req.params;
        const { lastUsedDate, selfRating } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const skillIndex = user.skills.findIndex(
            s => s.skillId.toString() === skillId
        );

        if (skillIndex < 0) {
            return res.status(404).json({ message: 'Skill not found in user profile' });
        }

        // Update fields
        if (lastUsedDate) {
            user.skills[skillIndex].lastUsedDate = new Date(lastUsedDate);
        }
        if (selfRating) {
            user.skills[skillIndex].selfRating = selfRating;
        }

        // Recalculate SCI with new data
        const updatedSkill = updateSkillSCI(user.skills[skillIndex]);
        user.skills[skillIndex] = updatedSkill;

        await user.save();

        const updatedUser = await User.findById(req.user._id)
            .populate('skills.skillId', 'name category description');

        res.json({
            message: 'Skill updated successfully',
            skills: updatedUser.skills
        });
    } catch (error) {
        console.error('Update skill error:', error);
        res.status(500).json({ message: 'Server error updating skill' });
    }
});

module.exports = router;
