const express = require("express");
const bcrypt = require("bcryptjs");
const Student = require("../models/Student");
const upload = require("../middleware/upload");

const router = express.Router();

/* ================= REGISTER ================= */
router.post(
  "/register",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "resume", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      // Log for debugging
      console.log("Register Body:", req.body);

      const {
        email, password, fullName, college, branch, year,
        enrollmentNo, scholarNo,
        skills, projects, certifications, linkedin, github
      } = req.body;

      if (!email || !password || !fullName || !enrollmentNo || !scholarNo) {
        console.log("Validation Failed. Missing:", {
          email: !!email,
          password: !!password,
          fullName: !!fullName,
          enrollmentNo: !!enrollmentNo,
          scholarNo: !!scholarNo
        });
        return res.status(400).json({ message: "Required fields missing" });
      }

      // Check for duplicates
      const existingEmail = await Student.findOne({ email });
      if (existingEmail) return res.status(400).json({ message: "Email already registered" });

      const existingEnroll = await Student.findOne({ enrollmentNo });
      if (existingEnroll) return res.status(400).json({ message: "Enrollment number already exists" });

      const existingScholar = await Student.findOne({ scholarNo });
      if (existingScholar) return res.status(400).json({ message: "Scholar number already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const student = new Student({
        fullName,
        email,
        enrollmentNo,
        scholarNo,
        password: hashedPassword,
        college,
        branch,
        year,
        skills: skills || "",
        projects: projects || "",
        certifications: certifications || "",
        linkedin: linkedin || "",
        github: github || "",
        photo: req.files?.photo?.[0]?.path || "",
        resume: req.files?.resume?.[0]?.path || "",
        profileCompleted: true
      });

      await student.save();

      res.status(201).json({ message: "Account created successfully" });
    } catch (err) {
      console.error("REGISTER ERROR STACK:", err.stack);
      res.status(500).json({ message: "Server error: " + err.message });
    }
  }
);

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Account not found" });
    }

    const match = await bcrypt.compare(password, student.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Return essential data + ID
    res.json({
      _id: student._id,
      fullName: student.fullName,
      email: student.email,
      college: student.college,
      branch: student.branch,
      year: student.year,
      photo: student.photo
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ================= GET PROFILE ================= */
router.get("/profile/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= UPDATE PROFILE ================= */
router.put("/profile/update/:id", async (req, res) => {
  try {
    const updates = req.body;
    // Prevent password update here potentially, or handle separately. 
    // For now allow basic field updates
    delete updates.password;
    delete updates.email; // Usually email is not changed easily

    const student = await Student.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= UPLOAD PHOTO ================= */
router.post("/profile/upload-photo/:id", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const student = await Student.findByIdAndUpdate(req.params.id, { photo: req.file.path }, { new: true });
    res.json({ message: "Photo updated", path: req.file.path });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= UPLOAD RESUME ================= */
router.post("/profile/upload-resume/:id", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { resume: req.file.path },
      { new: true }
    );
    res.json({ message: "Resume updated", path: req.file.path });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
