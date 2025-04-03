const express = require("express");
const {
  getCurrentAcademicYear,
  updateCurrentAcademicYear,
} = require("../controllers/settings.controller");
const router = express.Router();

router.get("/current-academic-year", getCurrentAcademicYear);
router.put("/update-academic-year", updateCurrentAcademicYear);

module.exports = router;
