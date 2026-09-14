import express from "express";

import {
  getRelationships,
  addRelationship,
  deleteRelationship,
} from "../controllers/relationship.js";

const router = express.Router();

// GET followers
router.get("/", getRelationships);

// FOLLOW
router.post("/", addRelationship);

// UNFOLLOW
router.delete("/", deleteRelationship);

export default router;