const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Role = require('../models/Role');
const { protect, authorize } = require('../middleware/auth');

// Initialize AI client (same as tutor, shared config)
let openai = null;
let aiProvider = 'none';
let aiModel = 'llama-3.1-8b-instant';

try {
    const { OpenAI } = require('openai');

    if (process.env.GROQ_API_KEY) {
        openai = new OpenAI({
            apiKey: process.env.GROQ_API_KEY,
            baseURL: 'https://api.groq.com/openai/v1'
        });
        aiProvider = 'groq';
        aiModel = 'llama-3.1-8b-instant';
        console.log('✅ Navigator: Using Groq API');
    } else if (process.env.OPENAI_API_KEY) {
        openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        aiProvider = 'openai';
        aiModel = 'gpt-3.5-turbo';
        console.log('✅ Navigator: Using OpenAI API');
    } else {
        console.log('ℹ️ Navigator: No API key - using rule-based mode');
    }
} catch (error) {
    console.log('⚠️ Navigator initialization error:', error.message);
}

// In-memory roadmap storage (for demo - would be database in production)
const userRoadmaps = new Map();

// Navigator System Prompt - Career Planner, NOT a tutor
const NAVIGATOR_SYSTEM_PROMPT = `You are a Career Navigator for TalentBridge. You create actionable roadmaps, not educational content.

CRITICAL RULES:
- You are NOT a tutor - don't explain concepts unless needed for decisions
- Focus on "what to do next" not "how things work"
- Be practical, concise, action-oriented
- Suggest milestones and actions, NOT courses or lessons
- Every response should move the user toward their goal

OUTPUT STYLE:
- Use phases: Foundation → Build → Apply
- Give specific, measurable actions
- Include progress signals (how they know they're improving)
- Keep it grounded and realistic`;

// @route   POST /api/navigator/generate
// @desc    Generate personalized roadmap based on user profile and target
// @access  Private (student only)
router.post('/generate', protect, authorize('student'), async (req, res) => {
    try {
        const { targetRole, timeline, constraints, educationLevel, availableHoursPerWeek } = req.body;

        if (!targetRole) {
            return res.status(400).json({ message: 'Target role is required' });
        }

        const user = await User.findById(req.user._id).populate('skills.skillId');

        // Get role requirements if available
        let roleData = null;
        try {
            roleData = await Role.findOne({ title: new RegExp(targetRole, 'i') }).populate('requiredSkills.skillId');
        } catch (e) {
            // Role not found, continue without it
        }

        // Build user context
        const userSkills = user.skills.map(s => ({
            name: s.skillId?.name || 'Unknown',
            sci: Math.round(s.sci)
        }));

        // Calculate gaps
        const skillGaps = [];
        if (roleData && roleData.requiredSkills) {
            roleData.requiredSkills.forEach(req => {
                const userSkill = user.skills.find(s => s.skillId?._id.equals(req.skillId?._id));
                const currentSCI = userSkill ? Math.round(userSkill.sci) : 0;
                if (currentSCI < req.minimumSCI) {
                    skillGaps.push({
                        skill: req.skillId?.name || 'Unknown',
                        current: currentSCI,
                        required: req.minimumSCI,
                        gap: req.minimumSCI - currentSCI
                    });
                }
            });
        }

        if (!openai) {
            // Rule-based roadmap generation
            const roadmap = generateRuleBasedRoadmap(targetRole, timeline, userSkills, skillGaps, constraints);
            userRoadmaps.set(req.user._id.toString(), roadmap);
            return res.json({ roadmap, mode: 'rule-based', provider: 'none' });
        }

        // AI-powered roadmap generation
        const prompt = buildRoadmapPrompt(targetRole, timeline, userSkills, skillGaps, constraints, educationLevel, availableHoursPerWeek);

        const completion = await openai.chat.completions.create({
            model: aiModel,
            messages: [
                { role: "system", content: NAVIGATOR_SYSTEM_PROMPT },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 1200
        });

        const aiResponse = completion.choices[0].message.content;

        // Parse and structure the roadmap
        const roadmap = {
            id: Date.now().toString(),
            targetRole,
            timeline: timeline || '3 months',
            constraints: constraints || [],
            userSkills,
            skillGaps,
            phases: parseAIRoadmapToPhases(aiResponse),
            rawPlan: aiResponse,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Store roadmap for this user
        userRoadmaps.set(req.user._id.toString(), roadmap);

        res.json({
            roadmap,
            mode: `ai-powered (${aiProvider})`,
            provider: aiProvider
        });

    } catch (error) {
        console.error('Navigator generate error:', error);
        res.status(500).json({ message: 'Error generating roadmap', error: error.message });
    }
});

// @route   GET /api/navigator/roadmap
// @desc    Get current user's roadmap
// @access  Private (student only)
router.get('/roadmap', protect, authorize('student'), async (req, res) => {
    try {
        const roadmap = userRoadmaps.get(req.user._id.toString());

        if (!roadmap) {
            return res.status(404).json({ message: 'No roadmap found. Generate one first.' });
        }

        res.json({ roadmap });
    } catch (error) {
        console.error('Navigator get roadmap error:', error);
        res.status(500).json({ message: 'Error fetching roadmap' });
    }
});

// @route   POST /api/navigator/guidance
// @desc    Get contextual guidance that references the active roadmap
// @access  Private (student only)
router.post('/guidance', protect, authorize('student'), async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ message: 'Question is required' });
        }

        const roadmap = userRoadmaps.get(req.user._id.toString());

        if (!roadmap) {
            return res.json({
                guidance: "You haven't created a roadmap yet. Let's start by setting your career goal. What role are you aiming for?",
                hasRoadmap: false
            });
        }

        if (!openai) {
            return res.json({
                guidance: generateRuleBasedGuidance(question, roadmap),
                hasRoadmap: true,
                mode: 'rule-based'
            });
        }

        // AI guidance that references roadmap
        const guidancePrompt = `
User's active roadmap:
- Target: ${roadmap.targetRole}
- Timeline: ${roadmap.timeline}
- Current phase: Foundation
- Key gaps: ${roadmap.skillGaps.slice(0, 3).map(g => g.skill).join(', ')}

User's question: "${question}"

Provide brief, actionable guidance. Reference their roadmap. Focus on "what to do next" not explanations. Max 3-4 sentences.
`;

        const completion = await openai.chat.completions.create({
            model: aiModel,
            messages: [
                { role: "system", content: NAVIGATOR_SYSTEM_PROMPT },
                { role: "user", content: guidancePrompt }
            ],
            temperature: 0.7,
            max_tokens: 200
        });

        res.json({
            guidance: completion.choices[0].message.content,
            hasRoadmap: true,
            mode: `ai-powered (${aiProvider})`,
            provider: aiProvider
        });

    } catch (error) {
        console.error('Navigator guidance error:', error);
        res.status(500).json({ message: 'Error getting guidance' });
    }
});

