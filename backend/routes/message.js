const express = require("express");
const auth = require("../middleware/auth");
const Message = require("../models/Message");
const User = require("../models/User");

const router = express.Router();

// Send message
router.post("/", auth, async (req, res) => {
  try {
    const { text, receiverEmail } = req.body;
    if (!text || !receiverEmail)
      return res.status(400).json({ message: "Text and receiverEmail required" });

    const receiver = await User.findOne({ email: receiverEmail });
    if (!receiver)
      return res.status(404).json({ message: "Receiver not found" });

    const message = await Message.create({
      sender: req.user,
      receiver: receiver._id,
      text,
    });

    // Correct populate usage
    await message.populate([
      { path: "sender", select: "username email" },
      { path: "receiver", select: "username email" }
    ]);

    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send message", error: err.message });
  }
});

// Get messages
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user?.partnerEmail) return res.status(400).json({ message: "Partner email not set" });

    const partner = await User.findOne({ email: user.partnerEmail });
    if (!partner) return res.status(404).json({ message: "Partner not found" });

    const messages = await Message.find({
      $or: [
        { sender: req.user, receiver: partner._id },
        { sender: partner._id, receiver: req.user },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "username email")
      .populate("receiver", "username email");

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get messages", error: err.message });
  }
});

module.exports = router;
