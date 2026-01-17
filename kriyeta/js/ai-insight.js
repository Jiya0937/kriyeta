/**
 * AI Insight Module - Client Side Logic
 * Handles Resume Upload, Score Visualization, and Feedback Rendering
 */

document.addEventListener("DOMContentLoaded", () => {
    const aiNav = document.querySelector('.nav-item-v2[data-target="section-ai"]');
    if (aiNav) {
        aiNav.addEventListener('click', loadAIInsights);
    }
});

function loadAIInsights() {
    const section = document.getElementById('section-ai');

    // Inject CSS
    if (!document.getElementById('ai-insight-css')) {
        const link = document.createElement('link');
        link.id = 'ai-insight-css';
        link.rel = 'stylesheet';
        link.href = 'ai-insight.css';
        document.head.appendChild(link);
    }

    // Render Markup
    section.innerHTML = `
        <div class="ai-header-main">
            <div>
                <h2>AI Career Insights <span class="badge" style="background:#4f46e5; color:white; font-size:0.7rem;">BETA</span></h2>
                <p style="color:#64748b;">Optimize your resume with our rule-based scoring engine.</p>
            </div>
        </div>

        <div class="ai-grid">
            <!-- Upload Column -->
            <div class="ai-card">
                <h3>Resume Analysis</h3>
                <p style="font-size:0.9rem; color:#64748b; margin-bottom:1.5rem;">Upload your resume (PDF/DOCX) to get a comprehensive score.</p>
                
                <div class="upload-area" id="drop-zone">
                    <span class="material-icons-round upload-icon">cloud_upload</span>
                    <p style="font-weight:500;">Drag & drop your resume here</p>
                    <p style="font-size:0.8rem; color:#94a3b8; margin: 0.5rem 0 1.5rem;">Supported formats: PDF, DOCX (Max 5MB)</p>
                    <button class="btn-upload" onclick="document.getElementById('resume-file-input').click()">Browse Files</button>
                    <input type="file" id="resume-file-input" hidden accept=".pdf,.doc,.docx">
                </div>

                <div class="ai-loader" id="ai-loader">
                    <div class="spinner"></div>
                    <p>Analyzing resume content...</p>
                    <small style="color:#64748b;">Checking formatting, skills, and impact...</small>
                </div>
            </div>

            <!-- Results Column -->
            <div class="ai-card" id="ai-results-card" style="display:none; opacity:0;">
                <div class="score-container">
                    <div class="score-circle-lg" id="score-meter">
                        <span class="score-text" id="score-value">--</span>
                    </div>
                    <h4>Resume Impact Score</h4>
                    <p id="score-verdict" style="color:#64748b;">Good start, but needs work.</p>
                </div>

                <div class="feedback-grid">
                    <!-- Strengths -->
                    <div class="feedback-card fc-strengths">
                        <h4><span class="material-icons-round">thumb_up</span> Strengths</h4>
                        <ul class="feedback-list" id="list-strengths"></ul>
                    </div>

                    <!-- Weaknesses -->
                    <div class="feedback-card fc-weaknesses">
                        <h4><span class="material-icons-round">thumb_down</span> Needs Focus</h4>
                        <ul class="feedback-list" id="list-weaknesses">
                             <!-- Fallback if empty -->
                             <li>Resume analysis pending...</li>
                        </ul>
                    </div>
                    
                    <!-- Suggestions -->
                    <div class="feedback-card fc-suggestions">
                        <h4><span class="material-icons-round">lightbulb</span> AI Recommendations</h4>
                        <ul class="feedback-list" id="list-suggestions">
                            <li>Upload a file to see actionable tips here.</li>
                        </ul>
                        <div style="margin-top:1rem; padding-top:1rem; border-top:1px solid #bfdbfe;">
                            <strong>Missing Skills:</strong>
                            <div class="skills-container" id="list-missing-skills">
                                <!-- Chips -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Empty State for Results -->
            <div class="ai-card" id="ai-empty-state" style="display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; min-height:400px; color:#94a3b8;">
                <span class="material-icons-round" style="font-size:4rem; opacity:0.3;">analytics</span>
                <p style="margin-top:1rem;">Your analysis results will appear here.</p>
            </div>
        </div>
    `;

    setupDragAndDrop();
    setupFileInput();
}

