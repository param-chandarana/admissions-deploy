// import { Student } from "../models/student.model.js";
// import * as XLXS from "xlsx";

const Student = require("../models/student.model");
const XLXS = require("xlsx");

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({});
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get filtered students with pagination
const getPaginatedStudents = async (req, res) => {
  const PAGE_SIZE = 10;
  const page = parseInt(req.query.page || "0");

  const filterQuery = {};
  if (req.query.countryName) {
    filterQuery.countryName = { $in: req.query.countryName.split(",") };
  }
  if (req.query.qualification) {
    // Decode the query parameter to handle URL-encoded values
    const qualifications = decodeURIComponent(req.query.qualification).split(",");
    filterQuery.qualification = { $in: qualifications };
  }
  if (req.query.courseOfStudy) {
    filterQuery.courseOfStudy = { $in: req.query.courseOfStudy.split(",") };
  }
  if (req.query.duration) {
    filterQuery.duration = { $in: req.query.duration.split(",") };
  }
  if (req.query.academicYear) {
    const academicYearPattern = new RegExp("\\b" + `${req.query.academicYear}` + "\\b");
    filterQuery.studentId = { $regex: academicYearPattern };
  }
  if (req.query.search) {
    filterQuery.studentName = { $regex: new RegExp(req.query.search, 'i') };
  }

  try {
    const total = await Student.countDocuments({});
    const filtered = await Student.countDocuments(filterQuery);
    const students = await Student.find(filterQuery)
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

// Create a new student
const createStudent = async (req, res) => {
  const studentData = req.body;
  try {
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

// Get the highest student ID
const getHighestStudentId = async (req, res) => {
  try {
    const highestStudent = await Student.findOne({}, { studentId: 1 })
      .sort({ studentId: -1 })
      .lean()
      .exec();

    if (!highestStudent) {
      return res.status(404).json({ error: "No student found" });
    }

    res.json({ highestId: highestStudent.studentId });
  } catch (error) {
    console.error("Error fetching highest student ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to handle the request for downloading the student data as an Excel file
const downloadExcel = async (req, res) => {
  const filterQuery = {};
  
  if (req.query.countryName) {
    filterQuery.countryName = { $in: req.query.countryName.split(",") };
  }
  if (req.query.qualification) {
    const qualifications = decodeURIComponent(req.query.qualification).split(",");
    filterQuery.qualification = { $in: qualifications };
  }
  if (req.query.courseOfStudy) {
    filterQuery.courseOfStudy = { $in: req.query.courseOfStudy.split(",") };
  }
  if (req.query.duration) {
    filterQuery.duration = { $in: req.query.duration.split(",") };
  }
  if (req.query.academicYear) {
    const academicYearPattern = new RegExp("\\b" + `${req.query.academicYear}` + "\\b");
    filterQuery.studentId = { $regex: academicYearPattern };
  }
  if (req.query.search) {
    filterQuery.studentName = { $regex: new RegExp(req.query.search, 'i') };
  }

  try {
    const students = await Student.find(filterQuery);

    const studentData = students.map((student) => {
      return {
        "Student ID": student.studentId,
        "Student Name": student.studentName,
        "Country Name": student.countryName,
        "Qualification": student.qualification,
        "Course of Study": student.courseOfStudy,
        "Duration": student.duration,
        "Total Annual Tuition Fee": student.totalAnnualTuitionFee,
        "Hostel, Mess, and Other Fees": student.hostelMessAndOtherFees,
        "Total Annual Fees": student.totalAnnualFees,
        "Special Scholarship from Institute": student.specialScholarshipFromInstitute,
        "MU President's Special Scholarship": student.MUPresidentsSpecialScholarship,
        "Net Annual Fee Payable": student.netAnnualFeePayable,
      };
    });

    // Create a new workbook
    const workbook = XLXS.utils.book_new();

    // Create a new worksheet
    const worksheet = XLXS.utils.json_to_sheet(studentData);

    // Add the worksheet to the workbook
    XLXS.utils.book_append_sheet(workbook, worksheet, "Students");

    // Write the workbook to a buffer
    const excelBuffer = XLXS.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Set the response headers
    res.set({
      "Content-Disposition": "attachment; filename=Students.xlsx",
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Send the buffer as the response
    res.send(excelBuffer);
  } catch (error) {
    console.error("Error downloading the file", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllStudents,
  getPaginatedStudents,
  getStudentById,
  createStudent,
  updateStudentById,
  deleteStudentById,
  getHighestStudentId,
  downloadExcel
};