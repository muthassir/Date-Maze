// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const dotenv = require("dotenv");

// const authRoutes = require("./routes/auth.js");
// const uploadRoutes = require("./routes/upload.js");
// const ratingRoutes = require("./routes/rating.js");
// const messageRoutes = require("./routes/message.js");

// dotenv.config();

// const app = express();
// app.use(cors({ origin: "*" }));
// app.use(express.json());

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error(err));

// app.use("/api/auth", authRoutes);
// app.use("/api/upload", uploadRoutes);
// app.use("/api/rating", ratingRoutes);
// app.use("/api/message", messageRoutes);

// app.listen(5000, () => console.log("Server running on http://localhost:5000"));








const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { createServer } = require("http");
const { Server } = require("socket.io");
const Message = require("./models/Message.js");

const authRoutes = require("./routes/auth.js");
const uploadRoutes = require("./routes/upload.js");
const ratingRoutes = require("./routes/rating.js");
const messageRoutes = require("./routes/message.js");

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(cors({ origin: "*" }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/rating", ratingRoutes);
app.use("/api/message", messageRoutes);

// ✅ SOCKET.IO SETUP
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins a room based on userId
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  // Send message event
  socket.on("sendMessage", (message) => {
    io.to(message.receiver).emit("receiveMessage", message);
  });

  // Mark message as seen
  socket.on("markSeen", async ({ messageId, receiverId }) => {
    try {
      const updated = await Message.findByIdAndUpdate(
        messageId,
        { seen: true },
        { new: true }
      ).populate("sender receiver", "username email");

      if (updated) {
        // notify sender that message was seen
        io.to(updated.sender._id.toString()).emit("messageSeen", updated);
      }
    } catch (err) {
      console.error("Error marking message seen:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

httpServer.listen(5000, () => console.log("Server running on http://localhost:5000"));