// @route   POST /api/navigator/update-milestone
// @desc    Mark milestone as completed
// @access  Private (student only)
router.post('/update-milestone', protect, authorize('student'), async (req, res) => {
    try {
        const { phaseIndex, milestoneIndex, status } = req.body;

        const roadmap = userRoadmaps.get(req.user._id.toString());

        if (!roadmap) {
            return res.status(404).json({ message: 'No roadmap found' });
        }

        if (roadmap.phases[phaseIndex] && roadmap.phases[phaseIndex].milestones[milestoneIndex]) {
            roadmap.phases[phaseIndex].milestones[milestoneIndex].status = status || 'completed';
            roadmap.updatedAt = new Date();
            userRoadmaps.set(req.user._id.toString(), roadmap);
        }

        res.json({ roadmap, message: 'Milestone updated' });
    } catch (error) {
        console.error('Navigator update milestone error:', error);
        res.status(500).json({ message: 'Error updating milestone' });
    }
});

// Helper: Build roadmap generation prompt
function buildRoadmapPrompt(targetRole, timeline, userSkills, skillGaps, constraints, education, hoursPerWeek) {
    let prompt = `Create a personalized career roadmap for this user:\n\n`;

    prompt += `**Goal:** Become a ${targetRole}\n`;
    prompt += `**Timeline:** ${timeline || '3 months'}\n`;
    prompt += `**Available time:** ${hoursPerWeek || 10} hours/week\n`;

    if (education) {
        prompt += `**Education:** ${education}\n`;
    }

    if (constraints && constraints.length > 0) {
        prompt += `**Constraints:** ${constraints.join(', ')}\n`;
    }

    prompt += `\n**Current Skills:**\n`;
    if (userSkills.length > 0) {
        userSkills.forEach(s => {
            prompt += `- ${s.name}: SCI ${s.sci}/100\n`;
        });
    } else {
        prompt += `- No verified skills yet\n`;
    }

    prompt += `\n**Skill Gaps:**\n`;
    if (skillGaps.length > 0) {
        skillGaps.forEach(g => {
            prompt += `- ${g.skill}: Need ${g.required}+ (Current: ${g.current})\n`;
        });
    } else {
        prompt += `- Gap analysis not available\n`;
    }

    prompt += `\nGenerate a 3-phase roadmap with:
1. FOUNDATION PHASE - Core setup and basics
2. BUILD PHASE - Skill development through projects
3. APPLY PHASE - Real-world application and job readiness

For each phase, include 2-3 specific milestones with:
- Title (action-focused)
- 2-3 practical actions
- Progress signals (how they know they're done)

Be specific, realistic, and action-oriented. No generic advice.`;

    return prompt;
}

