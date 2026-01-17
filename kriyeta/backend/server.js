const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api", authRoutes);
app.use("/api/admin", require("./routes/admin"));
app.use("/api/placements", require("./routes/placement"));
app.use("/api/internships", require("./routes/internship"));
app.use("/api/hackathons", require("./routes/hackathon"));
app.use("/api/roadmaps", require("./routes/roadmaps"));
app.use("/api/learning", require("./routes/learning"));

// Connect to MongoDB  ✅ HERE
connectDB();

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
