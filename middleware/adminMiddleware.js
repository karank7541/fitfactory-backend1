import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const verifyAdmin = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Admin token missing" });
    }

    // ⭐ Remove Bearer prefix
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check role
    if (!decoded || decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied — Admin only" });
    }

    // Verify admin exists in DB
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(403).json({ message: "Admin not found" });
    }

    req.admin = admin;

    next();

  } catch (error) {
    console.error("Admin Auth Error:", error.message);
    return res.status(401).json({ message: "Invalid or expired admin token" });
  }
};