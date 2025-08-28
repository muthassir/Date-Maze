// routes/couple.js
const express = require("express");
const User = require("../models/User.js");
const auth = require("../middleware/auth.js");

const router = express.Router();

// Link couple
router.post("/link", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const { partnerEmail } = req.body;

    if (!partnerEmail) {
      return res.status(400).json({ message: "Partner email is required" });
    }

    const partner = await User.findOne({ email: partnerEmail });
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    // Update user with partner's username as coupleName
    user.status = "Dating";
    user.partnerEmail = partnerEmail;
    user.coupleName = partner.username;
    await user.save();

    // Update partner with user's username as coupleName
    partner.status = "Dating";
    partner.partnerEmail = user.email;
    partner.coupleName = user.username;
    await partner.save();

    res.json({
      status: user.status,
      partnerEmail: user.partnerEmail,
      coupleName: user.coupleName,
    });
  } catch (err) {
    console.error("Couple link error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



// Unlink couple
router.post("/unlink", auth, async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.partnerEmail) {
      return res.status(400).json({ message: "You are not linked with anyone." });
    }

    // Find partner
    const partner = await User.findOne({ email: user.partnerEmail });
    
    // Reset user's couple info
    user.partnerEmail = null;
    user.coupleName = "";
    user.status = "Single"; // Reset status to Single

    // Reset partner's couple info (if partner exists)
    if (partner) {
      partner.partnerEmail = null;
      partner.coupleName = "";
      partner.status = "Single";
      await partner.save();
    }

    await user.save();

    res.json({
      success: true,
      message: "Unlinked successfully.",
      status: user.status
    });

  } catch (err) {
    console.error("Unlink error:", err);
    res.status(500).json({ message: "Server error during unlinking", error: err.message });
  }
});

module.exports = router;