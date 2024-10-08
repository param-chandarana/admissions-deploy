const express = require("express");
const { generateOfferLetter } = require("../controllers/pdf.controller");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.post("/generate", generateOfferLetter);

module.exports = router;
