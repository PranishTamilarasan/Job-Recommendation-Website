import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String,
  uploadedAt: { type: Date, default: Date.now },
  parsedText: String,
  skills: [String],
});

export default mongoose.model("Resumes", pdfSchema, "Resumes");
