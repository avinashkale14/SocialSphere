import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// File upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, "../public/upload")
    );
  },

  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9);

    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        "-" +
        file.originalname
    );
  },
});

const upload = multer({
  storage,
});

// Upload API
app.post(
  "/api/upload",
  upload.single("file"),
  (req, res) => {
    if (!req.file) {
      return res
        .status(400)
        .json("No file uploaded!");
    }

    return res
      .status(200)
      .json(req.file.filename);
  }
);

// Serve uploaded files
app.use(
  "/upload",
  express.static(
    path.join(__dirname, "../public/upload")
  )
);

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
app.listen(8800, () => {
  console.log(
    "SocialSphere API running on port 8800"
  );
});