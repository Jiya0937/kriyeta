// resume-logic.js - Renders Resume Templates

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('resume-container');
    const templates = getResumeTemplates(); // From data.js

    if (!templates || templates.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:2rem; color:#666; grid-column:1/-1;">No templates found.</div>`;
        return;
    }

    container.innerHTML = '';
    templates.forEach(t => {
        const card = document.createElement('div');
        card.className = 'resume-card';

        let tagsHtml = t.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

        card.innerHTML = `
            <div class="company-header">
                <div class="company-logo" style="background:${t.color};">
                    ${t.logo_text}
                </div>
                <div>
                     <h3 style="margin:0; font-size:1.1rem; color:#1e293b;">${t.company}</h3>
                     <p style="margin:0.2rem 0 0; color:#64748b; font-size:0.85rem;">${t.role}</p>
                </div>
            </div>

            <p style="margin:0 0 1rem; color:#475569; font-size:0.9rem; line-height:1.5;">${t.description}</p>
            
            <div class="tag-row">
                ${tagsHtml}
            </div>

            <button onclick="previewTemplate('${t.id}')" class="btn-use-template">
                <span class="material-icons-round" style="font-size:1.1rem;">file_download</span>
                Use Template
            </button>
        `;
        container.appendChild(card);
    });
});

// Simple Modal Logic
window.previewTemplate = function (id) {
    const templates = getResumeTemplates();
    const t = templates.find(item => item.id === id);
    if (!t) return;

    document.getElementById('modal-title').innerText = `${t.company} - ${t.role} Format`;

    // Fill list
    const list = document.getElementById('modal-list');
    list.innerHTML = t.structure.map(s => `<li>${s}</li>`).join('');

    // Show modal (flex to center)
    document.getElementById('preview-modal').style.display = 'flex';
}
