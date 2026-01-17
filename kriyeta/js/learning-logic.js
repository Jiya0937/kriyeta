document.addEventListener('DOMContentLoaded', () => {
    fetchRoadmaps();
    fetchLearningAnalytics();
});

let roadmapData = [];

async function fetchLearningAnalytics() {
    const user = JSON.parse(localStorage.getItem('Student'));
    if (!user || !user._id) return;

    try {
        const res = await fetch(`http://localhost:5000/api/learning/summary/${user._id}`);
        if (!res.ok) throw new Error("Failed to fetch analytics");
        const data = await res.json();

        renderAnalytics(data);
    } catch (err) {
        console.error("Analytics error:", err);
    }
}

function renderAnalytics(data) {
    // 1. Summary Cards
    const summaryContainer = document.getElementById('analytics-summary');
    if (summaryContainer) {
        summaryContainer.innerHTML = `
            <div class="stat-card-rich">
                <div class="stat-header-rich">
                    <div class="stat-icon-rich" style="background:#e8f0fe; color:var(--primary-color);">
                        <span class="material-icons-round">schedule</span>
                    </div>
                    <span class="stat-value-rich">${data.totalHours}h</span>
                </div>
                <div class="stat-label-rich">Total Learning Time</div>
            </div>
            <div class="stat-card-rich">
                <div class="stat-header-rich">
                    <div class="stat-icon-rich" style="background:#e6f4ea; color:#34a853;">
                        <span class="material-icons-round">calendar_today</span>
                    </div>
                    <span class="stat-value-rich">${data.activeDays}</span>
                </div>
                <div class="stat-label-rich">Active Days</div>
            </div>
            <div class="stat-card-rich">
                <div class="stat-header-rich">
                    <div class="stat-icon-rich" style="background:#fef7e0; color:#f9ab00;">
                        <span class="material-icons-round">local_fire_department</span>
                    </div>
                    <span class="stat-value-rich">${data.streak}</span>
                </div>
                <div class="stat-label-rich">Day Streak</div>
            </div>
            <div class="stat-card-rich">
                <div class="stat-header-rich">
                    <div class="stat-icon-rich" style="background:#fce8e6; color:#ea4335;">
                        <span class="material-icons-round">school</span>
                    </div>
                    <span class="stat-value-rich">${data.enrolledCourses}</span>
                </div>
                <div class="stat-label-rich">Domains Explored</div>
            </div>
        `;
    }

    // 2. Domain Progress
    const progressContainer = document.getElementById('domain-progress-container');
    if (progressContainer) {
        progressContainer.innerHTML = '';
        if (data.domainWiseProgress.length === 0) {
            progressContainer.innerHTML = '<p class="text-muted">Start learning to see progress!</p>';
        } else {
            data.domainWiseProgress.forEach(d => {
                const color = getRandomColor(d.domain);
                const item = document.createElement('div');
                item.style.textAlign = 'center';
                item.style.width = '100px';

                const canvasId = `chart-domain-${d.domain.replace(/[^a-zA-Z0-9]/g, '-')}`;
                item.innerHTML = `
                    <div style="width:80px; height:80px; margin:0 auto; position:relative;">
                        <canvas id="${canvasId}"></canvas>
                        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); font-weight:bold; font-size:0.9rem;">
                            ${d.progress}%
                        </div>
                    </div>
                    <div style="font-size:0.8rem; font-weight:600; margin-top:0.5rem; color:#444;">${d.domain}</div>
                    <div style="font-size:0.7rem; color:#888;">${d.hours} hrs</div>
                `;
                progressContainer.appendChild(item);

                setTimeout(() => {
                    const ctx = document.getElementById(canvasId);
                    if (ctx) {
                        new Chart(ctx, {
                            type: 'doughnut',
                            data: {
                                labels: ['Done', 'Left'],
                                datasets: [{
                                    data: [d.progress, 100 - d.progress],
                                    backgroundColor: [color, '#f0f0f0'],
                                    borderWidth: 0,
                                    cutout: '75%'
                                }]
                            },
                            options: { plugins: { legend: { display: false }, tooltip: { enabled: false } }, responsive: true, maintainAspectRatio: false }
                        });
                    }
                }, 0);
            });
        }
    }

    // 3. Activity Graph
    const ctx = document.getElementById('learningActivityChart');
    if (ctx && data.weeklyGraphData) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.weeklyGraphData.labels,
                datasets: [{
                    label: 'Hours Learned',
                    data: data.weeklyGraphData.data,
                    borderColor: '#4e73df',
                    backgroundColor: 'rgba(78, 115, 223, 0.05)',
                    borderWidth: 2,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { borderDash: [2, 2] } },
                    x: { grid: { display: false } }
                }
            }
        });
    }
}

function getRandomColor(str) {
    const colors = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796'];
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
}

async function fetchRoadmaps() {
    const grid = document.getElementById('learning-grid');
    if (!grid) return;

    // Show loading state
    grid.innerHTML = '<div style="text-align:center; padding:2rem; color:#666;">Loading roadmaps...</div>';

    try {
        const res = await fetch('http://localhost:5000/api/roadmaps');
        if (!res.ok) throw new Error('Failed to fetch roadmaps');

        roadmapData = await res.json();
        renderRoadmapCards(roadmapData);
    } catch (err) {
        console.error(err);
        grid.innerHTML = '<div style="text-align:center; padding:2rem; color:red;">Failed to load roadmaps. Please try again.</div>';

        // Fallback
        if (window.careerRoadmaps) {
            roadmapData = window.careerRoadmaps;
            renderRoadmapCards(roadmapData);
        }
    }
}

