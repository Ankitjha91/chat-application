import dotenv from "dotenv";
dotenv.config();

import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL], // frontend origin
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketMap = {}; // userId -> socket.id

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (!userId) {
    console.log("❌ UserId not found in handshake query");
    return;
  }

  userSocketMap[userId] = socket.id;
  console.log("✅ Connected Users:", Object.keys(userSocketMap));

  io.emit("onlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("onlineUsers", Object.keys(userSocketMap));
    console.log("❌ Disconnected:", userId);
  });
});

const getSocketId = (userId) => {
  return userSocketMap[userId];
};


export { io, server, app, getSocketId };
