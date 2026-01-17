const mongoose = require("mongoose");

const hackathonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    organizer: { type: String, required: true },
    mode: { type: String, required: true }, // Online/Offline
    location: { type: String, default: "Online" },
    registrationDeadline: { type: Date, required: true },
    eventDate: { type: String, required: true }, // String to allow ranges
    eligibility: { type: String, default: "Open to all" },
    prizes: { type: String, default: "Not Disclosed" },
    registerLink: { type: String, required: true },
    description: { type: String, default: "" },
    postedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["Active", "Closed"], default: "Active" }
});

module.exports = mongoose.models.Hackathon || mongoose.model("Hackathon", hackathonSchema);
