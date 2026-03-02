import 'dotenv/config';

import express from "express";
import cors from "cors";
import aiRouter from "./routes/aiRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { authMiddleware } from "./middlewares/auth.js";
import { checkConnection } from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is Live!");
});

app.get("/api/health", async (req, res) => {
  const dbOk = await checkConnection();
  res.status(dbOk ? 200 : 503).json({
    status: dbOk ? "ok" : "degraded",
    database: dbOk ? "connected" : "disconnected",
  });
});

// protect APIs with Clerk auth middleware
app.use("/api/ai", authMiddleware, aiRouter);
app.use("/api/user", authMiddleware, userRouter);

const PORT = process.env.PORT || 3000;

// Ensure Cloudinary is connected on startup
await connectCloudinary();

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});