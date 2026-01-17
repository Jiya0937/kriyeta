const { extractTextFromResume } = require('../utils/resumeParser');

const { calculateRuleBasedScore } = require('./scoringRuleEngine');

// Logic for processing file + getting score
exports.analyzeResumeFile = async (filePath, mimeType) => {
    // 1. Extract Text
    const text = await extractTextFromResume(filePath, mimeType);

    // 2. Compute Score
    const result = exports.calculateScore(text);

    return {
        text,
        ...result
    };
};

// Use Rule-Based Engine
exports.calculateScore = (text) => {
    const rawResult = calculateRuleBasedScore(text);

    // Map rule engine output to the format expected by Controller/Frontend
    return {
        score: rawResult.score,
        analysis: {
            matchedKeywords: rawResult.skillsDetected,
            suggestions: [...rawResult.missing.map(m => `Missing Critical Section: ${m}`), ...rawResult.reasoning],
            formattingScore: rawResult.breakdown.contact > 10 ? 90 : 70, // Derivative metric
            breakdown: rawResult.breakdown
        }
    };
};
