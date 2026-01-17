// roadmap-logic.js - Renders Learning Maps (Gallery & Detail View)

document.addEventListener('DOMContentLoaded', () => {
    renderGallery();
});

// View Switching Logic
function showGallery() {
    document.getElementById('roadmap-gallery').style.display = 'grid';
    document.getElementById('roadmap-detail').style.display = 'none';
    window.scrollTo(0, 0);
}

function showDetail(roadmapId) {
    const roadmaps = getRoadmaps();
    const map = roadmaps.find(r => r.id === roadmapId);

    if (map) {
        renderDetailView(map);
        document.getElementById('roadmap-gallery').style.display = 'none';
        document.getElementById('roadmap-detail').style.display = 'block';
        window.scrollTo(0, 0);
    }
}

// Render the Grid of Summary Cards
function renderGallery() {
    const container = document.getElementById('roadmap-gallery');
    const roadmaps = getRoadmaps(); // From data.js

    if (!roadmaps || roadmaps.length === 0) {
        container.innerHTML = "No roadmaps available.";
        return;
    }

    container.innerHTML = '';
    roadmaps.forEach(map => {
        const card = document.createElement('div');
        card.className = 'roadmap-summary-card';
        card.onclick = () => showDetail(map.id);

        card.innerHTML = `
            <div style="width:50px; height:50px; background:${map.color}15; color:${map.color}; border-radius:10px; display:flex; align-items:center; justify-content:center; margin-bottom:1rem;">
                <span class="material-icons-round" style="font-size:1.8rem;">${map.icon}</span>
            </div>
            <h3 style="margin:0 0 0.5rem; color:#1e293b; font-size:1.1rem;">${map.title}</h3>
            <p style="margin:0 0 1rem; color:#64748b; font-size:0.9rem; line-height:1.5;">${map.description}</p>
            <div style="font-size:0.85rem; font-weight:600; color:${map.color}; display:flex; align-items:center; gap:0.2rem;">
                View Roadmap <span class="material-icons-round" style="font-size:1rem;">arrow_forward</span>
            </div>
        `;
        container.appendChild(card);
    });
}

// Render the Specific Roadmap Detail
function renderDetailView(map) {
    const container = document.getElementById('detail-content');

    // Header
    let html = `
        <div class="roadmap-card" style="border-left-color:${map.color};">
            <div class="roadmap-header">
                <div style="width:56px; height:56px; background:${map.color}20; color:${map.color}; border-radius:12px; display:flex; align-items:center; justify-content:center;">
                    <span class="material-icons-round" style="font-size:2rem;">${map.icon}</span>
                </div>
                <div>
                     <h3 style="margin:0; font-size:1.5rem; color:#1e293b;">${map.title}</h3>
                     <p style="margin:0.2rem 0 0; color:#64748b;">${map.description}</p>
                </div>
            </div>
            
            <div class="level-timeline">
    `;

    // Levels
    map.levels.forEach((lvl, index) => {
        const isLast = index === map.levels.length - 1;

        // Resources
        let resourcesHtml = '';
        lvl.resources.forEach(r => {
            let icon = r.type === 'video' ? 'play_circle' : 'article';
            if (r.type === 'course') icon = 'school';
            resourcesHtml += `
                <a href="${r.link}" target="_blank" class="resource-link">
                    <span class="material-icons-round" style="font-size:1.1rem;">${icon}</span>
                    ${r.title}
                </a>
            `;
        });

        // Topics
        let topicsHtml = lvl.topics.map(t => `<span style="background:#f1f5f9; padding:2px 8px; border-radius:4px; font-size:0.85rem; margin-right:5px; color:#475569;">${t}</span>`).join('');

        html += `
            <div class="level-item" style="${isLast ? 'margin-bottom:0;' : ''}">
                <div class="timeline-dot" style="position:absolute; left:-2.6rem; top:0; width:1rem; height:1rem; background:white; border:3px solid ${map.color}; border-radius:50%;"></div>
                <h4 style="margin:0 0 0.5rem; color:#334155; font-size:1.1rem;">${lvl.level}</h4>
                <p style="margin:0 0 0.8rem; color:#64748b; font-size:0.9rem;">${lvl.desc}</p>
                <div style="margin-bottom:0.8rem;">${topicsHtml}</div>
                <div>${resourcesHtml}</div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    container.innerHTML = html;
}
