const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const Quiz = require("../models/Quiz.js");
const User = require("../models/User.js"); // Update to "User" if renamed
const auth = require("../middleware/auth.js");

// Hardcoded questions for consistency
const QUESTIONS = [
  "What is your partner’s favorite food?",
  "Where would your partner like to go on vacation?",
  "What is your partner’s dream job?",
  "What is your partner’s favorite movie?",
  "What song reminds your partner of you?",
  "What is your partner’s favorite color?",
  "Who said 'I love you' first?",
  "What is your partner’s biggest fear?",
  "What is your partner’s favorite hobby?",
  "What was your first date location?",
];

// Helper: get coupleId (sorted user IDs for consistency)
const getCoupleId = async (userId, partnerEmail) => {
  const partner = await User.findOne({ email: partnerEmail.toLowerCase() }, { _id: 1 }).lean();
  if (!partner) return null;
  return [userId, partner._id].sort().join("_");
};

// Check quiz submission
router.get("/submit", auth, async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId, { email: 1, partnerEmail: 1 }).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.partnerEmail) {
      return res.status(400).json({ message: "No partner linked" });
    }

    const coupleId = await getCoupleId(userId, user.partnerEmail);
    if (!coupleId) {
      return res.status(404).json({ message: "Partner not found" });
    }

    const quiz = await Quiz.findOne({ coupleId, user: userId }, { answers: 1 }).lean();
    if (!quiz) {
      return res.status(200).json({ submitted: false, answers: [] });
    }

    res.status(200).json({ submitted: true, answers: quiz.answers });
  } catch (err) {
    console.error("Check submission error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Submit quiz
router.post(
  "/submit",
  auth,
  [
    body("answers")
      .isArray({ min: QUESTIONS.length, max: QUESTIONS.length })
      .withMessage(`Answers must be an array of ${QUESTIONS.length} items`),
    body("answers.*")
      .isString()
      .trim()
      .notEmpty()
      .isLength({ max: 500 })
      .withMessage("Each answer must be a non-empty string up to 500 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const userId = req.user;
      const { answers } = req.body;

      const user = await User.findById(userId, { email: 1, partnerEmail: 1 }).lean();
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (!user.partnerEmail) {
        return res.status(400).json({ message: "No partner linked" });
      }

      const coupleId = await getCoupleId(userId, user.partnerEmail);
      if (!coupleId) {
        return res.status(404).json({ message: "Partner not found" });
      }

      // Check if user already submitted
      const existingQuiz = await Quiz.findOne({ coupleId, user: userId });
      if (existingQuiz) {
        return res.status(400).json({ message: "Quiz already submitted" });
      }

      const quiz = await Quiz.create({
        user: userId,
        coupleId,
        answers: answers.map((answer, i) => ({
          questionId: i,
          question: QUESTIONS[i],
          answer,
        })),
      });

      res.status(201).json({ message: "Quiz submitted successfully", quizId: quiz._id });
    } catch (err) {
      console.error("Quiz submission error:", err.message);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

// Get partner answers
router.get("/partner", auth, async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId, { email: 1, partnerEmail: 1 }).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.partnerEmail) {
      return res.status(400).json({ message: "No partner linked" });
    }

    const partner = await User.findOne({ email: user.partnerEmail.toLowerCase() }, { _id: 1 }).lean();
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    const coupleId = await getCoupleId(userId, user.partnerEmail);
    if (!coupleId) {
      return res.status(404).json({ message: "Partner not found" });
    }

    const partnerQuiz = await Quiz.findOne({ coupleId, user: partner._id }, { answers: 1 }).lean();
    if (!partnerQuiz) {
      console.log(`No quiz found for partner: ${partner._id}, coupleId: ${coupleId}`);
      return res.status(200).json({ answers: [], message: "Partner has not submitted quiz" });
    }

    res.status(200).json({ answers: partnerQuiz.answers });
  } catch (err) {
    console.error("Fetch partner answers error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get questions
router.get("/questions", auth, (req, res) => {
  const questions = QUESTIONS;
  res.status(200).json(questions);
});

// Debug route to inspect Quiz documents
router.get("/debug", auth, async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId, { email: 1, partnerEmail: 1 }).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const coupleId = user.partnerEmail ? await getCoupleId(userId, user.partnerEmail) : null;
    const quizzes = await Quiz.find(coupleId ? { coupleId } : { user: userId }).lean();
    res.status(200).json({ userId, coupleId, quizzes });
  } catch (err) {
    console.error("Debug quiz error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;