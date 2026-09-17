import express from "express";

import {
  getUser,
  getUsers,
  getActivities,
  updateUser,
} from "../controllers/user.js";

const router = express.Router();

router.get("/", getUsers);

router.get("/activities", getActivities);

router.get("/find/:userId", getUser);

router.put("/:id", updateUser);

export default router;