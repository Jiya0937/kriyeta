/**
 * LearningTracker.js
 * Tracks active time on learning pages and syncs with backend.
 */

class LearningTracker {
    constructor() {
        this.isActive = false;
        this.timer = null;
        this.syncInterval = null;
        this.currentDomain = null;
        this.userId = null;
        this.userEnrollment = null;
        this.unsavedMinutes = 0;
        this.IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes idle
        this.lastActivity = Date.now();
    }

    init() {
        // Get user info
        const user = JSON.parse(localStorage.getItem('Student'));
        if (!user || !user._id) return;
        this.userId = user._id;
        this.userEnrollment = user.enrollmentNo || 'UNKNOWN';

        this.startListeners();
        this.startTimers();
    }

    setDomain(domainName) {
        // flush previous if any
        if (this.currentDomain && this.unsavedMinutes > 0) {
            this.sync(true);
        }
        this.currentDomain = domainName;
        console.log(`Tracking started for: ${domainName}`);
    }

    clearDomain() {
        if (this.currentDomain && this.unsavedMinutes > 0) {
            this.sync(true);
        }
        this.currentDomain = null;
        console.log("Tracking paused.");
    }

    startListeners() {
        const resetActivity = () => {
            this.isActive = true;
            this.lastActivity = Date.now();
        };

        window.addEventListener('mousemove', resetActivity);
        window.addEventListener('keydown', resetActivity);
        window.addEventListener('scroll', resetActivity);
        window.addEventListener('click', resetActivity);

        // Handle tab visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.isActive = false;
                this.sync(true); // Sync immediately on hide
            } else {
                this.isActive = true;
                this.lastActivity = Date.now();
            }
        });
    }

    startTimers() {
        // Check for idle every minute
        this.timer = setInterval(() => {
            const now = Date.now();

            // If idle too long, mark inactive
            if (now - this.lastActivity > this.IDLE_TIMEOUT) {
                this.isActive = false;
            }

            // If active and domain is set, increment time
            if (this.isActive && this.currentDomain && !document.hidden) {
                this.unsavedMinutes += 1;
                console.log(`Learning active: ${this.unsavedMinutes} mins pending.`);
            }

            // Sync every 2 minutes or if accumulated > 5
            if (this.unsavedMinutes >= 2) {
                this.sync();
            }

        }, 60 * 1000); // 1 minute ticker
    }

    async sync(force = false) {
        if (this.unsavedMinutes <= 0) return;
        if (!this.currentDomain) return;

        const minutesToSend = this.unsavedMinutes;
        this.unsavedMinutes = 0; // Reset immediately to avoid double send

        try {
            await fetch('http://localhost:5000/api/learning/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId: this.userId,
                    enrollmentNo: this.userEnrollment,
                    domain: this.currentDomain,
                    activityType: 'roadmap_view',
                    duration: minutesToSend,
                    source: 'internal'
                })
            });
            console.log(`Synced ${minutesToSend} mins for ${this.currentDomain}`);
        } catch (err) {
            console.error("Sync failed:", err);
            this.unsavedMinutes += minutesToSend; // Restore on fail
        }
    }
}

// Global Instance
window.learningTracker = new LearningTracker();

// Auto-init if logged in
document.addEventListener('DOMContentLoaded', () => {
    window.learningTracker.init();
});
