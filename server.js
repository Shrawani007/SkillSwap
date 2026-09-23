import http from "http";
import { Server } from "socket.io";
import app from "./src/app.js";
import { connectDB } from "./src/db/database.js";

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    const httpServer = http.createServer(app);

    const io = new Server(httpServer, {
      cors: {
        origin: "http://localhost:8080", // same as your frontend
        credentials: true,
      },
    });

    const users = {}; // 🔥 userId -> socketId

    io.on("connection", (socket) => {
      console.log("🟢 User connected:", socket.id);

      // 🔥 REGISTER USER
      socket.on("register", (userId) => {
        users[userId] = socket.id;
        console.log("Registered:", userId, socket.id);
      });

      // 🔥 SEND MESSAGE TO SPECIFIC USER
      socket.on("send_message", (data) => {
        const { text, senderId, receiverId } = data;

        const receiverSocket = users[receiverId];

        if (receiverSocket) {
          io.to(receiverSocket).emit("receive_message", {
            text,
            senderId,
          });
        }
      });

      socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);
      });
    });

    const server = httpServer.listen(PORT, () => {
      console.log(`🚀 Server running with Socket.IO at http://localhost:${PORT}`);
    });

    process.on("SIGINT", () => {
      console.log("SIGINT received, shutting down");
      server.close(() => process.exit(0));
    });
    process.on("SIGTERM", () => {
      console.log("SIGTERM received, shutting down");
      server.close(() => process.exit(0));
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
