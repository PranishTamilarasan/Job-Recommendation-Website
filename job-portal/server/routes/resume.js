// /server/routes/resume.js

import express from "express";
import multer from "multer";
import fs from "fs";
import natural from "natural";
import Pdf from "../models/pdf.js";
import pkg from "pdfjs-dist/legacy/build/pdf.js";

const { getDocument } = pkg;
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Load skills list from local JSON file
const SKILLS = JSON.parse(fs.readFileSync("skills.json", "utf8"));

// Skill extraction helper function
function extractSkills(text) {
  const tokenizer = new natural.WordTokenizer();
  const words = tokenizer.tokenize(text.toLowerCase());
  const found = new Set();

  for (const skill of SKILLS) {
    const skillLc = skill.toLowerCase();

    // Match exact phrase or single word skill presence in text
    if (text.toLowerCase().includes(skillLc)) {
      found.add(skill);
    } else if (skillLc.split(" ").length === 1 && words.includes(skillLc)) {
      found.add(skill);
    }
  }

  return Array.from(found);
}

// POST /extract-skills route to upload PDF, parse text, extract and return skills
router.post("/extract-skills", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    const pdfBuffer = req.file.buffer;

    // Load PDF document with pdfjs-dist
    const loadingTask = getDocument({ data: pdfBuffer });
    const pdfDoc = await loadingTask.promise;

    let fullText = "";

    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const content = await page.getTextContent();
      fullText += content.items.map(item => item.str).join(" ") + "\n";
    }

    // Extract skills from plain text
    const detectedSkills = extractSkills(fullText);

    // Save to MongoDB
    const newPdf = new Pdf({
      name: req.file.originalname,
      data: pdfBuffer,
      contentType: req.file.mimetype,
      uploadedAt: new Date(),
      parsedText: fullText,
      skills: detectedSkills,
    });

    await newPdf.save();

    // Send response with extracted skills
    res.status(200).json({
      message: "Resume parsed and skills extracted successfully!",
      id: newPdf._id,
      skills: detectedSkills,
    });

  } catch (err) {
    console.error("Error processing resume:", err);
    res.status(500).json({ error: "Failed to process resume" });
  }
});

export default router;
