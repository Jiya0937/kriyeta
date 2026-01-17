/**
 * AI Insight Module - Frontend Logic
 * Strictly isolated module for Resume Score Prediction
 */

document.addEventListener("DOMContentLoaded", () => {
    // Attach listener to the sidebar menu item to load this module
    const aiNav = document.querySelector('.nav-item-v2[data-target="section-ai"]');
    if (aiNav) {
        aiNav.addEventListener('click', loadAIInsights);
    }
});

let isAiLoaded = false;

function loadAIInsights() {
    const section = document.getElementById('section-ai');

    // Inject CSS if not already present
    if (!document.getElementById('ai-insight-css')) {
        const link = document.createElement('link');
        link.id = 'ai-insight-css';
        link.rel = 'stylesheet';
        link.href = 'ai-insight.css';
        document.head.appendChild(link);
    }

    // Render HTML structure
    section.innerHTML = `
        <h2>AI Career Insights <span class="badge" style="background:#4f46e5; color:white; font-size:0.7rem; vertical-align:middle; margin-left:0.5rem;">BETA</span></h2>
        <div class="ai-container">
            <!-- Analysis Card -->
            <div class="ai-card">
                <div class="ai-header">
                    <h3>Resume Score Predictor</h3>
                    <span class="material-icons-round" style="color:#4f46e5;">analytics</span>
                </div>
                
                <div class="ai-input-area">
                    <p style="font-size:0.9rem; color:#666; margin-bottom:0.5rem;">Paste your resume text below for instant AI analysis:</p>
                    <textarea id="ai-resume-text" placeholder="Paste your resume content here (Skills, Experience, Projects)..."></textarea>
                    <button class="btn-ai" onclick="analyzeResume()">
                        <span class="material-icons-round">auto_awesome</span>
                        Analyze Resume
                    </button>
                </div>

                <div id="ai-result-area" style="display:none; margin-top:1.5rem; text-align:center;">
                    <div class="ai-score-circle" id="score-circle">
                         <div class="score-value" id="score-display">0</div>
                    </div>
                    <p class="score-label">Resume Impact Score</p>
                </div>
            </div>

            <!-- Insights & History -->
            <div class="ai-card">
                <div class="ai-header">
                    <h3>Detailed Insights</h3>
                </div>
                
                <div id="ai-insights-list">
                    <div style="text-align:center; color:#999; padding:2rem;">
                        <span class="material-icons-round" style="font-size:3rem; opacity:0.3;">lightbulb</span>
                        <p>Run an analysis to see insights here.</p>
                    </div>
                </div>

                <div class="ai-header" style="margin-top:2rem; border-top:1px solid #eee; padding-top:1rem;">
                    <h3>History</h3>
                </div>
                <div class="history-list" id="ai-history-list">
                    <!-- History injected here -->
                </div>
            </div>
        </div>
    `;

    // Load History immediately
    fetchHistory();
}

async function analyzeResume() {
    const text = document.getElementById('ai-resume-text').value;
    if (!text.trim()) {
        alert("Please paste some text from your resume first.");
        return;
    }

    const btn = document.querySelector('.btn-ai');
    const originalText = btn.innerHTML;
    btn.innerHTML = `<span class="material-icons-round">sync</span> Analyzing...`;
    btn.disabled = true;

    try {
        const user = JSON.parse(localStorage.getItem("Student"));
        if (!user || !user._id) {
            alert("Please login first.");
            return;
        }

        const res = await fetch('http://localhost:5000/api/ai-insight/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                studentId: user._id,
                resumeText: text
            })
        });

        const data = await res.json();

        if (data.success) {
            displayResults(data.data);
            fetchHistory(); // Refresh history
        } else {
            alert("Analysis failed. Please try again.");
        }

    } catch (err) {
        console.error(err);
        alert("Error connecting to AI service.");
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

function displayResults(data) {
    const scoreVal = data.resumeScore;
    const insights = data.feedback;

    // Show result area
    document.getElementById('ai-result-area').style.display = 'block';

    // Animate Score
    const scoreEl = document.getElementById('score-display');
    const circle = document.getElementById('score-circle');

    // Update Gradient
    circle.style.background = `conic-gradient(#4f46e5 ${scoreVal}%, #e0e7ff ${scoreVal}%)`;
    scoreEl.textContent = scoreVal;

    // Render Insights
    const list = document.getElementById('ai-insights-list');
    let html = `<ul class="suggestion-list">`;

    if (insights.suggestions && insights.suggestions.length > 0) {
        insights.suggestions.forEach(s => {
            html += `
                <li class="suggestion-item">
                    <span class="material-icons-round suggestion-icon">check_circle</span>
                    <div>${s}</div>
                </li>
            `;
        });
    }

    if (insights.matchedKeywords && insights.matchedKeywords.length > 0) {
        html += `
                <li class="suggestion-item">
                    <span class="material-icons-round suggestion-icon">code</span>
                    <div><strong>Detected Skills:</strong> ${insights.matchedKeywords.join(', ')}</div>
                </li>
            `;
    }

    html += `</ul>`;
    list.innerHTML = html;
}

async function fetchHistory() {
    try {
        const user = JSON.parse(localStorage.getItem("Student"));
        if (!user || !user._id) return;

        const res = await fetch(`http://localhost:5000/api/ai-insight/history/${user._id}`);
        const history = await res.json();

        const list = document.getElementById('ai-history-list');
        if (history.length === 0) {
            list.innerHTML = '<p style="color:#999; text-align:center;">No history available.</p>';
            return;
        }

        list.innerHTML = history.map(item => `
            <div class="history-item">
                <span>${new Date(item.createdAt).toLocaleDateString()}</span>
                <span class="score-badge">Score: ${item.resumeScore}</span>
            </div>
        `).join('');

    } catch (err) {
        console.error("Failed to load history", err);
    }
}
