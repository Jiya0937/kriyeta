const express = require("express");
const router = express.Router();
const Hackathon = require("../models/Hackathon");

// GET all hackathons
router.get("/", async (req, res) => {
    try {
        const hacks = await Hackathon.find().sort({ postedAt: -1 });
        res.json(hacks);
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

// POST create hackathon
router.post("/create", async (req, res) => {
    try {
        const newHack = new Hackathon(req.body);
        await newHack.save();
        res.status(201).json(newHack);
    } catch (err) {
        res.status(500).json({ error: "Failed to create hackathon" });
    }
});

// DELETE hackathon
router.delete("/:id", async (req, res) => {
    try {
        await Hackathon.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete" });
    }
});

module.exports = router;
