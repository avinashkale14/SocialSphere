import express from "express";

import {
  getStories,
  addStory,
  deleteStory,
  addStoryView,
  getStoryViewers,
} from "../controllers/story.js";

const router = express.Router();


// ======================================================
// GET ALL ACTIVE STORIES
// ======================================================

router.get(
  "/",
  getStories
);


// ======================================================
// ADD STORY
// ======================================================

router.post(
  "/",
  addStory
);


// ======================================================
// DELETE OWN STORY
// ======================================================

router.delete(
  "/:id",
  deleteStory
);


// ======================================================
// RECORD STORY VIEW
// ======================================================

router.post(
  "/:id/view",
  addStoryView
);


// ======================================================
// GET STORY VIEWERS
// ======================================================

router.get(
  "/:id/viewers",
  getStoryViewers
);


export default router;