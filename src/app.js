import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import recommendationsRoutes from "./routes/recommendations.routes.js";
import skillRoutes from "./routes/skill.routes.js";
import requestRoutes from "./routes/requests.routes.js";
import resourceRoute from "./routes/resources.routes.js";
import messagesRoutes from "./routes/messages.routes.js";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    origin: "http://localhost:8080",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// API routes
app.use("/api/auth", userRoutes);
app.use("/api/recommendations", recommendationsRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/resources", resourceRoute);
app.use("/api/messages", messagesRoutes);

export default app;

