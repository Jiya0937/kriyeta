const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extracts text from a resume file (PDF or DOCX).
 * @param {string} filePath - Absolute path to the file.
 * @param {string} mimeType - MIME type of the file.
 * @returns {Promise<string>} - Extracted text.
 */
const extractTextFromResume = async (filePath, mimeType) => {
    try {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found at path: ${filePath}`);
        }

        if (mimeType === 'application/pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            return data.text;
        }
        else if (
            mimeType === 'application/msword' ||
            mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
            const result = await mammoth.extractRawText({ path: filePath });
            return result.value;
        }

        throw new Error('Unsupported file type. Only PDF and DOCX are supported.');
    } catch (error) {
        console.error('Resume Extraction Error:', error.message);
        throw error; // Re-throw to be handled by caller
    }
};

module.exports = { extractTextFromResume };
