const express = require("express");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const Student = require("../models/Student");
const upload = require("../middleware/upload");

const router = express.Router();

/* ================= ADMIN REGISTER ================= */
router.post("/register", async (req, res) => {
    try {
        const { fullName, email, mobileNumber, college, department, adminId, password } = req.body;

        // Validation
        if (!fullName || !email || !mobileNumber || !college || !department || !adminId || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check duplicates
        const existingEmail = await Admin.findOne({ email });
        if (existingEmail) return res.status(400).json({ message: "Email already exists" });

        const existingId = await Admin.findOne({ adminId });
        if (existingId) return res.status(400).json({ message: "Admin ID already exists" });

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
            fullName,
            email,
            mobileNumber,
            college,
            department,
            adminId,
            password: hashedPassword
        });

        await newAdmin.save();
        res.status(201).json({ message: "Admin registered successfully" });

    } catch (err) {
        console.error("ADMIN REGISTER ERROR:", err);
        res.status(500).json({ message: "Server error: " + err.message });
    }
});

/* ================= ADMIN LOGIN ================= */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin account not found" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Return admin data sans password
        const adminData = {
            _id: admin._id,
            fullName: admin.fullName,
            email: admin.email,
            mobileNumber: admin.mobileNumber,
            college: admin.college,
            department: admin.department,
            adminId: admin.adminId,
            photo: admin.photo,
            role: admin.role
        };

        res.json(adminData);

    } catch (err) {
        console.error("ADMIN LOGIN ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
});

/* ================= GET ADMIN PROFILE ================= */
router.get("/profile/:id", async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id).select("-password");
        if (!admin) return res.status(404).json({ message: "Admin not found" });
        res.json(admin);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* ================= UPDATE ADMIN PROFILE ================= */
router.put("/profile/update/:id", async (req, res) => {
    try {
        const { fullName, mobileNumber, department } = req.body;

        // Only allow updating specific fields
        const updates = {};
        if (fullName) updates.fullName = fullName;
        if (mobileNumber) updates.mobileNumber = mobileNumber;
        if (department) updates.department = department;

        const admin = await Admin.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true }
        ).select("-password");

        res.json(admin);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* ================= UPLOAD ADMIN PHOTO ================= */
router.post("/profile/upload-photo/:id", upload.single("photo"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const admin = await Admin.findByIdAndUpdate(
            req.params.id,
            { photo: req.file.path },
            { new: true }
        ).select("-password");

        res.json({ message: "Photo updated", path: req.file.path, admin });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* ================= GET ALL STUDENTS (Existing) ================= */
router.get("/students", async (req, res) => {
    try {
        const students = await Student.find().select("fullName enrollmentNo branch year photo");
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* ================= PLACEMENT MANAGEMENT ROUTES ================= */

const Placement = require("../models/Placement");

// GET ALL PLACEMENTS (Admin View)
router.get("/placements", async (req, res) => {
    try {
        const placements = await Placement.find().sort({ postedAt: -1 });
        res.json(placements);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE NEW PLACEMENT
router.post("/placements/create", async (req, res) => {
    try {
        const { companyName, role, domain, location, applyLink, deadline, eligibility, description } = req.body;

        if (!companyName || !role || !applyLink || !deadline) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newPlacement = new Placement({
            companyName,
            role,
            domain: domain || "General",
            location,
            applyLink,
            deadline,
            eligibility,
            description
        });

        await newPlacement.save();
        res.status(201).json({ message: "Placement created successfully", placement: newPlacement });
    } catch (err) {
        console.error("CREATE PLACEMENT ERROR:", err);
        res.status(500).json({ message: "Server error: " + err.message });
    }
});

// DELETE PLACEMENT
router.delete("/placements/:id", async (req, res) => {
    try {
        await Placement.findByIdAndDelete(req.params.id);
        res.json({ message: "Placement deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* ================= SEARCH STUDENT (Existing) ================= */
router.get("/student/:enrollmentNo", async (req, res) => {
    try {
        const student = await Student.findOne({ enrollmentNo: req.params.enrollmentNo });
        if (!student) {
            // Try searching by ID if enrollment number fails
            // This is just a fallback, user specifically asked for Enrollment Number
            return res.status(404).json({ message: "Student not found" });
        }
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
