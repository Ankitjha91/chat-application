import { app, server } from './socket/socket.js';
import express from 'express';
import { connectDB } from './db/connection1.db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from "path";
import { fileURLToPath } from 'url';



// __dirname setup for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

app.use(cors({
  origin: [process.env.FRONTEND_URL],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// console.log(port);

// Importing user routes
import userRoutes from './routes/user.routes.js'
import messageRoute from './routes/message.routes.js'
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/message", messageRoute);

// Importing user middlewares
import { errorMiddleware } from './middlewares/error.middlewares.js';
app.use(errorMiddleware);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
