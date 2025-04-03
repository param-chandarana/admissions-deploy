// import { Student } from "../models/student.model.js";
// import * as XLSX from "xlsx";

const Student = require("../models/student.model");
const Settings = require("../models/settings.model");
const LastId = require("../models/lastId.model");
const XLSX = require("xlsx");

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({});
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get filtered and sorted students with pagination
const getPaginatedStudents = async (req, res) => {
  const PAGE_SIZE = 10;
  const page = parseInt(req.query.page || "0");

  const sortField = req.query.sortField || "studentId";
  const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

  const filterQuery = {};
  if (req.query.countryName) {
    filterQuery.countryName = { $in: req.query.countryName.split(",") };
  }
  if (req.query.qualification) {
    const qualifications = decodeURIComponent(req.query.qualification).split(
      ","
    );
    filterQuery.qualification = { $in: qualifications };
  }
  if (req.query.courseOfStudy) {
    filterQuery.courseOfStudy = { $in: req.query.courseOfStudy.split(",") };
  }
  if (req.query.duration) {
    filterQuery.duration = { $in: req.query.duration.split(",") };
  }
  if (req.query.search) {
    filterQuery.studentName = { $regex: new RegExp(req.query.search, "i") };
  }

  try {
    const total = await Student.countDocuments({});
    const filtered = await Student.countDocuments(filterQuery);

    const students = await Student.find(filterQuery)
      .sort({ [sortField]: sortOrder })
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * page);

    res.status(200).json({
      totalStudents: total,
      filteredStudents: filtered,
      totalPages: Math.ceil(filtered / PAGE_SIZE),
      students,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get student by ID
const getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateStudentId = async (req, res) => {
  try {
    // Fetch current academic year
    const settings = await Settings.findOne();
    if (!settings) {
      return res
        .status(500)
        .json({ error: "Academic year settings not found" });
    }

    const currentAcademicYear = settings.currentAcademicYear;

    // Get the last student ID
    let lastIdRecord = await LastId.findOne();
    let lastStudentId = lastIdRecord?.lastStudentId || "";

    let newStudentId;

    if (lastStudentId.includes(`/${currentAcademicYear}/`)) {
      // Extract and increment the last number
      const lastNumber = parseInt(lastStudentId.split("/").pop(), 10);
      const nextNumber = (lastNumber + 1).toString().padStart(3, "0");

      // Generate new student ID
      newStudentId = `INT/INT-KV/${currentAcademicYear}/${nextNumber}`;
    } else {
      // If last ID does not match current academic year, reset the counter to 001
      newStudentId = `INT/INT-KV/${currentAcademicYear}/001`;
    }

    res.status(200).json({ nextStudentId: newStudentId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating student ID" });
  }
};

// Create Student
const createStudent = async (req, res) => {
  try {
    const studentData = req.body;

    const createdStudent = await Student.create(studentData);
    res.status(201).json(createdStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update student by ID
const updateStudentById = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const updatedStudent = await Student.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete student by ID
const deleteStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Download the student data as an Excel file
const downloadExcel = async (req, res) => {
  const filterQuery = {};

  // Apply filters
  if (req.query.countryName) {
    filterQuery.countryName = { $in: req.query.countryName.split(",") };
  }
  if (req.query.qualification) {
    const qualifications = decodeURIComponent(req.query.qualification).split(
      ","
    );
    filterQuery.qualification = { $in: qualifications };
  }
  if (req.query.courseOfStudy) {
    filterQuery.courseOfStudy = { $in: req.query.courseOfStudy.split(",") };
  }
  if (req.query.duration) {
    filterQuery.duration = { $in: req.query.duration.split(",") };
  }
  if (req.query.search) {
    filterQuery.studentName = { $regex: new RegExp(req.query.search, "i") };
  }

  const sort = {};
  if (req.query.sortField) {
    sort[req.query.sortField] = req.query.sortOrder === "asc" ? 1 : -1;
  } else {
    sort["studentId"] = 1; // Default sort by studentId in ascending order
  }

  try {
    const students = await Student.find(filterQuery).sort(sort);

    const studentData = students.map((student) => ({
      "Student ID": student.studentId,
      "Student Name": student.studentName,
      "Country Name": student.countryName,
      Qualification: student.qualification,
      "Course of Study": student.courseOfStudy,
      Duration: student.duration,
      "Total Annual Tuition Fee": student.totalAnnualTuitionFee,
      "Hostel, Mess, and Other Fees": student.hostelMessAndOtherFees,
      "Total Annual Fees": student.totalAnnualFees,
      "Special Scholarship from Institute":
        student.specialScholarshipFromInstitute,
      "MU President's Special Scholarship":
        student.MUPresidentsSpecialScholarship,
      "Net Annual Fee Payable": student.netAnnualFeePayable,
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(studentData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    res.set({
      "Content-Disposition": "attachment; filename=Students.xlsx",
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    res.send(excelBuffer);
  } catch (error) {
    console.error("Error downloading the file", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Check if there are any student records in the database
const checkHasRecords = async (req, res) => {
  try {
    const { academicYear } = req.params;
    const studentCount = await Student.countDocuments({ academicYear });
    res.json(studentCount > 0);
  } catch (error) {
    res.status(500).json({ error: "Error checking student records" });
  }
};

module.exports = {
  getAllStudents,
  getPaginatedStudents,
  getStudentById,
  createStudent,
  updateStudentById,
  deleteStudentById,
  downloadExcel,
  checkHasRecords,
  generateStudentId,
};
