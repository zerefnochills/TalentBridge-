const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { calculateSkillMatch, rankCandidates } = require('../utils/candidateRanker');

// @route   POST /api/jobs
// @desc    Create new job posting
// @access  Private (company only)
router.post('/', protect, authorize('company'), async (req, res) => {
    try {
        const { title, description, requiredSkills } = req.body;

        if (!title || !description || !requiredSkills || requiredSkills.length === 0) {
            return res.status(400).json({ message: 'Please provide title, description, and required skills' });
        }

        const job = await Job.create({
            companyId: req.user._id,
            title,
            description,
            requiredSkills,
            status: 'open'
        });

        const populatedJob = await Job.findById(job._id)
            .populate('requiredSkills.skillId', 'name category')
            .populate('companyId', 'profile.companyName');

        res.status(201).json({
            message: 'Job posted successfully',
            job: populatedJob
        });
    } catch (error) {
        console.error('Create job error:', error);
        res.status(500).json({ message: 'Server error creating job' });
    }
});

// @route   GET /api/jobs
// @desc    Get all open jobs
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const jobs = await Job.find({ status: 'open' })
            .populate('requiredSkills.skillId', 'name category')
            .populate('companyId', 'profile.companyName profile.industry')
            .sort({ createdAt: -1 });

        // If user is a student, calculate match percentage for each job
        if (req.user.role === 'student') {
            const user = await User.findById(req.user._id).populate('skills.skillId');

            const jobsWithMatch = jobs.map(job => {
                const match = calculateSkillMatch(user.skills || [], job.requiredSkills || []);
                return {
                    ...job.toObject(),
                    matchPercentage: match.matchPercentage
                };
            });

            return res.json({ jobs: jobsWithMatch });
        }

        res.json({ jobs });
    } catch (error) {
        console.error('Get jobs error:', error);
        res.status(500).json({ message: 'Server error fetching jobs' });
    }
});

// @route   GET /api/jobs/company
// @desc    Get jobs posted by the logged in company
// @access  Private (company only)
router.get('/company', protect, authorize('company'), async (req, res) => {
    try {
        const jobs = await Job.find({ companyId: req.user._id })
            .populate('requiredSkills.skillId', 'name category')
            .sort({ createdAt: -1 });

        // Add applicant count and avg match for each job
        const jobsWithStats = jobs.map(job => {
            const applicantCount = job.applications?.length || 0;
            const avgMatch = applicantCount > 0
                ? Math.round(job.applications.reduce((sum, app) => sum + (app.skillMatchPercentage || 0), 0) / applicantCount)
                : 0;

            return {
                ...job.toObject(),
                applicantCount,
                avgMatchPercentage: avgMatch
            };
        });

        res.json({ jobs: jobsWithStats });
    } catch (error) {
        console.error('Get company jobs error:', error);
        res.status(500).json({ message: 'Server error fetching company jobs' });
    }
});

// @route   GET /api/jobs/:id
// @desc    Get single job details
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('requiredSkills.skillId', 'name category description')
            .populate('companyId', 'profile.companyName profile.industry');

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // If student, calculate their match
        if (req.user.role === 'student') {
            const user = await User.findById(req.user._id).populate('skills.skillId');
            const match = calculateSkillMatch(user?.skills || [], job.requiredSkills || []);

            return res.json({
                job,
                matchAnalysis: match
            });
        }

        res.json({ job });
    } catch (error) {
        console.error('Get job error:', error);
        res.status(500).json({ message: 'Server error fetching job' });
    }
});

// @route   POST /api/jobs/:id/apply
// @desc    Apply for a job
// @access  Private (student only)
router.post('/:id/apply', protect, authorize('student'), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.status !== 'open') {
            return res.status(400).json({ message: 'This job is no longer accepting applications' });
        }

        // Check if already applied
        const hasApplied = job.applications.some(
            app => app.candidateId.toString() === req.user._id.toString()
        );

        if (hasApplied) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        // Calculate match percentage
        const user = await User.findById(req.user._id).populate('skills.skillId');
        const match = calculateSkillMatch(user.skills, job.requiredSkills);

        // Add application
        job.applications.push({
            candidateId: req.user._id,
            appliedAt: new Date(),
            skillMatchPercentage: match.matchPercentage
        });

        await job.save();

        res.json({
            message: 'Application submitted successfully',
            matchPercentage: match.matchPercentage
        });
    } catch (error) {
        console.error('Apply job error:', error);
        res.status(500).json({ message: 'Server error applying for job' });
    }
});

// @route   GET /api/jobs/:id/candidates
// @desc    Get ranked candidates for a job
// @access  Private (company only)
router.get('/:id/candidates', protect, authorize('company'), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('requiredSkills.skillId');

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check ownership
        if (job.companyId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view candidates for this job' });
        }

        if (job.applications.length === 0) {
            return res.json({
                candidates: [],
                message: 'No applications yet'
            });
        }

        // Get all candidates
        const candidateIds = job.applications.map(app => app.candidateId);
        const candidates = await User.find({ _id: { $in: candidateIds } })
            .populate('skills.skillId');

        // Rank candidates
        const rankedCandidates = rankCandidates(candidates, job.requiredSkills);

        res.json({ candidates: rankedCandidates });
    } catch (error) {
        console.error('Get candidates error:', error);
        res.status(500).json({ message: 'Server error fetching candidates' });
    }
});

module.exports = router;
