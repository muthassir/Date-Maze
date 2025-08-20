const express = require("express");
const User = require("../models/User.js"); // your model is named Usera-z, adjust import if needed
const auth = require("../middleware/auth.js");

const router = express.Router();

// Save/update rating
router.post("/", auth, async (req, res) => {
  try {
    const { rating } = req.body;
    const user = await User.findById(req.user); // req.user comes from auth middleware

    if (!user) return res.status(404).json({ message: "User not found" });

    user.rating = rating;
    await user.save();

    res.json({ message: "Rating saved", rating: user.rating });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get rating for a specific user
router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("rating");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ rating: user.rating });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get overall average rating
router.get("/", async (req, res) => {
  try {
    const result = await User.aggregate([
      { $match: { rating: { $gt: 0 } } }, // only include users who have rated
      { $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } } }
    ]);

    if (result.length === 0) {
      return res.json({ avgRating: 0, count: 0 });
    }

    res.json({ avgRating: result[0].avgRating, count: result[0].count });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
