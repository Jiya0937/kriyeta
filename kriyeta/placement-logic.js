/* ===========================
   PLACEMENT LOGIC – STUDENT
   =========================== */

/* ---------------------------
   LOAD PLACEMENTS FUNCTION
   --------------------------- */
async function loadPlacements() {
    const container = document.getElementById('placement-grid');

    if (!container) {
        console.warn("placement-grid not found");
        return;
    }

    const countEl = document.querySelector('#section-placements .section-header span');

    // Loading state
    container.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:2rem; color:#666;">
            Loading placement drives...
        </div>
    `;

    try {
        const response = await fetch('http://localhost:5000/api/placements');
        if (!response.ok) throw new Error('Failed to fetch placements');

        const placements = await response.json();

        if (!placements || placements.length === 0) {
            container.innerHTML = `
                <div style="grid-column:1/-1; text-align:center; padding:2rem;">
                    No active drives found.
                </div>
            `;
            if (countEl) countEl.textContent = 'Showing 0 active drives';
            return;
        }

        renderPlacements(placements, container);

        if (countEl) {
            countEl.textContent = `Showing ${placements.length} active drives`;
        }

    } catch (error) {
        console.error("Error fetching placements:", error);
        container.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:2rem; color:#ea4335;">
                Unable to load placements. Please try again later.
            </div>
        `;
    }
}

/* ---------------------------
   RENDER PLACEMENTS
   --------------------------- */
function renderPlacements(data, container) {
    container.innerHTML = '';

    data.forEach(item => {
        const uiItem = {
            id: item._id,
            company_name: item.companyName,
            title: item.role,
            location: item.location,
            status: item.status || "Active",
            deadline: item.deadline
                ? new Date(item.deadline).toLocaleDateString()
                : 'TBD',
            raw_deadline: item.deadline, // Added for urgency calculation
            package: formatPackage(item.minStipend, item.maxStipend),
            skills: item.eligibility ? [item.eligibility] : [],
            original_url: item.applyLink,
            logo_text: item.companyName
                ? item.companyName.charAt(0).toUpperCase()
                : '?',
            logo_bg: getColorForCompany(item.companyName),
            logo_color: '#ffffff',
            eligibility: item.eligibility // Pass eligibility directly
        };

        const card = createPlacementCard(uiItem);
        container.appendChild(card);
    });
}

/* ---------------------------
   HELPERS
   --------------------------- */
function formatPackage(min, max) {
    if (!min && !max) return "Not Disclosed";
    if (min && !max) return `${min}`;
    if (!min && max) return `${max}`;
    return `${min} - ${max}`;
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

/* ---------------------------
   CREATE CARD
   --------------------------- */
function createPlacementCard(item) {
    const card = document.createElement('div');
    card.className = 'placement-card-v2';

    // Status Logic
    let statusClass = 'status-active';
    if (item.status === 'Closed' || item.status === 'Application Closed') {
        statusClass = 'status-closed';
    }

    // Deadline Logic
    let deadlineClass = '';
    let deadlineText = item.deadline;

    if (item.raw_deadline) {
        const deadlineDate = new Date(item.raw_deadline);
        const today = new Date();
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            deadlineText = 'Expired';
            deadlineClass = 'urgent';
        } else if (diffDays <= 5) {
            deadlineClass = 'urgent';
            deadlineText = `${item.deadline} (Urgent)`;
        }
    }

    // Eligibility / Skills
    let eligibilityText = item.eligibility || (item.skills && item.skills.length > 0 ? item.skills.join(', ') : 'Open to All');

    card.innerHTML = `
        <div class="pc2-header">
            <div class="pc2-logo"
                style="background:${item.logo_bg}; color:${item.logo_color}; box-shadow: 0 4px 10px ${item.logo_bg}40;">
                ${item.logo_text}
            </div>
            <div class="pc2-header-info">
                <div class="pc2-role">${item.title}</div>
                <div class="pc2-company">${item.company_name}</div>
            </div>
            <div class="pc2-status ${statusClass}">${item.status}</div>
        </div>

        <div class="pc2-meta-grid">
            <div class="pc2-meta-item">
                <span class="pc2-label">Package</span>
                <span class="pc2-value">${item.package}</span>
            </div>
            <div class="pc2-meta-item">
                <span class="pc2-label">Location</span>
                <span class="pc2-value text-truncate" title="${item.location}">${item.location}</span>
            </div>
            <div class="pc2-meta-item" style="grid-column: 1 / -1; margin-top:8px;">
                <span class="pc2-label">Deadline</span>
                <span class="pc2-value ${deadlineClass}">${deadlineText}</span>
            </div>
        </div>

        <div class="pc2-eligibility">
            <span class="pc2-chip">${eligibilityText}</span>
        </div>

        <a href="${item.original_url}" target="_blank" class="pc2-btn">
            View Details & Apply
        </a>
    `;

    return card;
}

/* ==================================================
   LOAD PLACEMENTS ONLY WHEN TAB IS OPENED (IMPORTANT)
   ================================================== */
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('[data-target="section-placements"]').forEach(link => {
        link.addEventListener("click", () => {
            // Delay ensures section is visible
            setTimeout(loadPlacements, 200);
        });
    });
});
