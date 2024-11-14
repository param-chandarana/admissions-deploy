// import { Course } from "../models/course.model.js";

const Course = require("../models/course.model");

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get filtered and sorted courses with pagination
const getPaginatedCourses = async (req, res) => {
  const PAGE_SIZE = 10;
  const page = parseInt(req.query.page || "0");

  const sortField = req.query.sortField || "courseName";
  const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

  const filterQuery = {};
  if (req.query.qualification) {
    filterQuery.qualification = { $in: req.query.qualification.split(",") };
  }
  if (req.query.duration) {
    filterQuery.duration = { $in: req.query.duration.split(",") };
  }
  if (req.query.search) {
    filterQuery.courseName = { $regex: new RegExp(req.query.search, "i") };
  }

  try {
    const total = await Course.countDocuments({});
    const filtered = await Course.countDocuments(filterQuery);

    const courses = await Course.find(filterQuery)
      .sort({ [sortField]: sortOrder })
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * page);

    res.status(200).json({
      totalCourses: total,
      filteredCourses: filtered,
      totalPages: Math.ceil(filtered / PAGE_SIZE),
      courses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new course
const createCourse = async (req, res) => {
  const courseData = req.body;
  try {
    const createdCourse = await Course.create(courseData);
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single course by ID
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a course by ID
const updateCourseById = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const updatedCourse = await Course.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a course by ID
const deleteCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCourse = await Course.findByIdAndDelete(id);
    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get unique courses, qualifications and durations
const getDetails = async (req, res) => {
  try {
    const data = await Course.find({});

    const courseNamesSet = new Set();
    const qualificationsSet = new Set();
    const durationsSet = new Set();

    data.forEach((item) => {
      courseNamesSet.add(item.courseName);
      qualificationsSet.add(item.qualification);
      durationsSet.add(item.duration);
    });

    const courseNames = Array.from(courseNamesSet);
    const qualifications = Array.from(qualificationsSet);
    const durations = Array.from(durationsSet);

    const result = {
      courseNames: courseNames,
      qualifications: qualifications,
      durations: durations,
    };
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCourses,
  getPaginatedCourses,
  createCourse,
  getCourseById,
  updateCourseById,
  deleteCourseById,
  getDetails,
};
