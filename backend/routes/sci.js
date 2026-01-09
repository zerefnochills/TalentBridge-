const express = require('express');
const router = express.Router();

/**
 * @route   POST /api/sci/calculate
 * @desc    Calculate Skill Confidence Index
 * @access  Public
 */
router.post('/calculate', async (req, res) => {
    try {
        const { skillLevel, lastUsedDate, proofScore } = req.body;

        // Validate inputs
        if (skillLevel === undefined || !lastUsedDate || proofScore === undefined) {
            return res.status(400).json({
                message: 'Please provide skillLevel, lastUsedDate, and proofScore'
            });
        }

        // Calculate freshness score based on last used date
        const calculateFreshnessScore = (dateString) => {
            const now = new Date();
            const lastUsed = new Date(dateString);
            const diffTime = Math.abs(now - lastUsed);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const diffMonths = diffDays / 30;

            if (diffMonths < 1) return 100;
            if (diffMonths < 6) return 80;
            if (diffMonths < 12) return 50;
            return 20;
        };

        const freshnessScore = calculateFreshnessScore(lastUsedDate);

        // SCI Formula: (Skill × 0.4) + (Freshness × 0.35) + (Proof × 0.25)
        const sciScore = (skillLevel * 0.4) + (freshnessScore * 0.35) + (proofScore * 0.25);

        res.json({
            sciScore: Math.round(sciScore * 100) / 100,
            breakdown: {
                skillLevel,
                skillContribution: skillLevel * 0.4,
                freshnessScore,
                freshnessContribution: freshnessScore * 0.35,
                proofScore,
                proofContribution: proofScore * 0.25
            },
            formula: 'SCI = (Skill × 0.4) + (Freshness × 0.35) + (Proof × 0.25)'
        });

    } catch (error) {
        console.error('SCI calculation error:', error);
        res.status(500).json({ message: 'Error calculating SCI' });
    }
});

module.exports = router;
