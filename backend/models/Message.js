const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "UserAZ", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "UserAZ", required: true },
    text: { type: String, required: true },
    seen: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);

