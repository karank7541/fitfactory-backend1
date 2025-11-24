import express from "express";
import {
  adminLogin,
  getMessages,
  deleteMessage,
  getAllUsers,
  getSingleUser,
  assignPlan,
  getAttendance,
  getSubscriptions,
  deleteUser, // ✅ NEW
} from "../controllers/adminController.js";

import { verifyAdmin } from "../middleware/adminMiddleware.js";

// ⭐ FEEDBACK CONTROLLER IMPORT
import {
  getAllFeedback,
  deleteFeedback,
} from "../controllers/feedbackController.js";

const router = express.Router();

// ======================
// 1. ADMIN LOGIN
// ======================
router.post("/login", adminLogin);

// ======================
// 2. ADMIN MESSAGES
// ======================
router.get("/messages", verifyAdmin, getMessages);
router.delete("/messages/:id", verifyAdmin, deleteMessage);

// ======================
// 3. ALL CLIENTS
// ======================
router.get("/users", verifyAdmin, getAllUsers);

// ======================
// 4. SINGLE CLIENT DETAILS
// ======================
router.get("/user/:id", verifyAdmin, getSingleUser);

// ======================
// 5. ASSIGN/UPDATE PLAN
// ======================
router.patch("/update-plan/:id", verifyAdmin, assignPlan);

// ======================
// 6. ATTENDANCE LOGS
// ======================
router.get("/attendance", verifyAdmin, getAttendance);

// ======================
// 7. SUBSCRIPTIONS LIST
// ======================
router.get("/subscriptions", verifyAdmin, getSubscriptions);

// ======================
// 8. DELETE USER
// ======================
router.delete("/delete-user/:id", verifyAdmin, deleteUser);

// ======================
// ⭐ 9. FEEDBACK MANAGEMENT (NEW)
// ======================
router.get("/feedback", verifyAdmin, getAllFeedback);
router.delete("/feedback/:id", verifyAdmin, deleteFeedback);

export default router;