const mongoose = require('mongoose');

const LearningActivitySchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    enrollmentNo: { type: String, required: true },
    date: { type: Date, default: Date.now },
    domain: { type: String, required: true },        // "Data Science", "Web Dev" - matches Roadmap ID or Title
    activityType: { type: String, required: true }, // "video", "roadmap_view", "practice", "step_complete"
    duration: { type: Number, default: 0 },     // minutes
    source: { type: String },       // "youtube", "udemy", "internal"
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LearningActivity', LearningActivitySchema);
