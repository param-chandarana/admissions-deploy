// import express from "express";
// import {
//   getPaginatedCourses,
//   getAllCourses,
//   getCourseById,
//   createCourse,
//   updateCourseById,
//   deleteCourseById,
//   getDetails,
// } from "../controllers/course.controller.js";
// import { protect } from "../middleware/authMiddleware.js";

const express = require("express");
const {
  getPaginatedCourses,
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourseById,
  deleteCourseById,
  getDetails,
} = require("../controllers/course.controller");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/get-all", getAllCourses);
router.get("/get", getPaginatedCourses)
router.get("/get/:id", getCourseById);
router.post("/add", createCourse);
router.put("/update/:id", updateCourseById);
router.delete("/delete/:id", deleteCourseById);
router.get("/get-details", getDetails);

// export default router;

module.exports = router;
