const mongoose = require('mongoose');

const StepSchema = new mongoose.Schema({
    title: { type: String, required: true },
    topics: [{ type: String }],
    resources: [{
        platform: { type: String, enum: ['YouTube', 'Udemy', 'Other'] },
        title: { type: String },
        url: { type: String }
    }]
});

const RoadmapSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // slug-like id, e.g. 'dsa-cpp'
    domain: { type: String, required: true },
    description: { type: String },
    duration: { type: String }, // e.g. "6-8 Months"
    level: { type: String }, // Beginner, Intermediate, Advanced
    icon: { type: String, default: 'school' },
    steps: [StepSchema],
    isPublished: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Roadmap', RoadmapSchema);
