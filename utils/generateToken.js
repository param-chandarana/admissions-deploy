// import jwt from "jsonwebtoken";
const jwt = require("jsonwebtoken");

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 3 * 12 * 30 * 24 * 60 * 60 * 1000,
  });
};

// export default generateToken;

module.exports = generateToken;
