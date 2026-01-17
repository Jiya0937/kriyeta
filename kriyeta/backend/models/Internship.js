const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    role: { type: String, required: true },
    domain: { type: String, required: true },
    location: { type: String, required: true },
    duration: { type: String, required: true }, // e.g. "6 Months"
    stipend: { type: String, default: "Unpaid" }, // Text to allow "10k/month"
    applyLink: { type: String, required: true },
    description: { type: String, default: "" },
    eligibility: { type: String, default: "All Branches" },
    deadline: { type: Date, required: true },
    postedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["Active", "Closed"], default: "Active" }
});

module.exports = mongoose.models.Internship || mongoose.model("Internship", internshipSchema);
