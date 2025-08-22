// src/pages/JobsList.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function JobsList() {
  const location = useLocation();

  // Get skills from state OR localStorage
  const savedSkills = location.state?.skills || JSON.parse(localStorage.getItem("skills")) || [];
  const [passedSkills, setPassedSkills] = useState(savedSkills);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.skills) {
      localStorage.setItem("skills", JSON.stringify(location.state.skills));
      setPassedSkills(location.state.skills);
    }
  }, [location.state]);

  useEffect(() => {
    if (passedSkills.length === 0) return;

    const fetchJobs = async () => {
      setLoading(true);
      try {
        const skillParam = passedSkills.join(",");
        const res = await axios.get(`http://localhost:5000/jobs?skills=${skillParam}`);
        setJobs(res.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [passedSkills]);

  return (
    <div style={{ padding: "30px", background: "#f4f6f8", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#333", fontSize: "2rem" }}>Job Recommendations</h1>
        {passedSkills.length > 0 && (
          <div style={{
            marginTop: "15px",
            display: "inline-block",
            background: "#ffffff",
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
          }}>
            <h4 style={{ margin: 0, fontSize: "1rem", color: "#555" }}>Extracted Skills:</h4>
            <p style={{ margin: 0, color: "#2196f3", fontWeight: "bold" }}>
              {passedSkills.join(", ")}
            </p>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", fontSize: "1.2rem", color: "#888" }}>
          Loading jobs...
        </div>
      )}

      {/* No Jobs */}
      {!loading && jobs.length === 0 && (
        <div style={{ textAlign: "center", fontSize: "1.2rem", color: "#e74c3c" }}>
          No matching jobs found.
        </div>
      )}

      {/* Job Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", // Only 2 per row on wide screens
        gap: "20px"
      }}>
        {!loading && jobs.map((job) => (
          <div
            key={job.JobID}
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
          >
            <h3 style={{ color: "#333", marginBottom: "5px" }}>{job.Title}</h3>
            <p style={{ margin: "5px 0", color: "#777" }}>
              <strong>Company:</strong> {job.Company}
            </p>
            <p style={{ margin: "5px 0", color: "#777" }}>
              <strong>Location:</strong> {job.Location}
            </p>
            <p style={{ margin: "5px 0", color: "#555", fontSize: "0.9rem" }}>
              <strong>Skills Required:</strong> {job.skills?.join(", ")}
            </p>

            {/* Extra Columns */}
            <p style={{ margin: "5px 0", color: "#777" }}>
              <strong>Salary:</strong> {job.Salary || "Not Disclosed"}
            </p>
            <p style={{ margin: "5px 0", color: "#777" }}>
              <strong>Job Type:</strong> {job.JobType || "Full-Time"}
            </p>
            <p style={{ margin: "5px 0", color: "#777" }}>
              <strong>Posted Date:</strong> {job.PostedDate || "Recently"}
            </p>

            <button style={{
              marginTop: "10px",
              padding: "10px 15px",
              background: "#2196f3",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "0.95rem",
              transition: "background 0.2s ease",
              width: "100%"
            }}
              onMouseEnter={(e) => e.target.style.background = "#1976d2"}
              onMouseLeave={(e) => e.target.style.background = "#2196f3"}

              onClick={() => alert(`Applying for ${job.Title} at ${job.Company}`)}
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
