const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        enum: ['Programming', 'Frameworks', 'Tools', 'Soft Skills', 'Other'],
        default: 'Other'
    },
    description: String,
    assessmentQuestions: [{
        question: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['mcq', 'code-output', 'scenario'],
            default: 'mcq'
        },
        options: [String],
        correctAnswer: {
            type: String,
            required: true
        },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            default: 'medium'
        },
        points: {
            type: Number,
            default: 10
        }
    }]
});

module.exports = mongoose.model('Skill', skillSchema);
