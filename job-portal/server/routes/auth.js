import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // If passwords are hashed
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ---- Connect to MongoDB ----
mongoose.connect("mongodb://127.0.0.1:27017/jobportal", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error(err));

// ---- User Model ----
const userSchema = new mongoose.Schema({
  username: String,
  password: String // hashed if using bcrypt
});
const User = mongoose.model("User", userSchema);

// ---- Login Route ----
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    // If you stored passwords in plain text (NOT recommended)
    // if (user.password !== password) {
    //   return res.status(401).json({ success: false, message: "Invalid password" });
    // }

    // If passwords are hashed
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    return res.json({ success: true, message: "Login successful", user: { username: user.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ---- Start Server ----
app.listen(5000, () => {
  console.log("✅ Server running on port 5000");
});
