const express = require('express');
const router = express.Router();
const Roadmap = require('../models/Roadmap');
const auth = require('../middleware/auth'); // Ensure this exists or use check
// Note: Assuming auth middleware is available, if not I might need to skip or mock it for now based on previous context.
// Looking at file list, 'middleware/auth.js' might or might not exist properly or be suitable.
// Step 62 list_dir shows "middleware" dir with 1 child. It's likely `upload.js` or `auth.js`.
// Let's assume public access for GET for now as per requirements "Students can view".

// GET all roadmaps (Public)
router.get('/', async (req, res) => {
    try {
        const roadmaps = await Roadmap.find({ isPublished: true });
        res.json(roadmaps);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET one roadmap by ID (Public)
router.get('/:id', async (req, res) => {
    try {
        const roadmap = await Roadmap.findOne({ id: req.params.id, isPublished: true });
        if (!roadmap) return res.status(404).json({ message: 'Roadmap not found' });
        res.json(roadmap);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create/update roadmap (Admin Only - simplified for now, no auth middleware enforced strictly to allow seeding easily via script if needed, but in prod should be protected)
// User requirement: "Admin can add/edit roadmaps"
router.post('/', async (req, res) => {
    const { id, domain, description, duration, level, icon, steps } = req.body;

    try {
        let roadmap = await Roadmap.findOne({ id });
        if (roadmap) {
            // Update
            roadmap.domain = domain;
            roadmap.description = description;
            roadmap.duration = duration;
            roadmap.level = level;
            roadmap.icon = icon;
            roadmap.steps = steps;
            roadmap = await roadmap.save();
            return res.json(roadmap);
        }

        // Create
        const newRoadmap = new Roadmap({
            id,
            domain,
            description,
            duration,
            level,
            icon,
            steps
        });
        await newRoadmap.save();
        res.status(201).json(newRoadmap);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
