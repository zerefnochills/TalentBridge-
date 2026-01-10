const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    requiredSkills: [{
        skillId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill',
            required: true
        },
        minimumSCI: {
            type: Number,
            min: 0,
            max: 100,
            default: 60
        }
    }],
    nextRoles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }],
    avgSalary: String,
    description: String,
    workEnvironment: String,
    keyCompetencies: [String],
    learningResources: [{
        title: String,
        url: String,
        type: {
            type: String,
            enum: ['video', 'article', 'course', 'book', 'documentation']
        }
    }]
});

module.exports = mongoose.model('Role', roleSchema);
