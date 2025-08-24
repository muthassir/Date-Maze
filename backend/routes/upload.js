const express = require("express");
const User = require("../models/User.js");
const auth = require("../middleware/auth.js");

const router = express.Router();

// Save Cloudinary URL for a specific letter
router.post("/:letter", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const letter = req.params.letter;
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "No image URL provided" });
    }

    // replace existing letter photo or add new
    const existing = user.photos.find((p) => p.letter === letter);
    if (existing) {
      existing.url = url;
    } else {
      user.photos.push({ letter, url });
    }

    await user.save();

    res.json({ photos: user.photos });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Error saving photo", error: err.message });
  }
});

module.exports = router;
