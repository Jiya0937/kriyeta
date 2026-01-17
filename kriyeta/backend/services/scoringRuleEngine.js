/**
 * Rule-Based Resume Scoring Engine for Freshers/Campus Placements
 * 
 * Criteria Breakdown (Total 100):
 * 1. Contact & Formatting (15%): Email, Phone, LinkedIn, GitHub, Length.
 * 2. Education (20%): Degree, CGPA/Percentage, Branch.
 * 3. Skills (25%): Technical, Soft Skills, Tools.
 * 4. Projects (25%): Presence, Complexity indicators.
 * 5. Experience/Internships (15%): "Intern", "Experience" sections.
 */

const SECTIONS = {
    education: ['education', 'academic', 'qualification', 'b.tech', 'be', 'b.sc', 'degree'],
    skills: ['skills', 'technical skills', 'technologies', 'proficiency', 'languages'],
    projects: ['projects', 'academic projects', 'personal projects'],
    experience: ['experience', 'internship', 'work history', 'industrial training'],
    achievements: ['achievements', 'certifications', 'awards', 'activities', 'honors']
};

const TECH_KEYWORDS = [
    'java', 'python', 'c++', 'c', 'javascript', 'typescript', 'html', 'css',
    'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring',
    'sql', 'mysql', 'mongodb', 'postgresql', 'firebase', 'aws', 'azure', 'docker',
    'git', 'github', 'linux', 'machine learning', 'ai', 'data structure', 'algorithm'
];

const SOFT_KEYWORDS = [
    'communication', 'teamwork', 'leadership', 'problem solving', 'analytical',
    'adaptability', 'time management', 'collaboration'
];

const ACTION_VERBS = [
    'developed', 'implemented', 'designed', 'built', 'created', 'managed', 'led',
    'analyzed', 'optimized', 'solved', 'achieved', 'secured'
];

const calculateRuleBasedScore = (text) => {
    const lowerText = text.toLowerCase();

    let score = 0;
    let sectionScores = {
        contact: 0,
        education: 0,
        skills: 0,
        projects: 0,
        experience: 0
    };
    let reasoning = [];
    let missing = [];

    // 1. Contact & Formatting (Max 15)
    // ----------------------------------------
    const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text);
    const hasPhone = /\b\d{10}\b|\b\+\d{1,3}\s?\d{10}\b/.test(text.replace(/[-\s]/g, '')); // Simple check
    const hasLinkedIn = lowerText.includes('linkedin.com');
    const hasGitHub = lowerText.includes('github.com');

    if (hasEmail) sectionScores.contact += 4; else missing.push("Email Address");
    if (hasPhone) sectionScores.contact += 4; else missing.push("Phone Number");
    if (hasLinkedIn) sectionScores.contact += 4; else reasoning.push("Adding a LinkedIn profile is highly recommended.");
    if (hasGitHub) sectionScores.contact += 3; else reasoning.push("GitHub link adds value for technical roles.");

    // Length Check (simple char count as proxy for content)
    if (text.length < 500) reasoning.push("Resume content is very sparse. Add more details.");

    score += sectionScores.contact;

    // 2. Education (Max 20)
    // ----------------------------------------
    // Check for degree Mention
    const hasDegree = lowerText.includes('b.tech') || lowerText.includes('b.e') || lowerText.includes('bachelor') || lowerText.includes('degree');
    const hasGrades = lowerText.includes('cgpa') || lowerText.includes('percentage') || lowerText.includes('gpa') || /\b\d\.\d{1,2}\b/.test(text); // e.g. 8.5

    if (hasDegree) sectionScores.education += 10; else missing.push("Degree/Branch details");
    if (hasGrades) sectionScores.education += 10; else reasoning.push("Mentioning CGPA/Percentage is standard for freshers.");

    score += sectionScores.education;

    // 3. Skills (Max 25)
    // ----------------------------------------
    let detectedSkills = [];
    TECH_KEYWORDS.forEach(k => {
        if (lowerText.includes(k)) detectedSkills.push(k);
    });

    // Score based on count
    if (detectedSkills.length >= 8) sectionScores.skills = 25;
    else if (detectedSkills.length >= 5) sectionScores.skills = 20;
    else if (detectedSkills.length >= 3) sectionScores.skills = 10;
    else sectionScores.skills = 5;

    if (detectedSkills.length < 5) reasoning.push("Low technical skill count. Learn and list more relevant technologies.");

    score += sectionScores.skills;

    // 4. Projects (Max 25)
    // ----------------------------------------
    // Check for section header or keywords
    const hasProjectsSection = SECTIONS.projects.some(k => lowerText.includes(k));
    let actionVerbCount = 0;
    ACTION_VERBS.forEach(v => {
        if (lowerText.includes(v)) actionVerbCount++;
    });

    if (hasProjectsSection) {
        sectionScores.projects += 10;
        // Check for depth via action verbs (proxy for description quality)
        if (actionVerbCount >= 5) sectionScores.projects += 15;
        else if (actionVerbCount >= 2) sectionScores.projects += 10;
        else sectionScores.projects += 5;
    } else {
        missing.push("Projects Section");
        reasoning.push("Projects are critical for freshers. Add at least 2 significant projects.");
    }

    score += sectionScores.projects;

    // 5. Experience / Internships (Max 15)
    // ----------------------------------------
    const hasInternship = SECTIONS.experience.some(k => lowerText.includes(k));
    if (hasInternship) {
        sectionScores.experience = 15;
    } else {
        reasoning.push(" internships or industrial training can significantly boost your score.");
        // Give partial points if they have good projects/achievements to compensate?
        // Staying strict for now.
    }
    score += sectionScores.experience;


    // Final Compilation
    return {
        score: Math.min(100, Math.max(0, score)),
        breakdown: sectionScores,
        reasoning: reasoning, // Improvements
        missing: missing, // Critical faults
        skillsDetected: detectedSkills.slice(0, 10) // Top 10
    };
};

module.exports = { calculateRuleBasedScore };
