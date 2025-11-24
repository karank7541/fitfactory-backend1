import express from "express";
import { createFeedback } from "../controllers/feedbackController.js";
import { verifyUserToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// USER → POST FEEDBACK
router.post("/create", verifyUserToken, createFeedback);

export default router;