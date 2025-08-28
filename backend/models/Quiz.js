const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAZ", // Matches User.js model name
      required: [true, "User reference is required"],
    },
    coupleId: {
      type: String,
      required: [true, "Couple ID is required"],
      index: true,
    },
    answers: [
      {
        questionId: {
          type: Number,
          required: [true, "Question ID is required"],
          min: [0, "Question ID must be non-negative"],
        },
        question: {
          type: String,
          required: [true, "Question is required"],
          trim: true,
          minlength: [1, "Question cannot be empty"],
        },
        answer: {
          type: String,
          required: [true, "Answer is required"],
          trim: true,
          minlength: [1, "Answer cannot be empty"],
          maxlength: [500, "Answer cannot exceed 500 characters"],
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Validate user reference exists
quizSchema.pre("save", async function (next) {
  try {
    const user = await mongoose.model("UserAZ").findById(this.user);
    if (!user) {
      return next(new Error("Referenced user does not exist"));
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Indexes for faster queries
quizSchema.index({ coupleId: 1, user: 1 }, { unique: true });
quizSchema.index({ coupleId: 1, createdAt: -1 });

module.exports = mongoose.model("Quiz", quizSchema);