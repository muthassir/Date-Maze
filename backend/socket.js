// socket.js
const Message = require("./models/Message.js");

function initSocket(io) {
  // Map to track online users: userId -> socket.id
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // User joins their own room
    socket.on("join", (userId) => {
      socket.join(userId);
      onlineUsers.set(userId, socket.id);
      socket.broadcast.emit("userStatus", { userId, isOnline: true });
      console.log(`User ${userId} joined room ${userId}`);
    });

    // Send message
    socket.on("sendMessage", async (message) => {
      try {
        io.to(message.receiver).emit("receiveMessage", message);
        await Message.findByIdAndUpdate(message._id, {
          isOnline: onlineUsers.has(message.receiver),
        });
      } catch (err) {
        console.error("Error updating message online status:", err.message);
      }
    });

    // Mark message as seen
    socket.on("markSeen", async ({ messageId }) => {
      try {
        const updated = await Message.findByIdAndUpdate(
          messageId,
          { seen: true },
          { new: true }
        ).populate("sender receiver", "username email");
        if (updated) {
          io.to(updated.sender._id.toString()).emit("messageSeen", updated);
        }
      } catch (err) {
        console.error("Error marking message seen:", err.message);
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      const userId = [...onlineUsers.entries()].find(([_, sId]) => sId === socket.id)?.[0];
      if (userId) {
        onlineUsers.delete(userId);
        socket.broadcast.emit("userStatus", { userId, isOnline: false });
      }
    });
  });
}

module.exports = initSocket;
