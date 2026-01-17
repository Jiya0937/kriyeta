const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const path = require('path');
const aiService = require('../services/aiService');

// Configure Multer for PDF/DOCX only
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ensure uploads directory exists
        const uploadDir = 'uploads/temp';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF and DOCX are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @route   POST /api/ai-insight/resume-score
// @desc    Upload resume, extract text, and return analysis
// @access  Public (for demo purposes)
router.post('/resume-score', upload.single('resume'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ msg: "No file uploaded" });
    }

    try {
        const filePath = req.file.path;
        const fileType = req.file.mimetype;

        // Use the Service Layer to handle parsing + scoring
        const analysisResult = await aiService.analyzeResumeFile(filePath, fileType);

        // Clean up file
        fs.unlinkSync(filePath);

        // Return JSON response with both text and score data
        res.json({
            success: true,
            data: {
                extractedText: analysisResult.text.trim(),
                score: analysisResult.score,
                feedback: analysisResult.analysis,
                originalName: req.file.originalname
            }
        });

    } catch (err) {
        console.error("Resume Processing Error:", err);
        res.status(500).json({ msg: "Error processing resume file", error: err.message });
    }
});

module.exports = router;
