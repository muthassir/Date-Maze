const express = require("express");
const multer = require("multer");
const path = require("path");
const User = require("../models/User.js");
const auth = require("../middleware/auth.js");

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Upload photo for a specific letter
router.post("/:letter", auth, upload.single("photo"), async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const letter = req.params.letter;
    const photoUrl = `/uploads/${req.file.filename}`;

    // replace existing letter photo or add new
    const existing = user.photos.find((p) => p.letter === letter);
    if (existing) {
      existing.url = photoUrl;
    } else {
      user.photos.push({ letter, url: photoUrl });
    }

    await user.save();

    res.json({ photos: user.photos });
  } catch (err) {
    res.status(500).json({ message: "Error uploading", error: err.message });
  }
});

module.exports = router;