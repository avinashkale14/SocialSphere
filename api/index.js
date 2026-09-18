import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import likeRoutes from "./routes/likes.js";
import commentRoutes from "./routes/comments.js";
import relationshipRoutes from "./routes/relationships.js";
import storyRoutes from "./routes/stories.js";
import activityRoutes from "./routes/activities.js";
import trendingRoutes from "./routes/trending.js";

import "./connect.js";

const app = express();

const PORT = process.env.PORT || 8800;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// CORS
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// File upload
const upload = multer({
  storage: multer.memoryStorage(),
});

// Upload API
app.post("/api/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json("No file uploaded!");
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "socialsphere",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      stream.end(req.file.buffer);
    });

    return res.status(200).json(result.secure_url);
  } catch (error) {
    console.error("CLOUDINARY UPLOAD ERROR:", error);
    return res.status(500).json("Image upload failed!");
  }
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/trending", trendingRoutes);

// Root
app.get("/", (req, res) => {
  res.send("SocialSphere API is running!");
});

// Server
app.listen(PORT, () => {
  console.log(`SocialSphere API running on port ${PORT}`);
});