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
router.put("/update", auth, async (req, res) => {
  try {
    const { status, coupleName, partnerEmail } = req.body;

    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = status || user.status;
    user.coupleName = status !== "Single" ? coupleName : ""; // clear coupleName if single
    user.partnerEmail = status !== "Single" ? partnerEmail : ""; // clear partnerEmail if single

    await user.save();

    res.json({
      username: user.username,
      email: user.email,
      photos: user.photos,
      rating: user.rating,
      status: user.status,
      coupleName: user.coupleName,
      partnerEmail: user.partnerEmail, 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
});

module.exports = router;














