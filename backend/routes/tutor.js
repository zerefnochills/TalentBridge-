const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Role = require('../models/Role');
const { protect, authorize } = require('../middleware/auth');

// Initialize OpenAI/Groq client - Groq is preferred (faster and cheaper)
let openai = null;
let aiProvider = 'none';
let aiModel = 'llama-3.1-8b-instant'; // Default Groq model

try {
    const { OpenAI } = require('openai');

    // Prefer Groq API if available
    if (process.env.GROQ_API_KEY) {
        openai = new OpenAI({
            apiKey: process.env.GROQ_API_KEY,
            baseURL: 'https://api.groq.com/openai/v1'
        });
        aiProvider = 'groq';
        aiModel = 'llama-3.1-8b-instant'; // Fast Groq model
        console.log('✅ AI Tutor: Using Groq API (llama-3.1-8b-instant)');
    }
    // Fallback to OpenAI if Groq not available
    else if (process.env.OPENAI_API_KEY) {
        openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        aiProvider = 'openai';
        aiModel = 'gpt-3.5-turbo';
        console.log('✅ AI Tutor: Using OpenAI API (gpt-3.5-turbo)');
    } else {
        console.log('ℹ️ AI Tutor: No API key configured - using rule-based mode');
    }
} catch (error) {
    console.log('⚠️ AI Tutor initialization error:', error.message);
}

