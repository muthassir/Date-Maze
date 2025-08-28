// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const http = require("http");
// const { Server } = require("socket.io");
// const User = require("./models/User.js");
// const Message = require("./models/Message.js");
// const Game = require("./models/Game.js");
// const authRoutes = require("./routes/auth.js");
// const coupleRoutes = require("./routes/couple.js");
// const uploadRoutes = require("./routes/upload.js");
// const ratingRoutes = require("./routes/rating.js");
// const messageRoutes = require("./routes/message.js");
// const quizRoutes = require("./routes/quiz.js");
// const gameRoutes = require("./routes/game.js");

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//   },
// });

// // Map to track online users: userId -> socket.id
// const onlineUsers = new Map();

// app.use(cors({ origin: "http://localhost:5173" }));
// app.use(express.json());

// mongoose
//   .connect(process.env.MONGO_URI, {})
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// app.use("/api/auth", authRoutes);
// app.use("/api/couple", coupleRoutes);
// app.use("/api/upload", uploadRoutes);
// app.use("/api/rating", ratingRoutes);
// app.use("/api/message", messageRoutes);
// app.use("/api/quiz", quizRoutes);
// app.use("/api/game", gameRoutes);

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   // Messaging: User joins their own room
//   socket.on("join", (userId) => {
//     socket.join(userId);
//     onlineUsers.set(userId, socket.id);
//     socket.broadcast.emit("userStatus", { userId, isOnline: true });
//     console.log(`User ${userId} joined room ${userId}`);
//   });

//   // Messaging: Send message
//   socket.on("sendMessage", async (message) => {
//     try {
//       io.to(message.receiver).emit("receiveMessage", message);
//       await Message.findByIdAndUpdate(message._id, { isOnline: onlineUsers.has(message.receiver) });
//     } catch (err) {
//       console.error("Error updating message online status:", err.message);
//     }
//   });

//   // Messaging: Mark message as seen
//   socket.on("markSeen", async ({ messageId, receiverId }) => {
//     try {
//       const updated = await Message.findByIdAndUpdate(
//         messageId,
//         { seen: true },
//         { new: true }
//       ).populate("sender receiver", "username email");
//       if (updated) {
//         io.to(updated.sender._id.toString()).emit("messageSeen", updated);
//       }
//     } catch (err) {
//       console.error("Error marking message seen:", err.message);
//     }
//   });

//   // Tic-Tac-Toe: Join game room
//   socket.on("joinRoom", async ({ userId, partnerEmail }) => {
//     try {
//       const partner = await User.findOne({ email: partnerEmail.toLowerCase() }, { _id: 1 }).lean();
//       if (!partner) throw new Error("Partner not found");
//       const coupleId = [userId, partner._id].sort().join("_");
//       socket.join(coupleId);
//       console.log(`User ${userId} joined game room ${coupleId}`);
//     } catch (err) {
//       console.error("Join game room error:", err.message);
//       socket.emit("gameError", { message: "Failed to join game room" });
//     }
//   });

//   // Tic-Tac-Toe: Make move
//   socket.on("makeMove", async ({ gameId, index, userId, partnerEmail }) => {
//     try {
//       const partner = await User.findOne({ email: partnerEmail.toLowerCase() }, { _id: 1 }).lean();
//       if (!partner) throw new Error("Partner not found");
//       const coupleId = [userId, partner._id].sort().join("_");
//       const game = await Game.findById(gameId);
//       if (!game || game.coupleId !== coupleId || game.status !== "active") {
//         socket.emit("gameError", { message: "Invalid game or move" });
//         return;
//       }

//       if (game.board[index]) {
//         socket.emit("gameError", { message: "Cell already taken" });
//         return;
//       }

//       const isUserX = userId < partner._id;
//       if ((isUserX && game.currentPlayer !== "X") || (!isUserX && game.currentPlayer !== "O")) {
//         socket.emit("gameError", { message: "Not your turn" });
//         return;
//       }

//       console.log(`Processing move: gameId=${gameId}, index=${index}, userId=${userId}, currentPlayer=${game.currentPlayer}`);

//       game.board[index] = game.currentPlayer;
//       game.currentPlayer = game.currentPlayer === "X" ? "O" : "X";

//       const winner = calculateWinner(game.board);
//       if (winner) {
//         game.status = winner === "draw" ? "draw" : "won";
//         game.winner = winner === "draw" ? null : winner;
//       } else if (!game.board.includes(null)) {
//         game.status = "draw";
//       }

//       await game.save();
//       console.log(`Move saved: board=${JSON.stringify(game.board)}, status=${game.status}, winner=${game.winner}`);

