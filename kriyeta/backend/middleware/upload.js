const multer = require("multer");
const path = require("path");

const fs = require("fs");

// Ensure upload directories exist
const uploadDirs = ["uploads", "uploads/photos", "uploads/resumes"];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "photo") {
      cb(null, "uploads/photos");
    } else if (file.fieldname === "resume") {
      cb(null, "uploads/resumes");
    } else {
      cb(null, "uploads");
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

module.exports = multer({ storage });
