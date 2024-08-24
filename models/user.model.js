// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Capitalize name before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("name")) {
    return next();
  }

  // Capitalize the first letter of each word
  this.name = this.name.replace(/\b\w/g, (char) => char.toUpperCase());

  next();
});

const User = mongoose.model("User", userSchema);

// export default User;

module.exports = User;
