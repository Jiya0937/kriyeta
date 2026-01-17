const ResumeAnalysis = require('../models/ResumeAnalysis');
const aiService = require('../services/aiService');

exports.analyzeResume = async (req, res) => {
    try {
        const { studentId, resumeText } = req.body;

        if (!studentId) {
            return res.status(400).json({ msg: "Student ID is required" });
        }

        // 1. Perform Analysis via Service
        const result = aiService.calculateScore(resumeText || "javascript node.js"); // Fallback for demo if text not extracted

        // 2. Save Result
        const analysis = new ResumeAnalysis({
            studentId,
            resumeScore: result.score,
            feedback: result.analysis
        });

        await analysis.save();

        res.json({ success: true, data: analysis });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error in AI Insight Module");
    }
};

exports.getStudentHistory = async (req, res) => {
    try {
        const { studentId } = req.params;
        const history = await ResumeAnalysis.find({ studentId }).sort({ createdAt: -1 });
        res.json(history);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
