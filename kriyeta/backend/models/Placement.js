const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    domain: {
        type: String, // e.g. "Software", "Core", "Finance"
        required: true
    },
    location: {
        type: String, // e.g. "Bangalore", "Mumbai"
        required: true
    },
    minStipend: {
        type: Number, // Optional, for display
        default: 0
    },
    maxStipend: {
        type: Number, // Optional, for display
        default: 0
    },
    applyLink: {
        type: String,
        required: true
    },
    description: {
        type: String, // About company or job summary
        default: ""
    },
    eligibility: {
        type: String, // e.g. "CS/IT, 2026 Batch"
        default: "All Branches"
    },
    deadline: {
        type: Date,
        required: true
    },
    postedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["Active", "Closed"],
        default: "Active"
    }
});

module.exports = mongoose.models.Placement || mongoose.model("Placement", placementSchema);
