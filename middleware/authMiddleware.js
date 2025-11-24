import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyUserToken = async (req, res, next) => {
  try {
    // Read token safely (handles lowercase + Bearer support)
    let token = req.headers.authorization || req.headers.Authorization;

    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    // If "Bearer xyz..." → remove "Bearer "
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();

  } catch (err) {
    console.error("User Token Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};