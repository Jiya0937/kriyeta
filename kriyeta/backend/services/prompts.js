/**
 * AI Prompts for the AI Insight Module
 * Stores prompt templates for communicating with GenAI models (e.g. Gemini, OpenAI)
 */

const RESUME_EVALUATION_PROMPT = `
You are an expert technical recruiter and resume analyzer for campus placements (Freshers).
Analyze the following resume text extracted from a candidate's document.

TARGET ROLE: Software Engineer / Full Stack Developer / Data Analyst (Entry Level)

RESUME TEXT:
"""
{{RESUME_TEXT}}
"""

INSTRUCTIONS:
1. Analyze the resume for:
   - Impact: Use of action verbs (e.g., "Developed", "Optimized") and quantified metrics.
   - Relevance: Presence of modern tech stacks (React, Node.js, Python, SQL, Cloud).
   - Completeness: Presence of Education, Skills, Projects, and Internships/Experience sections.
   - Formatting/Clarity: Is the text well-structured and professional?

2. Provide a strict JSON response with the following structure:
{
  "score": <number_0_to_100>,
  "strengths": ["<strength_1>", "<strength_2>", ...],
  "weaknesses": ["<weakness_1>", "<weakness_2>", ...],
  "missing_skills": ["<skill_1>", "<skill_2>", ...],
  "layout_feedback": "<concise_comment_on_structure_and_presentation>",
  "suggestions": ["<actionable_improvement_1>", "<actionable_improvement_2>", ...]
}

CRITICAL: Return ONLY valid JSON. Do not include markdown formatting like \`\`\`json.
`;

module.exports = {
    RESUME_EVALUATION_PROMPT
};