// @route   POST /api/tutor/recommend
// @desc    Get AI-powered learning recommendations based on skill gaps
// @access  Private (student only)
router.post('/recommend', protect, authorize('student'), async (req, res) => {
    try {
        const { roleId, skillGaps } = req.body;

        const user = await User.findById(req.user._id).populate('skills.skillId');

        if (!openai) {
            // Fallback: Rule-based recommendations
            return res.json({
                recommendations: generateFallbackRecommendations(skillGaps || [], user),
                mode: 'rule-based',
                message: 'AI tutor is using rule-based recommendations (OpenAI API key not configured)'
            });
        }

        // Build context for OpenAI
        const userSkills = user.skills.map(s => ({
            name: s.skillId.name,
            sci: Math.round(s.sci),
            lastUsed: s.lastUsedDate
        }));

        const prompt = buildRecommendationPrompt(userSkills, skillGaps);

        const completion = await openai.chat.completions.create({
            model: aiModel,
            messages: [
                {
                    role: "system",
                    content: "You are an expert career coach and programming tutor. Provide personalized, actionable learning recommendations for students based on their current skills and gaps. Be encouraging, specific, and practical. Focus on free or affordable resources."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 800
        });

        const recommendations = completion.choices[0].message.content;

        res.json({
            recommendations,
            mode: `ai-powered (${aiProvider})`,
            provider: aiProvider,
            model: aiModel,
            userSkills,
            skillGaps
        });

    } catch (error) {
        console.error('AI Tutor recommendation error:', error);

        // Fallback on error
        const user = await User.findById(req.user._id).populate('skills.skillId');
        res.json({
            recommendations: generateFallbackRecommendations(req.body.skillGaps || [], user),
            mode: 'rule-based (fallback)',
            error: 'AI service temporarily unavailable'
        });
    }
});

// @route   POST /api/tutor/chat
// @desc    Interactive chat with AI tutor
// @access  Private (student only)
router.post('/chat', protect, authorize('student'), async (req, res) => {
    try {
        const { message, conversationHistory } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Please provide a message' });
        }

        const user = await User.findById(req.user._id).populate('skills.skillId');

        if (!openai) {
            return res.json({
                reply: "I'm currently in basic mode. Here's what I can help with:\n\n" +
                    "• Review your skill gap analysis in the Gap Analysis page\n" +
                    "• Take assessments to improve your SCI scores\n" +
                    "• Check the Career Path page to see progression opportunities\n\n" +
                    "For full AI-powered guidance, please configure the OpenAI API key.",
                mode: 'fallback'
            });
        }

        // Build user context
        const userContext = buildUserContext(user);

        const messages = [
            {
                role: "system",
                content: `You are a helpful AI tutor for TalentBridge, a skill-first career platform. Help students improve their skills, understand their gaps, and provide learning guidance.\n\nUser Context:\n${userContext}\n\nBe encouraging, specific, and actionable. Recommend free/affordable resources when possible.`
            }
        ];

        // Add conversation history
        if (conversationHistory && conversationHistory.length > 0) {
            messages.push(...conversationHistory.slice(-6)); // Last 3 exchanges
        }

        messages.push({
            role: "user",
            content: message
        });

        const completion = await openai.chat.completions.create({
            model: aiModel,
            messages,
            temperature: 0.8,
            max_tokens: 500
        });

        const reply = completion.choices[0].message.content;

        res.json({
            reply,
            mode: `ai-powered (${aiProvider})`,
            provider: aiProvider,
            model: aiModel
        });

    } catch (error) {
        console.error('AI Tutor chat error:', error);
        res.status(500).json({
            message: 'Error communicating with AI tutor',
            reply: "I'm having trouble processing your request right now. Please try again or check your skill analysis in the Gap Analysis section."
        });
    }
});

// Helper function to build recommendation prompt
function buildRecommendationPrompt(userSkills, skillGaps) {
    let prompt = "I'm a student working on improving my skills. Here's my current situation:\n\n";

    prompt += "**My Current Skills:**\n";
    userSkills.forEach(skill => {
        prompt += `- ${skill.name}: SCI ${skill.sci}/100\n`;
    });

    if (skillGaps && skillGaps.length > 0) {
        prompt += "\n**Skills I Need to Develop:**\n";
        skillGaps.forEach(gap => {
            prompt += `- ${gap.skillName}: Need SCI ${gap.targetSCI || 60}+ (Current: ${gap.currentSCI || 0})\n`;
        });
    }

    prompt += "\nPlease provide:\n";
    prompt += "1. A personalized learning plan prioritizing the most important skills\n";
    prompt += "2. Specific free/affordable resources (courses, projects, documentation)\n";
    prompt += "3. Practical steps to take in the next 2-4 weeks\n";
    prompt += "4. Tips to improve my SCI scores through practice and projects";

    return prompt;
}

// Helper function to build user context
function buildUserContext(user) {
    const skills = user.skills
        .filter(s => s.skillId) // Filter out skills without skillId
        .map(s => `${s.skillId?.name || 'Unknown Skill'} (SCI: ${Math.round(s.sci || 0)})`)
        .join(', ');

    return `Student Profile:
- Name: ${user.profile?.name || 'Student'}
- Current Skills: ${skills || 'None yet'}
- Total Skills: ${user.skills.length}`;
}

// Fallback recommendations (rule-based)
function generateFallbackRecommendations(skillGaps, user) {
    if (!skillGaps || skillGaps.length === 0) {
        return `**Getting Started with TalentBridge**

You're off to a great start! Here's how to maximize your learning:

1. **Add Your Skills**: Visit the Skills Management page to add skills you know
2. **Take Assessments**: Build your SCI (Skill Confidence Index) by taking timed assessments
3. **Analyze Gaps**: Use Gap Analysis to see what skills you need for target roles
4. **Practice Regularly**: Your SCI decays over time - keep skills fresh!

**Recommended Next Steps:**
- Add 3-5 core skills you're comfortable with
- Take at least one assessment this week
- Check Gap Analysis for a role you're interested in`;
    }

    let recommendations = `**Personalized Learning Plan**\n\n`;
    recommendations += `Based on your skill gaps, here's a focused learning path:\n\n`;

    skillGaps.slice(0, 3).forEach((gap, index) => {
        recommendations += `**${index + 1}. ${gap.skillName}**\n`;
        recommendations += `   Current: ${gap.currentSCI || 0}/100 → Target: ${gap.targetSCI || 60}/100\n`;
        recommendations += `   ${getSkillRecommendation(gap.skillName)}\n\n`;
    });

    recommendations += `**General Tips:**\n`;
    recommendations += `- Focus on one skill at a time for 2-3 weeks\n`;
    recommendations += `- Build projects to reinforce learning\n`;
    recommendations += `- Retake assessments after practicing\n`;
    recommendations += `- Join online communities for support\n`;

    return recommendations;
}

// Skill-specific recommendations
function getSkillRecommendation(skillName) {
    const recommendations = {
        'JavaScript': '📚 Resources: freeCodeCamp, JavaScript.info, MDN Web Docs\n   🎯 Practice: Build 3 small projects (calculator, to-do app, quiz)',
        'Python': '📚 Resources: Python.org tutorial, Real Python, Automate the Boring Stuff\n   🎯 Practice: Solve problems on LeetCode, build automation scripts',
        'React': '📚 Resources: React.dev official docs, freeCodeCamp React course\n   🎯 Practice: Build a portfolio site, contribute to open source',
        'Node.js': '📚 Resources: Node.js docs, freeCodeCamp Backend course\n   🎯 Practice: Build REST APIs, authentication system',
        'SQL': '📚 Resources: SQLBolt, Mode SQL Tutorial, W3Schools\n   🎯 Practice: Design databases, write complex queries',
        'Git': '📚 Resources: GitHub Learning Lab, Atlassian Git Tutorial\n   🎯 Practice: Contribute to open source, manage personal projects'
    };

    return recommendations[skillName] ||
        '📚 Resources: Search for free courses on Coursera, Udemy, YouTube\n   🎯 Practice: Build real projects, contribute to open source';
}

module.exports = router;