//       io.to(coupleId).emit("moveMade", {
//         board: game.board,
//         currentPlayer: game.currentPlayer,
//         status: game.status,
//         winner: game.winner,
//       });

//       // Notify partner via messaging system
//       try {
//         if (game.status === "active") {
//           const notification = await Message.create({
//             sender: userId,
//             receiver: partner._id,
//             text: `Your partner made a move in Tic-Tac-Toe! It's your turn.`,
//             seen: onlineUsers.has(partner._id),
//           });
//           io.to(partner._id).emit("receiveMessage", notification);
//         }
//       } catch (err) {
//         console.error("Error sending game notification:", err.message);
//       }
//     } catch (err) {
//       console.error("Make move error:", err.message);
//       socket.emit("gameError", { message: "Server error" });
//     }
//   });

//   // Tic-Tac-Toe: Reset game
//   socket.on("resetGame", async ({ gameId, userId, partnerEmail }) => {
//     try {
//       const partner = await User.findOne({ email: partnerEmail.toLowerCase() }, { _id: 1 }).lean();
//       if (!partner) throw new Error("Partner not found");
//       const coupleId = [userId, partner._id].sort().join("_");
//       const game = await Game.findById(gameId);
//       if (!game || game.coupleId !== coupleId) {
//         socket.emit("gameError", { message: "Invalid game" });
//         return;
//       }

//       game.board = Array(9).fill(null);
//       game.currentPlayer = "X";
//       game.status = "active";
//       game.winner = null;
//       await game.save();
//       console.log(`Game reset: gameId=${gameId}, coupleId=${coupleId}`);

//       io.to(coupleId).emit("gameReset", {
//         board: game.board,
//         currentPlayer: game.currentPlayer,
//         status: game.status,
//         winner: null,
//       });

//       // Notify partner of reset
//       try {
//         const notification = await Message.create({
//           sender: userId,
//           receiver: partner._id,
//           text: `Your partner reset the Tic-Tac-Toe game!`,
//           seen: onlineUsers.has(partner._id),
//         });
//         io.to(partner._id).emit("receiveMessage", notification);
//       } catch (err) {
//         console.error("Error sending reset notification:", err.message);
//       }
//     } catch (err) {
//       console.error("Reset game error:", err.message);
//       socket.emit("gameError", { message: "Server error" });
//     }
//   });

//   // Handle disconnect
//   socket.on("disconnect", async () => {
//     console.log("User disconnected:", socket.id);
//     const userId = [...onlineUsers.entries()].find(([_, sId]) => sId === socket.id)?.[0];
//     if (userId) {
//       onlineUsers.delete(userId);
//       socket.broadcast.emit("userStatus", { userId, isOnline: false });

//       try {
//         const user = await User.findById(userId, { partnerEmail: 1 }).lean();
//         if (user?.partnerEmail) {
//           const partner = await User.findOne({ email: user.partnerEmail.toLowerCase() }, { _id: 1 }).lean();
//           if (partner) {
//             const coupleId = [userId, partner._id].sort().join("_");
//             const game = await Game.findOne({ coupleId, status: "active" });
//             if (game) {
//               game.status = "draw";
//               game.winner = null;
//               await game.save();
//               console.log(`Game ended due to disconnect: gameId=${game._id}, coupleId=${coupleId}`);
//               io.to(coupleId).emit("gameReset", {
//                 board: game.board,
//                 currentPlayer: game.currentPlayer,
//                 status: game.status,
//                 winner: null,
//               });
//               try {
//                 const notification = await Message.create({
//                   sender: userId,
//                   receiver: partner._id,
//                   text: `Your partner disconnected, Tic-Tac-Toe game ended.`,
//                   seen: onlineUsers.has(partner._id),
//                 });
//                 io.to(partner._id).emit("receiveMessage", notification);
//               } catch (err) {
//                 console.error("Error sending disconnect notification:", err.message);
//               }
//             }
//           }
//         }
//       } catch (err) {
//         console.error("Disconnect error:", err.message);
//       }
//     }
//   });
// });

// function calculateWinner(board) {
//   const lines = [
//     [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
//     [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
//     [0, 4, 8], [2, 4, 6], // Diagonals
//   ];
//   for (let [a, b, c] of lines) {
//     if (board[a] && board[a] === board[b] && board[a] === board[c]) {
//       return board[a];
//     }
//   }
//   return board.includes(null) ? null : "draw";
// }

// server.listen(process.env.PORT || 5000, () => {
//   console.log(`Server running on port ${process.env.PORT || 5000}`);
// });



















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
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: "http://localhost:5173" }));
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
