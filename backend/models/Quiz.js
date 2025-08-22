const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  coupleId: { type: String, required: true }, // unique identifier for couple (email1-email2)
  questions: [
    {
      question: { type: String, required: true },
      answerA: { type: String, default: "" }, // Partner A’s answer
      answerB: { type: String, default: "" }, // Partner B’s answer
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Quiz", quizSchema);
