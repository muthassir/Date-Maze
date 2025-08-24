// const mongoose = require("mongoose");

// const messageSchema = new mongoose.Schema(
//   {
//     sender: { type: mongoose.Schema.Types.ObjectId, ref: "Usera-z", required: true },
//     receiver: { type: mongoose.Schema.Types.ObjectId, ref: "Usera-z", required: true },
//     text: { type: String, required: true },
//     seen: { type: Boolean, default: false },
//     isOnline: { type: String }
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Message", messageSchema);





const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "Usera-z", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "Usera-z", required: true },
    text: { type: String, required: true },
    seen: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);

