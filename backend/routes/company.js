const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/company/team-risk
// @desc    Calculate team skill risk meter
// @access  Private (company only)
router.get('/team-risk', protect, authorize('company'), async (req, res) => {
    try {
        // For MVP, we'll analyze the company's posted jobs vs market
        // In a full version, this would analyze actual team members

        const jobs = await Job.find({ companyId: req.user._id })
            .populate('requiredSkills.skillId applications.candidateId');

        if (jobs.length === 0) {
            return res.json({
                message: 'No jobs posted yet',
                riskLevel: 'unknown'
            });
        }

        // Aggregate required skills across all jobs
        const skillDemand = new Map();
        jobs.forEach(job => {
            job.requiredSkills.forEach(reqSkill => {
                const skillId = reqSkill.skillId._id.toString();
                const skillName = reqSkill.skillId.name;
                const current = skillDemand.get(skillId) || {
                    skillName,
                    jobsRequiring: 0,
                    totalApplications: 0,
                    avgMatchPercentage: 0
                };

                current.jobsRequiring++;
                skillDemand.set(skillId, current);
            });

            // Calculate application stats
            job.applications.forEach(app => {
                job.requiredSkills.forEach(reqSkill => {
                    const skillId = reqSkill.skillId._id.toString();
                    const data = skillDemand.get(skillId);
                    if (data) {
                        data.totalApplications++;
                        data.avgMatchPercentage = (data.avgMatchPercentage + (app.skillMatchPercentage || 0)) / 2;
                    }
                });
            });
        });

        // Identify high-risk skills (low application rates)
        const riskAnalysis = Array.from(skillDemand.values()).map(skill => ({
            skillName: skill.skillName,
            jobsRequiring: skill.jobsRequiring,
            totalApplications: skill.totalApplications,
            applicationsPerJob: skill.totalApplications / skill.jobsRequiring,
            avgMatchPercentage: Math.round(skill.avgMatchPercentage),
            riskLevel: skill.totalApplications < skill.jobsRequiring * 2 ? 'HIGH'
                : skill.totalApplications < skill.jobsRequiring * 5 ? 'MEDIUM'
                    : 'LOW'
        }));

        const highRiskSkills = riskAnalysis.filter(s => s.riskLevel === 'HIGH');

        res.json({
            overallRisk: highRiskSkills.length > 3 ? 'HIGH' : highRiskSkills.length > 1 ? 'MEDIUM' : 'LOW',
            skillRisks: riskAnalysis,
            highRiskCount: highRiskSkills.length,
            recommendation: highRiskSkills.length > 0
                ? `Consider broadening requirements or upskilling for: ${highRiskSkills.map(s => s.skillName).join(', ')}`
                : 'Team skill coverage looks healthy'
        });
    } catch (error) {
        console.error('Team risk analysis error:', error);
        res.status(500).json({ message: 'Server error analyzing team risk' });
    }
});

// @route   GET /api/company/analytics
// @desc    HR analytics dashboard
// @access  Private (company only)
router.get('/analytics', protect, authorize('company'), async (req, res) => {
    try {
        const jobs = await Job.find({ companyId: req.user._id })
            .populate('applications.candidateId requiredSkills.skillId');

        // Calculate metrics
        const analytics = {
            totalJobs: jobs.length,
            openJobs: jobs.filter(j => j.status === 'open').length,
            closedJobs: jobs.filter(j => j.status === 'closed').length,
            totalApplications: jobs.reduce((sum, job) => sum + job.applications.length, 0),
            avgApplicationsPerJob: 0,
            avgCandidateMatchPercentage: 0,
            topSkillsInDemand: [],
            hiringFunnel: {
                jobsPosted: jobs.length,
                totalApplications: 0,
                avgMatchRate: 0
            }
        };

        if (jobs.length > 0) {
            analytics.avgApplicationsPerJob = Math.round(analytics.totalApplications / jobs.length);

            let totalMatch = 0;
            let matchCount = 0;
            jobs.forEach(job => {
                job.applications.forEach(app => {
                    if (app.skillMatchPercentage) {
                        totalMatch += app.skillMatchPercentage;
                        matchCount++;
                    }
                });
            });

            analytics.avgCandidateMatchPercentage = matchCount > 0
                ? Math.round(totalMatch / matchCount)
                : 0;
        }

        // Skill demand analysis
        const skillFrequency = new Map();
        jobs.forEach(job => {
            job.requiredSkills.forEach(skill => {
                const name = skill.skillId.name;
                skillFrequency.set(name, (skillFrequency.get(name) || 0) + 1);
            });
        });

        analytics.topSkillsInDemand = Array.from(skillFrequency.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([skill, count]) => ({ skill, jobCount: count }));

        // Note for MVP
        analytics.disclaimer = 'MVP analytics - indicative insights only';

        res.json({ analytics });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ message: 'Server error generating analytics' });
    }
});

module.exports = router;
