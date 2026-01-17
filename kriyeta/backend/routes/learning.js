const express = require('express');
const router = express.Router();
const LearningActivity = require('../models/LearningActivity');
// const Student = require('../models/Student'); // Assuming Student model exists for admin lookup

// 1️⃣ Track learning time
// POST /api/learning/track
router.post('/track', async (req, res) => {
    try {
        const { studentId, enrollmentNo, domain, activityType, duration, source } = req.body;

        // Basic validation
        if (!studentId || !domain || !duration) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const activity = new LearningActivity({
            studentId,
            enrollmentNo,
            domain,
            activityType,
            duration, // stored in minutes
            source,
            date: new Date()
        });

        await activity.save();
        res.status(201).json(activity);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error tracking activity' });
    }
});

// 2️⃣ Student dashboard summary
// GET /api/learning/summary/:studentId
router.get('/summary/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const activities = await LearningActivity.find({ studentId }).sort({ date: 1 });

        // --- 1. Total Hours ---
        const totalMinutes = activities.reduce((sum, act) => sum + act.duration, 0);
        const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

        // --- 2. Active Days & Streak ---
        // Get unique dates (YYYY-MM-DD)
        const dates = [...new Set(activities.map(a => a.date.toISOString().split('T')[0]))].sort();
        const activeDays = dates.length;

        let streak = 0;
        if (dates.length > 0) {
            // Calculate current streak from the end
            // Helper to parsing date string to timestamp for comparison
            const getTs = (dStr) => new Date(dStr).getTime();
            const oneDay = 24 * 60 * 60 * 1000;

            // Check if last activity was today or yesterday to keep streak alive
            const todayStr = new Date().toISOString().split('T')[0];
            const lastActive = dates[dates.length - 1];

            // If last active was not today and not yesterday, streak is broken -> 0
            // Actually, let's just count backwards consecutive days from the last active day
            // And if the last active day is older than yesterday, current streak is effectively 0 for "today" context, 
            // but let's return the "last known streak" or just 0.
            // Requirement says "Current Streak".

            const isToday = lastActive === todayStr;
            const yesterdayDate = new Date();
            yesterdayDate.setDate(yesterdayDate.getDate() - 1);
            const yesterdayStr = yesterdayDate.toISOString().split('T')[0];
            const isYesterday = lastActive === yesterdayStr;

            if (isToday || isYesterday) {
                streak = 1;
                for (let i = dates.length - 1; i > 0; i--) {
                    const curr = getTs(dates[i]);
                    const prev = getTs(dates[i - 1]);
                    const diffDays = Math.round((curr - prev) / oneDay);
                    if (diffDays === 1) {
                        streak++;
                    } else {
                        break;
                    }
                }
            } else {
                streak = 0;
            }
        }

        // --- 3. Domain Wise Progress (Percentage) ---
        // We will sum minutes per domain.
        // To get %, we need a "Total Goal". Since we don't have it, we'll assume a standard 100 hours (6000 mins) for now to show UI percentages.
        const domainMap = {};
        activities.forEach(a => {
            if (!domainMap[a.domain]) domainMap[a.domain] = 0;
            domainMap[a.domain] += a.duration;
        });

        const domainWiseProgress = Object.keys(domainMap).map(d => ({
            domain: d,
            minutes: domainMap[d],
            hours: Math.round(domainMap[d] / 60),
            progress: Math.min(100, Math.round((domainMap[d] / 6000) * 100)) // Cap at 100%, assume 100h goal
        }));

        // --- 4. Weekly Graph Data ---
        // Last 7 unique days or just last 7 chart days? Usually dates.
        // Let's generate last 7 days labels and fill data.
        const weeklyGraphData = {
            labels: [],
            data: []
        };

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dStr = d.toISOString().split('T')[0]; // YYYY-MM-DD

            // Sum duration for this day
            // Inefficient O(N) inside loop, but N is small (activities usually < 10000). Optimization later if needed.
            const dayMins = activities
                .filter(a => a.date.toISOString().split('T')[0] === dStr)
                .reduce((sum, a) => sum + a.duration, 0);

            weeklyGraphData.labels.push(d.toLocaleDateString('en-US', { weekday: 'short' })); // Mon, Tue
            weeklyGraphData.data.push(Math.round((dayMins / 60) * 10) / 10); // Hours
        }


        res.json({
            totalHours,
            activeDays,
            streak,
            domainWiseProgress,
            weeklyGraphData,
            enrolledCourses: domainWiseProgress.length // Simple proxy
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching summary' });
    }
});

// 3️⃣ Admin view student learning data
// GET /api/learning/admin/student/:enrollmentNo
router.get('/admin/student/:enrollmentNo', async (req, res) => {
    try {
        const { enrollmentNo } = req.params;

        // Find student activities
        const activities = await LearningActivity.find({ enrollmentNo }).sort({ date: -1 });

        if (!activities.length) {
            return res.status(404).json({ message: 'No learning data found for this student.' });
        }

        // Reuse similar logic for summary
        const totalMinutes = activities.reduce((sum, act) => sum + act.duration, 0);
        const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
        const activeDays = [...new Set(activities.map(a => a.date.toISOString().split('T')[0]))].length;

        // Domain breakdown
        const domainMap = {};
        activities.forEach(a => {
            if (!domainMap[a.domain]) domainMap[a.domain] = 0;
            domainMap[a.domain] += a.duration;
        });

        const domainBreakdown = Object.keys(domainMap).map(d => ({
            domain: d,
            hours: Math.round((domainMap[d] / 60) * 10) / 10
        }));

        res.json({
            enrollmentNo,
            totalHours,
            activeDays,
            domainBreakdown,
            recentActivity: activities.slice(0, 10) // Last 10 logs
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching student data' });
    }
});

module.exports = router;
