const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  enrollmentNo: {
    type: String,
    required: true,
    unique: true
  },
  scholarNo: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },

  college: String,
  branch: String,
  year: String,

  skills: String,
  projects: String,
  achievements: String,
  certifications: String,
  interests: String,
  bio: String,

  linkedin: String,
  github: String,
  portfolio: String,

  photo: String,
  resume: String,

  profileCompleted: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.models.student || mongoose.model("student", studentSchema);
