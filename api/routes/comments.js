import express from "express";

import {
  getComments,
  addComment,
  deleteComment,
} from "../controllers/comment.js";

const router = express.Router();

// GET COMMENTS
router.get("/", getComments);

// ADD COMMENT
router.post("/", addComment);

// DELETE COMMENT
router.delete("/:id", deleteComment);

export default router;