function renderRoadmapCards(data) {
    const grid = document.getElementById('learning-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (!data || data.length === 0) {
        grid.innerHTML = '<p>No roadmaps found.</p>';
        return;
    }

    data.forEach(roadmap => {
        const card = document.createElement('div');
        card.className = 'roadmap-card';
        card.onclick = () => {
            showRoadmapDetail(roadmap.id);
            if (window.learningTracker) window.learningTracker.setDomain(roadmap.domain || roadmap.title);
        };

        let badgeClass = 'badge-beginner';
        const levelLower = (roadmap.level || '').toLowerCase();
        if (levelLower.includes('intermediate')) badgeClass = 'badge-intermediate';
        if (levelLower.includes('advanced')) badgeClass = 'badge-advanced';

        card.innerHTML = `
            <div>
                <div class="roadmap-icon-wrapper">
                    <span class="material-icons-round" style="font-size: 24px;">${roadmap.icon || 'school'}</span>
                </div>
                <div class="roadmap-title">${roadmap.domain || roadmap.title}</div>
                <div class="roadmap-meta" style="background:none; padding:0; justify-content:flex-start; gap:10px; margin-top:0.5rem;">
                    <span class="skill-badge ${badgeClass}">${roadmap.level}</span>
                    <span style="font-size:0.8rem; color:#666;">${roadmap.duration}</span>
                </div>
            </div>
            <div class="roadmap-desc" style="margin-top:0.5rem;">${roadmap.description}</div>
            <button class="opp-apply-btn-full" style="border-radius:8px; margin-top:auto;">View Roadmap</button>
        `;

        grid.appendChild(card);
    });
}

function showRoadmapDetail(id) {
    const roadmap = roadmapData.find(r => r.id === id);
    if (!roadmap) return;

    const listSection = document.getElementById('section-roadmap-list');
    const analyticsSection = document.getElementById('section-analytics'); // Analytics section
    const detailSection = document.getElementById('section-roadmap-detail');

    if (window.learningTracker) window.learningTracker.setDomain(roadmap.domain || roadmap.title);

    // Build Detail HTML
    let stepsHtml = '';
    const steps = roadmap.steps || [];

    steps.forEach((step, index) => {
        let resourceLinks = '';
        if (step.resources && step.resources.length > 0) {
            step.resources.forEach(res => {
                let iconClass = 'material-icons-round';
                let iconName = 'link';
                if (res.platform === 'YouTube') {
                    iconClass += ' yt-icon';
                    iconName = 'play_circle';
                } else if (res.platform === 'Udemy') {
                    iconClass += ' udemy-icon';
                    iconName = 'school';
                }

                resourceLinks += `
                    <a href="${res.url}" target="_blank" class="resource-link">
                        <span class="${iconClass}">${iconName}</span>
                        <div>
                            <div style="font-weight:500;">${res.title}</div>
                            <div style="font-size:0.75rem; color:#666;">${res.platform}</div>
                        </div>
                    </a>
                `;
            });
        }

        let topicsHtml = '';
        if (step.topics && step.topics.length > 0) {
            topicsHtml = `<div style="margin-bottom:0.8rem; display:flex; flex-wrap:wrap; gap:6px;">
                 ${step.topics.map(t => `<span style="background:#f1f3f4; padding:2px 8px; border-radius:4px; font-size:0.8rem;">${t}</span>`).join('')}
            </div>`;
        }

        stepsHtml += `
            <div class="step-card">
                <div class="step-number">Step ${index + 1}</div>
                <div class="step-title">${step.title || step.topic}</div>
                ${topicsHtml}
                <div style="font-weight:600; font-size:0.9rem; margin-bottom:0.5rem; color:#444;">Recommended Resources</div>
                <div class="resource-list">
                    ${resourceLinks}
                </div>
            </div>
        `;
    });

    const detailHtml = `
        <div class="roadmap-detail-container">
            <button onclick="backToGrid()" class="back-btn">
                <span class="material-icons-round">arrow_back</span> Back to Roadmaps
            </button>

            <div class="detail-header">
                <div style="display:flex; align-items:center; gap:16px; margin-bottom:1rem;">
                    <div class="roadmap-icon-wrapper" style="width:60px; height:60px; font-size:1.5rem;">
                        <span class="material-icons-round" style="font-size:32px;">${roadmap.icon || 'school'}</span>
                    </div>
                    <div>
                        <h1 style="font-size:1.8rem; margin:0; color:#1c1c1c;">${roadmap.domain || roadmap.title}</h1>
                        <p style="margin:0; color:#666;">${roadmap.duration} • ${roadmap.level}</p>
                    </div>
                </div>
                <p style="font-size:1.05rem; color:#444; max-width:700px;">${roadmap.description}</p>
            </div>

            <div class="steps-container">
                ${stepsHtml}
            </div>
        </div>
    `;

    detailSection.innerHTML = detailHtml;

    listSection.style.display = 'none';
    if (analyticsSection) analyticsSection.style.display = 'none';
    detailSection.style.display = 'block';

    document.querySelector('.content-scroll').scrollTop = 0;
}

function backToGrid() {
    const listSection = document.getElementById('section-roadmap-list');
    const analyticsSection = document.getElementById('section-analytics');
    const detailSection = document.getElementById('section-roadmap-detail');

    if (listSection) listSection.style.display = 'block';
    if (analyticsSection) analyticsSection.style.display = 'block';
    if (detailSection) detailSection.style.display = 'none';

    if (window.learningTracker) window.learningTracker.clearDomain();
}

window.showRoadmapDetail = showRoadmapDetail;
window.backToGrid = backToGrid;
