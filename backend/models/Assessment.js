const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    skillId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
        required: true
    },
    questions: [{
        questionId: mongoose.Schema.Types.ObjectId,
        userAnswer: String
    }],
    score: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    completedAt: {
        type: Date,
        default: Date.now
    },
    timeTaken: {
        type: Number, // in seconds
        required: true
    }
});

module.exports = mongoose.model('Assessment', assessmentSchema);
