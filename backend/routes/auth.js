const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const auth = require("../middleware/auth.js");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        photos: user.photos,
        rating: user.rating,
          status: user.status,
        coupleName: user.coupleName,
        partnerEmail: user.partnerEmail,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error registering", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        photos: user.photos,
        rating: user.rating,
        status: user.status,
        coupleName: user.coupleName,
        partnerEmail: user.partnerEmail, 
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

// Update user profile (status, coupleName)
// In routes/auth.js - UPDATE route only for status/coupleName (NO LINKING)
router.put("/update", auth, async (req, res) => {
  try {
    const { status, coupleName } = req.body; // Remove partnerEmail from here
    const user = await User.findById(req.user);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Only allow updating status and coupleName
    if (status) user.status = status;
    if (coupleName) user.coupleName = coupleName;

    await user.save();
    
    res.json(user); // Return updated user

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;














