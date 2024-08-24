// import mongoose from "mongoose";

const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    countryName: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    courseOfStudy: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    totalAnnualTuitionFee: {
      type: Number,
      required: true,
    },
    hostelMessAndOtherFees: {
      type: Number,
      required: true,
    },
    totalAnnualFees: {
      type: Number,
      required: true,
    },
    specialScholarshipFromInstitute: {
      type: Number,
      default: 0,
    },
    MUPresidentsSpecialScholarship: {
      type: Number,
      default: 0,
    },
    netAnnualFeePayable: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Capitalize string fields and uppercase studentId before saving
studentSchema.pre("save", async function (next) {
  const stringFields = ["studentName", "countryName", "qualification", "courseOfStudy"];
  const { studentId } = this;

  stringFields.forEach((field) => {
    if (this.isModified(field)) {
      this[field] = this[field]
        .split(' ') // Split the string into words
        .map(word => 
          word.charAt(0).toUpperCase() + word.slice(1) // Capitalize the first letter and lowercase the rest
        )
        .join(' '); // Join the words back into a single string
    }
  });

  if (studentId && this.isModified("studentId")) {
    this.studentId = studentId.toUpperCase();
  }

  next();
});

// export const Student = mongoose.model("Student", studentSchema);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
