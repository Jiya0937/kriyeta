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

const { RESUME_EVALUATION_PROMPT } = require('./prompts');

// Mock GenAI Call (Simulating an LLM response)
exports.generateAIFeedback = async (resumeText) => {
    // In a real scenario, you would call OpenAI/Gemini API here using RESUME_EVALUATION_PROMPT
    // For now, we simulate a smart response based on the rule-based findings or heuristics

    return {
        score: null, // Will be merged/overridden by rule engine or AI specific score
        strengths: [
            "Clear section headers used throughout the document.",
            "Good use of action verbs in project descriptions."
        ],
        weaknesses: [
            "Summary section is generic.",
            "Lack of quantitative metrics in experience entries."
        ],
        missing_skills: ["Cloud Platforms (AWS/Azure)", "CI/CD pipelines"],
        layout_feedback: "The layout is clean, but the margin usage is inconsistent.",
        suggestions: [
            "Quantify your achievements (e.g., 'Improved performance by 20%').",
            "Tailor your skills section to the specific job description."
        ]
    };
};

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
