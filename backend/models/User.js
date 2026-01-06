const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'company'],
        required: true
    },
    profile: {
        name: {
            type: String,
            required: true
        },
        education: String,
        experience: Number,
        careerGoals: String,
        // Company-specific fields
        companyName: String,
        industry: String
    },
    skills: [{
        skillId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill'
        },
        selfRating: {
            type: Number,
            min: 1,
            max: 5,
            default: 3
        },
        lastUsedDate: {
            type: Date,
            required: true
        },
        assessmentScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        freshnessScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        scenarioScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        sci: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        lastAssessed: Date,
        category: {
            type: String,
            enum: ['core', 'tools', 'soft'],
            default: 'core'
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
