import express from "express";
import { 
  registerUser, 
  loginUser, 
  scanAccess 
} from "../controllers/authController.js";

import { verifyUserToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ===================================
// 1️⃣ USER REGISTER
// ===================================
router.post("/register", registerUser);

// ===================================
// 2️⃣ USER LOGIN
// ===================================
router.post("/login", loginUser);

// ===================================
// 3️⃣ PROTECTED DASHBOARD ROUTE
// ===================================
router.get("/dashboard", verifyUserToken, async (req, res) => {
  res.json({
    message: "Protected data",
    user: req.user,
  });
});

// ===================================
// 4️⃣ QR SCAN FOR GATE ENTRY
// ===================================
router.post("/scan-access", verifyUserToken, scanAccess);

export default router;