import express from "express";
import { generateOfferLetter } from "../controllers/pdf.controller.js";
import { protect } from "../middleware/authMiddleware.js";

// const express = require("express");
// const { generateOfferLetter } = require("../controllers/pdf.controller");
// const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/generate", generateOfferLetter);

export default router;

// module.exports = router;
