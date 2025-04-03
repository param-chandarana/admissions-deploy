// import { LastId } from "../models/lastId.model.js";

const LastId = require("../models/lastId.model");

// Get last ID
const getLastId = async (req, res) => {
  try {
    const lastIdRecord = await LastId.findOne();
    res.json({ lastStudentId: lastIdRecord?.lastStudentId || null });
  } catch (error) {
    res.status(500).json({ error: "Error fetching last student ID" });
  }
};

// Update last ID
const updateLastId = async (req, res) => {
  try {
    const { lastStudentId } = req.body;
    let lastIdRecord = await LastId.findOne();

    if (!lastIdRecord) {
      lastIdRecord = new LastId({ lastStudentId });
    } else {
      lastIdRecord.lastStudentId = lastStudentId;
    }

    await lastIdRecord.save();
    res.json({ message: "Last student ID updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating last student ID" });
  }
};

module.exports = {
  getLastId,
  updateLastId,
};
