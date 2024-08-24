// import express from "express";
// import {
//   authUser,
//   registerUser,
//   logoutUser,
//   getUserProfile,
//   updateUserProfile,
// } from "../controllers/user.controller.js";
// import { protect } from "../middleware/authMiddleware.js";

const express = require("express");
const {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/user.controller");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// export default router;

module.exports = router;
