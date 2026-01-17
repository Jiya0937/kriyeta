/* ===========================
   HACKATHON LOGIC – STUDENT
   =========================== */

window.loadHackathons = async function () {
    const container = document.getElementById('hackathon-grid');
    if (!container) return;

    // Loading State
    container.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding:3rem; color:#666;">
            Loading hackathons...
        </div>
    `;

    try {
        const response = await fetch('http://localhost:5000/api/hackathons');
        if (!response.ok) throw new Error('Failed to fetch');

        const hackathons = await response.json();

        if (!hackathons || hackathons.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align:center; padding:3rem; color:#888;">
                    No upcoming hackathons.
                </div>
            `;
            return;
        }

        renderHackathons(hackathons, container);

    } catch (error) {
        console.error("Error fetching hackathons:", error);
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding:3rem; color:#ea4335;">
                Unable to load hackathons.
            </div>
        `;
    }
};

function renderHackathons(data, container) {
    container.innerHTML = '';

    data.forEach(item => {
        const card = createHackathonCard(item);
        container.appendChild(card);
    });
}

function createHackathonCard(item) {
    const card = document.createElement('div');
    card.className = 'opp-card';

    // Dates
    const deadlineDate = new Date(item.registrationDeadline);
    const today = new Date();
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let timeLeftText = `${diffDays} days left`;
    let timeClass = 'safe';
    let timeIcon = 'hourglass_empty';

    if (diffDays < 0) {
        timeLeftText = 'Reg Closed';
        timeClass = 'expired';
        timeIcon = 'event_busy';
    } else if (diffDays <= 3) {
        timeLeftText = `${diffDays} days left`;
        timeClass = 'urgent';
        timeIcon = 'hourglass_bottom';
    }

    // Initials
    const initial = item.organizer ? item.organizer.charAt(0).toUpperCase() : '?';
    const logoBg = '#1a73e8'; // Blue default for hackathons

    // Chips
    const eligibilityChip = item.eligibility ? `<span class="opp-chip">${item.eligibility}</span>` : '';
    const modeChip = item.mode ? `<span class="opp-chip">${item.mode}</span>` : '';

    card.innerHTML = `
         <div class="opp-content">
            <div class="opp-header">
                <div class="opp-title">
                    <h3>${item.name}</h3>
                    <div class="opp-company">${item.organizer}</div>
                </div>
                <div class="opp-logo" style="color:${logoBg}; border-color:${logoBg}20;">
                    ${initial}
                </div>
            </div>

            <div class="opp-meta">
                <div class="opp-meta-item">
                    <span class="material-icons-round">event</span>
                    <span>${item.eventDate}</span>
                </div>
                <div class="opp-meta-item">
                    <span class="material-icons-round">emoji_events</span>
                    <span>${item.prizes || 'N/A'}</span>
                </div>
                 <div class="opp-meta-item">
                    <span class="material-icons-round">place</span>
                    <span>${item.location || 'Online'}</span>
                </div>
            </div>

            <div class="opp-tags">
                ${modeChip}
                ${eligibilityChip}
            </div>

            ${item.prizes && item.prizes.includes('Offers') ?
            `<div class="opp-badge-prize"><span class="material-icons-round" style="font-size:14px">stars</span> ${item.prizes}</div>`
            : ''}
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

        <a href="${item.registerLink}" target="_blank" class="opp-apply-btn-full">
            Register for Challenge
        </a>
    `;

    return card;
}
