const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Skill = require('../models/Skill');
const Assessment = require('../models/Assessment');
const { protect, authorize } = require('../middleware/auth');
const { updateSkillSCI } = require('../utils/sciCalculator');

// Assessment cooldown period (24 hours)
const COOLDOWN_HOURS = 24;

// @route   POST /api/assessments/start
// @desc    Start an assessment for a skill
// @access  Private (student only)
router.post('/start', protect, authorize('student'), async (req, res) => {
    try {
        const { skillId } = req.body;

        if (!skillId) {
            return res.status(400).json({ message: 'Please provide skillId' });
        }

        // Get skill with questions
        const skill = await Skill.findById(skillId);
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        if (!skill.assessmentQuestions || skill.assessmentQuestions.length === 0) {
            return res.status(400).json({ message: 'No assessment questions available for this skill' });
        }

        // Check last assessment time (cooldown)
        const lastAssessment = await Assessment.findOne({
            userId: req.user._id,
            skillId
        }).sort({ completedAt: -1 });

        if (lastAssessment) {
            const hoursSinceAssessment = (new Date() - lastAssessment.completedAt) / (1000 * 60 * 60);
            if (hoursSinceAssessment < COOLDOWN_HOURS) {
                const hoursRemaining = Math.ceil(COOLDOWN_HOURS - hoursSinceAssessment);
                return res.status(429).json({
                    message: `Please wait ${hoursRemaining} hours before retaking this assessment`,
                    canRetakeAt: new Date(lastAssessment.completedAt.getTime() + (COOLDOWN_HOURS * 60 * 60 * 1000))
                });
            }
        }

        // Randomize and select questions (take max 10 questions)
        const shuffled = skill.assessmentQuestions.sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffled.slice(0, Math.min(10, shuffled.length));

        // Remove correct answers from response
        const questionsForClient = selectedQuestions.map(q => ({
            _id: q._id,
            question: q.question,
            type: q.type,
            options: q.options,
            difficulty: q.difficulty,
            points: q.points
        }));

        res.json({
            message: 'Assessment started',
            skillName: skill.name,
            skillId: skill._id,
            questions: questionsForClient,
            totalQuestions: questionsForClient.length,
            timeLimit: 600, // 10 minutes in seconds
            note: 'This assessment is timed. Cheating cannot be eliminated, only reduced.'
        });
    } catch (error) {
        console.error('Start assessment error:', error);
        res.status(500).json({ message: 'Server error starting assessment' });
    }
});

// @route   POST /api/assessments/submit
// @desc    Submit assessment and calculate score
// @access  Private (student only)
router.post('/submit', protect, authorize('student'), async (req, res) => {
    try {
        const { skillId, answers, timeTaken } = req.body;

        if (!skillId || !answers || !timeTaken) {
            return res.status(400).json({ message: 'Please provide skillId, answers, and timeTaken' });
        }

        const skill = await Skill.findById(skillId);
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        // Calculate score
        let totalPoints = 0;
        let earnedPoints = 0;
        const questionResults = [];

        answers.forEach(answer => {
            const question = skill.assessmentQuestions.id(answer.questionId);
            if (question) {
                totalPoints += question.points;
                const isCorrect = answer.userAnswer === question.correctAnswer;
                if (isCorrect) {
                    earnedPoints += question.points;
                }
                questionResults.push({
                    questionId: answer.questionId,
                    userAnswer: answer.userAnswer,
                    isCorrect
                });
            }
        });

        const scorePercentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;

        // Calculate scenario score (for now, use assessment score as proxy)
        const scenarioScore = scorePercentage;

        // Save assessment record
        const assessment = await Assessment.create({
            userId: req.user._id,
            skillId,
            questions: questionResults,
            score: scorePercentage,
            completedAt: new Date(),
            timeTaken
        });

        // Update user's skill SCI
        const user = await User.findById(req.user._id);
        const skillIndex = user.skills.findIndex(s => s.skillId.toString() === skillId);

        if (skillIndex >= 0) {
            const updatedSkill = updateSkillSCI(
                user.skills[skillIndex],
                scorePercentage,
                scenarioScore
            );
            user.skills[skillIndex] = updatedSkill;
            await user.save();
        }

        const updatedUser = await User.findById(req.user._id)
            .populate('skills.skillId', 'name category');

        const updatedSkillData = updatedUser.skills.find(s => s.skillId._id.toString() === skillId);

        res.json({
            message: 'Assessment submitted successfully',
            score: Math.round(scorePercentage),
            earnedPoints,
            totalPoints,
            skillData: updatedSkillData,
            canRetakeAt: new Date(Date.now() + (COOLDOWN_HOURS * 60 * 60 * 1000))
        });
    } catch (error) {
        console.error('Submit assessment error:', error);
        res.status(500).json({ message: 'Server error submitting assessment' });
    }
});

// @route   GET /api/assessments/history
// @desc    Get user's assessment history
// @access  Private
router.get('/history', protect, async (req, res) => {
    try {
        const assessments = await Assessment.find({ userId: req.user._id })
            .populate('skillId', 'name category')
            .sort({ completedAt: -1 })
            .limit(20);

        res.json({ assessments });
    } catch (error) {
        console.error('Get assessment history error:', error);
        res.status(500).json({ message: 'Server error fetching assessment history' });
    }
});

// @route   GET /api/assessments/cooldown/:skillId
// @desc    Check if retake is allowed for a skill
// @access  Private
router.get('/cooldown/:skillId', protect, async (req, res) => {
    try {
        const { skillId } = req.params;

        const lastAssessment = await Assessment.findOne({
            userId: req.user._id,
            skillId
        }).sort({ completedAt: -1 });

        if (!lastAssessment) {
            return res.json({ canRetake: true });
        }

        const hoursSinceAssessment = (new Date() - lastAssessment.completedAt) / (1000 * 60 * 60);
        const canRetake = hoursSinceAssessment >= COOLDOWN_HOURS;

        res.json({
            canRetake,
            lastAssessmentDate: lastAssessment.completedAt,
            canRetakeAt: new Date(lastAssessment.completedAt.getTime() + (COOLDOWN_HOURS * 60 * 60 * 1000)),
            hoursRemaining: canRetake ? 0 : Math.ceil(COOLDOWN_HOURS - hoursSinceAssessment)
        });
    } catch (error) {
        console.error('Check cooldown error:', error);
        res.status(500).json({ message: 'Server error checking cooldown' });
    }
});

module.exports = router;
