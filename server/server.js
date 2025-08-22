// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import resumeRoutes from "./routes/resume.js";
import jobsRoutes from "./routes/jobs.js"; 





dotenv.config({ path: "./config.env" });

const app = express();

// Middlewares
app.use(cors());
app.use("/jobs", jobsRoutes);
app.use(express.json()); 

// Connect to MongoDB (if you already have it; keep as is)
if (process.env.ATLAS_URL) {
  mongoose.connect(process.env.ATLAS_URL)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
} else {
  console.log("ATLAS_URL not set — skipping MongoDB connect");
}

// Routes
app.use("/", resumeRoutes);
app.use("/jobs", jobsRoutes); // new jobs endpoints mounted at /jobs

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

