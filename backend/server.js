require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const authRoutes = require("./routes/auth.js");
const coupleRoutes = require("./routes/couple.js");
const uploadRoutes = require("./routes/upload.js");
const ratingRoutes = require("./routes/rating.js");
const messageRoutes = require("./routes/message.js");
const quizRoutes = require("./routes/quiz.js");
const initSocket = require("./socket.js"); 

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // origin: "http://localhost:5173",
    // methods: ["GET", "POST"],
    origin: "*",
     methods: ["GET", "POST"],
  },
});

// app.use(cors({ origin: "http://localhost:5173" }));
app.use(cors({origin: "*"}))
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/couple", coupleRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/rating", ratingRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/quiz", quizRoutes);

// initialize socket.io
initSocket(io);

server.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
