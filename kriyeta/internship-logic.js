/* ===========================
   INTERNSHIP LOGIC – STUDENT
   =========================== */

window.loadInternships = async function () {
    const container = document.getElementById('internship-grid');
    if (!container) return;

    // Avoid reloading if already populating/populated (optional, but good for performance)
    // For now, we'll reload on click to ensure freshness as requested

    // Loading State
    container.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding:3rem; color:#666;">
            Loading latest internships...
        </div>
    `;

    try {
        const response = await fetch('http://localhost:5000/api/internships');
        if (!response.ok) throw new Error('Failed to fetch');

        const internships = await response.json();

        if (!internships || internships.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align:center; padding:3rem; color:#888;">
                    No active internships found. Check back later!
                </div>
            `;
            return;
        }

        renderInternships(internships, container);

    } catch (error) {
        console.error("Error fetching internships:", error);
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding:3rem; color:#ea4335;">
                Unable to load internships. Please try again.
            </div>
        `;
    }
};

function renderInternships(data, container) {
    container.innerHTML = '';
    // container already has grid styles from HTML

    data.forEach(item => {
        const card = createInternshipCard(item);
        container.appendChild(card);
    });
}

function createInternshipCard(item) {
    const card = document.createElement('div');
    card.className = 'opp-card';

    // Initials & Colors
    const initial = item.companyName ? item.companyName.charAt(0).toUpperCase() : '?';
    const logoBg = getColorForCompany(item.companyName);

    // Deadline Logic
    const deadlineDate = new Date(item.deadline);
    const today = new Date();
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let timeLeftText = `${diffDays} days left`;
    let timeClass = 'safe';
    let timeIcon = 'hourglass_empty';

    if (diffDays < 0) {
        timeLeftText = 'Expired';
        timeClass = 'expired';
        timeIcon = 'event_busy';
    } else if (diffDays <= 5) {
        timeLeftText = `${diffDays} days left`;
        timeClass = 'urgent';
        timeIcon = 'hourglass_bottom';
    }

    // Chips
    const eligibilityChip = item.eligibility ? `<span class="opp-chip">${item.eligibility}</span>` : '';
    const domainChip = item.domain ? `<span class="opp-chip">${item.domain}</span>` : '';

    card.innerHTML = `
        <div class="opp-content">
            <div class="opp-header">
                <div class="opp-title">
                    <h3>${item.role}</h3>
                    <div class="opp-company">${item.companyName}</div>
                </div>
                <div class="opp-logo" style="color:${logoBg}; border-color:${logoBg}20;">
                    ${initial}
                </div>
            </div>

            <div class="opp-meta">
                <div class="opp-meta-item">
                    <span class="material-icons-round">work_outline</span>
                    <span>${item.duration || 'N/A'}</span>
                </div>
                <div class="opp-meta-item">
                    <span class="material-icons-round">payments</span>
                    <span>${item.stipend || 'Unpaid'}</span>
                </div>
                <div class="opp-meta-item">
                    <span class="material-icons-round">place</span>
                    <span class="text-truncate" style="max-width:100px;">${item.location}</span>
                </div>
            </div>

            <div class="opp-tags">
                ${domainChip}
                ${eligibilityChip}
            </div>
        </div>

        <div class="opp-footer">
            <div class="opp-time ${timeClass}" style="${diffDays < 0 ? 'color:#ea4335' : ''}">
                <span class="material-icons-round" style="font-size:16px">${timeIcon}</span>
                ${timeLeftText}
            </div>
             <div class="opp-share">
                <span class="material-icons-round opp-icon-btn">share</span>
                <span class="material-icons-round opp-icon-btn">favorite_border</span>
            </div>
        </div>
        
        <a href="${item.applyLink}" target="_blank" class="opp-apply-btn-full">
            View Details & Apply
        </a>
    `;

    return card;
}

function getColorForCompany(name) {
    const colors = ['#1a73e8', '#ea4335', '#fbbc04', '#34a853', '#9334e8', '#e83477'];
    if (!name) return colors[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}
