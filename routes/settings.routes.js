const express = require("express");
const {
  getCurrentAcademicYear,
  updateCurrentAcademicYear,
} = require("../controllers/settings.controller");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.get("/current-academic-year", getCurrentAcademicYear);
router.put("/update-academic-year", updateCurrentAcademicYear);

module.exports = router;
