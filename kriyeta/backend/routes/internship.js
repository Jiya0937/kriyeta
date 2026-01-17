const express = require("express");
const router = express.Router();
const Internship = require("../models/Internship");

// GET all internships (Public for students, Admin uses this too for list)
router.get("/", async (req, res) => {
    try {
        const internships = await Internship.find().sort({ postedAt: -1 });
        res.json(internships);
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

// POST create internship (Admin only - practically)
router.post("/create", async (req, res) => {
    try {
        const newInternship = new Internship(req.body);
        await newInternship.save();
        res.status(201).json(newInternship);
    } catch (err) {
        res.status(500).json({ error: "Failed to create internship" });
    }
});

// DELETE internship
router.delete("/:id", async (req, res) => {
    try {
        await Internship.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete" });
    }
});

module.exports = router;
