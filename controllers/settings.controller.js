const Settings = require("../models/settings.model");

const getCurrentAcademicYear = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json({ currentAcademicYear: settings?.currentAcademicYear });
  } catch (error) {
    res.status(500).json({ error: "Error fetching academic year" });
  }
};

const updateCurrentAcademicYear = async (req, res) => {
  try {
    const { currentAcademicYear } = req.body;

    // 1. Validate format: should be YYYY-YY
    const academicYearRegex = /^(\d{4})-(\d{2})$/;
    const match = currentAcademicYear.match(academicYearRegex);

    if (!match) {
      return res.status(400).json({
        message: "Invalid academic year format. It should be YYYY-YY.",
      });
    }

    // 2. Validate consecutive years
    const firstYear = parseInt(match[1], 10);
    const secondYear = parseInt(match[2], 10);
    const expectedSecondYear = parseInt(
      (firstYear + 1).toString().slice(-2),
      10
    );

    if (secondYear !== expectedSecondYear) {
      return res.status(400).json({
        message: "Academic years must be consecutive (e.g., 2026-27).",
      });
    }

    // 3. Fetch the current settings
    const settings = await Settings.findOne({});

    // 4. Validate no backward updates
    if (settings && settings.currentAcademicYear) {
      const currentMatch =
        settings.currentAcademicYear.match(academicYearRegex);

      if (currentMatch) {
        const currentFirstYear = parseInt(currentMatch[1], 10);

        if (firstYear < currentFirstYear) {
          return res.status(400).json({
            message: "Cannot update to a previous academic year.",
          });
        }
      }
    }

    // 5. Update or insert the new academic year
    const updatedSettings = await Settings.findOneAndUpdate(
      {},
      { currentAcademicYear },
      { new: true, upsert: true }
    );

    res.status(200).json(updatedSettings);
  } catch (error) {
    console.error("Error updating academic year:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCurrentAcademicYear, updateCurrentAcademicYear };
