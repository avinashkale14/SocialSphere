import express from "express";

import {
  getStories,
  addStory,
  deleteStory,
  addStoryView,
  getStoryViewers,
} from "../controllers/story.js";

const router = express.Router();

router.get("/", getStories);

router.post("/", addStory);

router.delete("/:id", deleteStory);

router.post("/:id/view", addStoryView);

router.get("/:id/viewers", getStoryViewers);

export default router;