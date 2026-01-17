const express = require("express");
const router = express.Router();
const Placement = require("../models/Placement");

// GET /api/placements
// Public route for students to view placement opportunities
router.get("/", async (req, res) => {
    try {
        // Fetch specific fields or all. Admin route fetches all.
        // Sort by latest posted (postedAt)
        const placements = await Placement.find().sort({ postedAt: -1 });
        res.json(placements);
    } catch (err) {
        console.error("GET PLACEMENTS ERROR:", err);
        res.status(500).json({ message: "Server error fetching placements" });
    }
});

module.exports = router;
