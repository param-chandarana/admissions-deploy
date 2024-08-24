// import dotenv from "dotenv";
// import connectDB from "./db/index.js";
// import { app } from "./app.js";

const dotenv = require("dotenv");
const connectDB = require("./db/index");
const app = require("./app");

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed", err);
  });
