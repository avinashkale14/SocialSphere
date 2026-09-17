import express from "express";

import {
  getActivities,
} from "../controllers/activity.js";

const router = express.Router();

router.get(
  "/",
  getActivities
);

export default router;