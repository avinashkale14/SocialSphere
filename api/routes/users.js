import express from "express";

import {
  getUser,
  getUsers,
  getActivities,
  updateUser,
} from "../controllers/user.js";

const router = express.Router();


// ========================================
// GET ALL USERS
// ========================================

router.get("/", getUsers);


// ========================================
// GET LATEST ACTIVITIES
// ========================================

router.get("/activities", getActivities);


// ========================================
// GET USER BY ID
// ========================================

router.get("/find/:userId", getUser);


// ========================================
// UPDATE USER
// ========================================

router.put("/:id", updateUser);


export default router;