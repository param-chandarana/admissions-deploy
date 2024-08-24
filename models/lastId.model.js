// import mongoose from "mongoose";

const mongoose = require("mongoose");

const lastIdSchema = new mongoose.Schema(
  {
    lastStudentId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Uppercase lastStudentId before saving
lastIdSchema.pre("save", async function (next) {
  const { lastStudentId } = this;

  if (lastStudentId && this.isModified("lastStudentId")) {
    this.lastStudentId = lastStudentId.toUpperCase();
  }

  next();
});

// export const LastId = mongoose.model("LastId", lastIdSchema);

const LastId = mongoose.model("LastId", lastIdSchema);

module.exports = LastId;

