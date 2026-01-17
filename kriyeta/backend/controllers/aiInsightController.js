const aiService = require('../services/aiService');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const fs = require('fs');

/**
 * Process Resume Upload
 * Handles file ingestion, text extraction, rule-based scoring, and AI feedback.
 */
exports.processResumeUpload = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ msg: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileType = req.file.mimetype;
    const { studentId } = req.body; // Passed via formdata

    try {
        // 1. Service Layer: Extract Text & Apply Rule-Based Scoring
        // analyzeResumeFile handles extraction + calculateRuleBasedScore internally
        const ruleBasedResult = await aiService.analyzeResumeFile(filePath, fileType);

        // 2. Service Layer: Get AI Feedback (Simulated/Real)
        const aiFeedback = await aiService.generateAIFeedback(ruleBasedResult.text);

        // 3. Merge Results
        // We prioritize Rule-Based Score for consistency, but append AI qualitative feedback
        const finalResult = {
            studentId,
            resumeScore: ruleBasedResult.score,
            feedback: {
                ...ruleBasedResult.analysis, // Rule-based keywords & structure issues
                ai_strengths: aiFeedback.strengths,
                ai_weaknesses: aiFeedback.weaknesses,
                ai_suggestions: aiFeedback.suggestions,
                ai_layout_feedback: aiFeedback.layout_feedback,
                ai_missing_skills: aiFeedback.missing_skills
            },
            extractedText: ruleBasedResult.text
        };

        // 4. Save to Database (if studentId is present)
        if (studentId) {
            const analysisEntry = new ResumeAnalysis({
                studentId,
                resumeScore: finalResult.resumeScore,
                feedback: finalResult.feedback
            });
            await analysisEntry.save();
        }

        // 5. Cleanup
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // 6. Response
        res.json({
            success: true,
            data: finalResult
        });

    } catch (err) {
        // Cleanup on error
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        console.error("Controller Error:", err.message);
        res.status(500).json({ msg: "Error processing resume", error: err.message });
    }
};

/**
 * Analyze Raw Text (Optional fallback)
 */
exports.analyzeText = async (req, res) => {
    try {
        const { studentId, resumeText } = req.body;

        // Rule Based
        const ruleResult = aiService.calculateScore(resumeText);

        // AI Feedback
        const aiFeedback = await aiService.generateAIFeedback(resumeText);

        const result = {
            resumeScore: ruleResult.score,
            feedback: {
                ...ruleResult.analysis,
                ...aiFeedback
            }
        };

        if (studentId) {
            const analysis = new ResumeAnalysis({
                studentId,
                resumeScore: result.resumeScore,
                feedback: result.feedback
            });
            await analysis.save();
        }

        res.json({ success: true, data: result });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// History (Existing)
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