// Helper: Parse AI response into structured phases
function parseAIRoadmapToPhases(aiResponse) {
    // Default structure if parsing fails
    const defaultPhases = [
        {
            name: 'Foundation',
            description: 'Build core knowledge and setup',
            milestones: [
                { title: 'Complete initial assessment', actions: ['Take skill assessments', 'Identify top 3 gaps'], progressSignals: ['All core skills assessed'], status: 'pending' }
            ]
        },
        {
            name: 'Build',
            description: 'Develop skills through practice',
            milestones: [
                { title: 'Build first project', actions: ['Choose project idea', 'Implement core features'], progressSignals: ['Working project deployed'], status: 'pending' }
            ]
        },
        {
            name: 'Apply',
            description: 'Real-world application',
            milestones: [
                { title: 'Apply to roles', actions: ['Update portfolio', 'Apply to 5 positions'], progressSignals: ['2+ interviews scheduled'], status: 'pending' }
            ]
        }
    ];

    try {
        // Try to extract phases from AI response
        const phases = [];
        const phaseNames = ['Foundation', 'Build', 'Apply'];

        phaseNames.forEach((phaseName, idx) => {
            const phaseRegex = new RegExp(`${phaseName}[^]*?(?=${phaseNames[idx + 1] || '$'}|Phase|$)`, 'i');
            const match = aiResponse.match(phaseRegex);

            phases.push({
                name: phaseName,
                description: `Phase ${idx + 1}`,
                milestones: [
                    {
                        title: `Complete ${phaseName.toLowerCase()} objectives`,
                        actions: [`Review ${phaseName} requirements`, 'Track daily progress'],
                        progressSignals: [`${phaseName} phase completed`],
                        status: 'pending'
                    }
                ],
                rawContent: match ? match[0] : ''
            });
        });

        return phases.length > 0 ? phases : defaultPhases;
    } catch (e) {
        return defaultPhases;
    }
}

// Helper: Generate rule-based roadmap
function generateRuleBasedRoadmap(targetRole, timeline, userSkills, skillGaps, constraints) {
    const priorityGaps = skillGaps.sort((a, b) => b.gap - a.gap).slice(0, 3);

    return {
        id: Date.now().toString(),
        targetRole,
        timeline: timeline || '3 months',
        constraints: constraints || [],
        userSkills,
        skillGaps,
        phases: [
            {
                name: 'Foundation',
                description: 'Build core skills and setup your learning environment',
                milestones: [
                    {
                        title: 'Complete skill assessment',
                        actions: [
                            'Take assessments for all relevant skills',
                            'Identify your top 3 skill gaps',
                            'Set up a daily practice routine'
                        ],
                        progressSignals: ['All core skills have SCI scores', 'Clear priority list created'],
                        status: 'active'
                    },
                    {
                        title: priorityGaps[0] ? `Master ${priorityGaps[0].skill} basics` : 'Master core skill basics',
                        actions: [
                            'Complete introductory material',
                            'Build 2 small practice projects',
                            'Achieve SCI 50+ through assessment'
                        ],
                        progressSignals: ['SCI improved by 20+ points', 'Can complete basic tasks independently'],
                        status: 'pending'
                    }
                ]
            },
            {
                name: 'Build',
                description: 'Develop skills through real projects',
                milestones: [
                    {
                        title: 'Build portfolio project',
                        actions: [
                            'Design a project that uses your target skills',
                            'Implement full feature set',
                            'Deploy and document your work'
                        ],
                        progressSignals: ['Live project URL', 'GitHub repo with clean code', 'SCI 70+ on key skills'],
                        status: 'pending'
                    },
                    {
                        title: 'Gain practical experience',
                        actions: [
                            'Contribute to open source',
                            'Complete freelance or volunteer project',
                            'Get feedback from peers'
                        ],
                        progressSignals: ['2+ contributions accepted', 'Positive feedback received'],
                        status: 'pending'
                    }
                ]
            },
            {
                name: 'Apply',
                description: 'Transition to job-ready status',
                milestones: [
                    {
                        title: 'Prepare job materials',
                        actions: [
                            'Update resume with projects',
                            'Optimize LinkedIn profile',
                            'Prepare for technical interviews'
                        ],
                        progressSignals: ['Resume reviewed by 2 people', 'Profile views increasing'],
                        status: 'pending'
                    },
                    {
                        title: 'Active job search',
                        actions: [
                            'Apply to 5 positions per week',
                            'Network with 2 professionals weekly',
                            'Do mock interviews'
                        ],
                        progressSignals: ['5+ applications sent', '2+ interview invites', 'Offer received'],
                        status: 'pending'
                    }
                ]
            }
        ],
        rawPlan: `Your personalized roadmap to become a ${targetRole} in ${timeline || '3 months'}.`,
        createdAt: new Date(),
        updatedAt: new Date()
    };
}

// Helper: Generate rule-based guidance
function generateRuleBasedGuidance(question, roadmap) {
    const activeMilestone = roadmap.phases
        .flatMap(p => p.milestones)
        .find(m => m.status === 'active') || roadmap.phases[0].milestones[0];

    return `Based on your roadmap to become a ${roadmap.targetRole}:

Your current focus should be: "${activeMilestone.title}"

Next action: ${activeMilestone.actions[0]}

Stay focused on this milestone before moving to the next. Track your progress using these signals: ${activeMilestone.progressSignals.join(', ')}.`;
}

module.exports = router;
