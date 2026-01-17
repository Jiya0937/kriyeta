const mongoose = require('mongoose');

const ResumeAnalysisSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', // References the student but enforces no cascade delete or strict relational constraints
        required: true
    },
    resumeScore: {
        type: Number,
        required: true
    },
    feedback: {
        type: Object, // Flexible field for storing structured feedback/suggestions
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ResumeAnalysis', ResumeAnalysisSchema);
