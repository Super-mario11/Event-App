// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const errorHandler = require("./errorHandler");

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        errorHandler({status:401, message:"Not authorized, token missing"});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
              errorHandler({status:401, message:"User not found"});
    }

    req.user = user; // user info available in req.user
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return next  (errorHandler({status:401, message:"token invali"}));
    }
    if (err.name === "TokenExpiredError") {
      return next  (errorHandler({status:401, message:"token expired"}));
    }
    next(err);
  }
};

// Organizer middleware
exports.organizer = (req, res, next) => {
  if (!req.user) {
          return next  (errorHandler({status:401, message:"token expired"}));
  }

  if (req.user.role !== "organizer") {
          return next  (errorHandler({status:403, message:"Access denied, organizer only"}));  }

  next();
};
