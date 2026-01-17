const express = require('express');
const router = express.Router();
const aiInsightController = require('../controllers/aiInsightController');

// @route   POST /api/ai-insight/analyze
// @desc    Analyze a resume and get a score
// @access  Public (should be Protected in production, but keeping open for demo integration ease as per instructions)
router.post('/analyze', aiInsightController.analyzeResume);

// @route   GET /api/ai-insight/history/:studentId
// @desc    Get analysis history for a student
// @access  Public
router.get('/history/:studentId', aiInsightController.getStudentHistory);

module.exports = router;
