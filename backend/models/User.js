const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photos: [
    {
      letter: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  rating: { type: Number, default: 0 },
   status: { type: String, enum: ["Single", "Dating", "Married"], default: "Single" },
  coupleName: { type: String, default: "" },
  partnerEmail: { type: String, default: "" },
  
});

module.exports = mongoose.model("Usera-z", userSchema);
