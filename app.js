// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import path from "path";
// import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// import courseRouter from "./routes/course.routes.js";
// import studentRouter from "./routes/student.routes.js";
// import userRouter from "./routes/user.routes.js";
// import pdfRouter from "./routes/pdf.routes.js";
// import lastIdRouter from "./routes/lastId.routes.js";

const courseRouter = require("./routes/course.routes");
const studentRouter = require("./routes/student.routes");
const userRouter = require("./routes/user.routes");
const lastIdRouter = require("./routes/lastId.routes");
const settingsRouter = require("./routes/settings.routes");

app.use("/api/courses", courseRouter);
app.use("/api/students", studentRouter);
app.use("/api/users", userRouter);
app.use("/api/last-id", lastIdRouter);
app.use("/api/settings", settingsRouter);

// app.get("/", (req, res) => {
//   res.send("Server is ready");
// });

app.use(express.static("./client/build"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

app.use(notFound);
app.use(errorHandler);

// export { app };

module.exports = app;
