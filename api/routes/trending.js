import express from "express";

import {
  getTrendingPosts,
} from "../controllers/trending.js";

const router = express.Router();

router.get("/", getTrendingPosts);

export default router;