function setupFileInput() {
    const input = document.getElementById('resume-file-input');
    if (input) {
        input.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileUpload(e.target.files[0]);
            }
        });
    }
}

function setupDragAndDrop() {
    const dropZone = document.getElementById('drop-zone');
    if (!dropZone) return;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    dropZone.addEventListener('dragover', () => dropZone.classList.add('dragover'));
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => {
        dropZone.classList.remove('dragover');
        const dt = e.dataTransfer;
        if (dt.files.length > 0) {
            handleFileUpload(dt.files[0]);
        }
    });
}

async function handleFileUpload(file) {
    if (!file) return;

    // UI Updates
    document.getElementById('drop-zone').style.display = 'none';
    document.getElementById('ai-loader').style.display = 'flex';
    document.getElementById('ai-results-card').style.display = 'none';
    document.getElementById('ai-empty-state').style.display = 'none';

    const formData = new FormData();
    formData.append('resume', file);

    // Attach Student ID if logged in
    const user = JSON.parse(localStorage.getItem("Student"));
    if (user && user._id) {
        formData.append('studentId', user._id);
    }

    try {
        // Use the new AIServiceAPI
        const result = await AIServiceAPI.uploadResume(file, user ? user._id : null);

        if (result.success) {
            renderResults(result.data);
        } else {
            alert('Analysis failed: ' + (result.msg || 'Unknown error'));
            resetUploadUI();
        }

    } catch (err) {
        console.error(err);
        alert('Error: ' + err.message);
        resetUploadUI();
    }
}

function renderResults(data) {
    document.getElementById('ai-loader').style.display = 'none';
    const resultsCard = document.getElementById('ai-results-card');
    resultsCard.style.display = 'block';

    // Small timeout to allow display:block to apply before opacity transition
    setTimeout(() => {
        resultsCard.style.opacity = '1';
    }, 50);

    const score = data.resumeScore || data.score || 0;
    const feedback = data.feedback || {};

    // 1. Score Meter
    const scoreEl = document.getElementById('score-value');
    const circle = document.getElementById('score-meter');
    animateValue(scoreEl, 0, score, 1000);
    circle.style.background = `conic-gradient(#4f46e5 ${score}%, #e2e8f0 ${score}%)`;

    // Verdict
    const verdictEl = document.getElementById('score-verdict');
    if (score >= 80) verdictEl.innerText = "Excellent! Ready for top companies.";
    else if (score >= 60) verdictEl.innerText = "Good, but needs refinement.";
    else verdictEl.innerText = "Needs significant improvement.";

    // 2. Strengths
    const strList = document.getElementById('list-strengths');
    // Combine Rule-Based/AI strengths
    const strengths = feedback.ai_strengths || []; // or from scores
    // If empty, infer from score
    if (strengths.length === 0 && score > 50) strengths.push("Basic formatting is correct");

    strList.innerHTML = strengths.map(s => `<li>${s}</li>`).join('') || '<li style="color:#94a3b8">No specific strengths detected.</li>';

    // 3. Weaknesses/Improvements
    const weakList = document.getElementById('list-weaknesses');
    const weaknesses = feedback.ai_weaknesses || feedback.suggestions || [];
    weakList.innerHTML = weaknesses.slice(0, 3).map(w => `<li>${w}</li>`).join('') || '<li style="color:#94a3b8">Optimization needed.</li>';

    // 4. Suggestions
    const suggList = document.getElementById('list-suggestions');
    const suggestions = feedback.ai_suggestions || [];
    suggList.innerHTML = suggestions.map(s => `<li>${s}</li>`).join('') || '<li>Review our resume guide for tips.</li>';

    // 5. Missing Skills
    const skillContainer = document.getElementById('list-missing-skills');
    const missing = feedback.ai_missing_skills || [];
    skillContainer.innerHTML = missing.map(s => `<span class="skill-chip-missing">${s}</span>`).join('') || '<span style="font-size:0.8rem; color:#94a3b8">No specific skills listed as missing</span>';
}

function resetUploadUI() {
    document.getElementById('drop-zone').style.display = 'block';
    document.getElementById('ai-loader').style.display = 'none';
    document.getElementById('ai-empty-state').style.display = 'flex';
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
