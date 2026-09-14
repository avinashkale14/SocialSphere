import express from "express";

import {
  getPosts,
  addPost,
  editPost,
  deletePost,
} from "../controllers/post.js";

const router = express.Router();

// GET ALL POSTS
router.get("/", getPosts);

// CREATE POST
router.post("/", addPost);

// EDIT POST
router.put("/:id", editPost);

// DELETE POST
router.delete("/:id", deletePost);

export default router;