// src/pages/Home.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const featuredJobs = [
    { id: 1, title: "Data Analyst", company: "ABC Corp" },
    { id: 2, title: "Python Developer", company: "XYZ Ltd" },
    { id: 3, title: "SQL Engineer", company: "DataWorks" },
  ];

  const howWorks = [
    {
      id: 1,
      image: require("../assets/images/test.png"),
      description: "Take Skill Test by uploading Resume",
    },
    {
      id: 2,
      image: require("../assets/images/match.png"),
      description: "View job matches suitable for your skills",
    },
    {
      id: 3,
      image: require("../assets/images/recommend.jpeg"),
      description: "If want, learn recommended skills",
    },
  ];

  const [file, setFile] = useState(null);
  const [resumeId, setResumeId] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  const submitPdf = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a PDF file");

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);
    setResumeId(null);
    setSkills([]);

    try {
      const res = await axios.post("http://localhost:5000/extract-skills", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // After detecting skills:
      const detected = res.data.skills || [];
      setResumeId(res.data.id);
      setSkills(detected || []);
      localStorage.setItem("skills", JSON.stringify(detected)); // <-- Save to localStorage
      alert("Resume parsed and skills extracted!");

      // Navigate to jobs page and pass skills in state
      navigate("/JobsList", { state: { skills: detected || [] } });

    } catch (error) {
      console.error(error);
      alert("Upload or skill extraction failed!");
    } finally {
      setLoading(false);
    }
  };

  const downloadResume = async () => {
    if (!resumeId) return;
    try {
      const res = await axios.get(`http://localhost:5000/resume/${resumeId}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resume.pdf");
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Failed to download resume");
    }
  };

  return (
    <div className="Home-body">
      <div className="home-section">
        <form className="home-resume-upload" onSubmit={submitPdf}>
          <h2>Upload Resume</h2>
          <p>Upload your resume to get personalized job recommendations</p>
          <input
            type="file"
            accept=".pdf"
            className="resume-upload-input"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <p className="resume-upload-note">Note: Please ensure your resume is in PDF format.</p>
          <button className="home-section-btn" type="submit" disabled={loading}>
            {loading ? "Processing..." : "Upload ➤"}
          </button>
        </form>

        {skills.length > 0 && (
          <div className="extracted-skills-section">
            <h3>Extracted Skills:</h3>
            <ul>
              {skills.map((skill, idx) => (
                <li key={idx}>{skill}</li>
              ))}
            </ul>
          </div>
        )}

        {resumeId && (
          <div className="resume-actions">
            <p>Resume uploaded! ID: {resumeId}</p>
            <button className="home-section-btn" onClick={downloadResume}>
              Download Resume
            </button>
          </div>
        )}

        <section className="home-featuredjobs">
          <h2>Featured jobs</h2>
          <div className="featured-jobs-grid">
            {featuredJobs.map((job) => (
              <div key={job.id} className="job-card">
                <h3>{job.title}</h3>
                <p>{job.company}</p>
                <button className="home-section-btn">Apply ➤</button>
              </div>
            ))}
          </div>
        </section>

        <section className="home-featuredjobs">
          <h2>How It Works</h2>
          <div className="featured-jobs-grid-work">
            {howWorks.map((job, index) => (
              <React.Fragment key={job.id}>
                <div className="job-card-work">
                  <img src={job.image} alt={job.title || "step"} className="job-image" />
                  <p>{job.description}</p>
                </div>
                {index < howWorks.length - 1 && <div className="arrow">➜</div>}
              </React.Fragment>
            ))}
          </div>
        </section>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Job Portal</h4>
              <p>Find your dream job today</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/jobs">Jobs</a></li>
                <li><a href="/about">About Us</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact Us</h4>
              <p>xxx@gmail.com</p>
              <p>+91 12334341232</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Job Portal. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
