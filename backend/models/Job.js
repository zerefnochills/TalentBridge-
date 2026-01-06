const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requiredSkills: [{
        skillId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill',
            required: true
        },
        importance: {
            type: Number,
            min: 1,
            max: 5,
            default: 3
        },
        minSCI: {
            type: Number,
            min: 0,
            max: 100,
            default: 50
        }
    }],
    applications: [{
        candidateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        appliedAt: {
            type: Date,
            default: Date.now
        },
        skillMatchPercentage: Number,
        ranking: Number
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    }
});

module.exports = mongoose.model('Job', jobSchema);
