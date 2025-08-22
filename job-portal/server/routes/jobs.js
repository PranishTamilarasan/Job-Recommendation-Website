// server/routes/jobs.js
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JOBS_PATH = path.join(__dirname, "..", "job_listings.json");

let allJobs = [];

function loadJobs() {
  try {
    const raw = fs.readFileSync(JOBS_PATH, "utf-8");
    const parsed = JSON.parse(raw);

    allJobs = parsed.map(job => ({
      ...job,
      skills: String(job["Skills Required"] || "")
        .split(",")
        .map(s => s.trim())
        .filter(Boolean)
    }));

    console.log(`Loaded ${allJobs.length} jobs from JSON`);
  } catch (err) {
    console.error("Error loading jobs JSON:", err);
    allJobs = [];
  }
}

// Load once at startup
loadJobs();

// GET /jobs?skills=Python,React
router.get("/", (req, res) => {
  const skillsQuery = req.query.skills
    ? req.query.skills.split(",").map(s => s.trim().toLowerCase())
    : [];

  let results = allJobs;

  if (skillsQuery.length > 0) {
    results = results.filter(job =>
      job.skills.some(skill =>
        skillsQuery.includes(skill.toLowerCase())
      )
    );
  }

  res.json(results);
});

export default router;
