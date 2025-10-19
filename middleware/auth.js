const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const SECRET = process.env.JWT_SECRET || "supersecretjwtkey";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token){
      return res.status(401).json({ status: 0, message: "No token provided" });
    }

    const decode = jwt.verify(token, SECRET);
    req.user = await User.findById(decode.id);
    if (!req.user)
      return res.status(401).json({ status: 0, message: "Invalid token" });

    next();
  } catch (error) {
    res.status(401).json({ status: 0, message: "Unauthorized" });
  }
};

module.exports = authMiddleware