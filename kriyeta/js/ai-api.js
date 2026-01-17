/**
 * AI Insight Client Service
 * Handles API communication for the AI Insight module.
 */

const API_BASE_URL = 'http://localhost:5000/api/ai-insight';

class AIServiceAPI {

    /**
     * Upload resume file for analysis
     * @param {File} file - The resume file (PDF/DOCX)
     * @param {string} studentId - Optional student ID for history tracking
     * @returns {Promise<Object>} - The analysis result
     */
    static async uploadResume(file, studentId = null) {
        const formData = new FormData();
        formData.append('resume', file);
        if (studentId) {
            formData.append('studentId', studentId);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/resume-score`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.msg || 'Analysis failed');
            }

            return result;
        } catch (error) {
            console.error('AI Service API Error:', error);
            throw error;
        }
    }

    /**
     * Fetch analysis history for a student
     * @param {string} studentId 
     * @returns {Promise<Array>}
     */
    static async getHistory(studentId) {
        try {
            const response = await fetch(`${API_BASE_URL}/history/${studentId}`);
            if (!response.ok) throw new Error('Failed to fetch history');
            return await response.json();
        } catch (error) {
            console.error('AI Service API Error:', error);
            return [];
        }
    }
}

// Attach to window for global access
window.AIServiceAPI = AIServiceAPI;
