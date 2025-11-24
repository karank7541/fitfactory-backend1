import Feedback from "../models/Feedback.js";
import User from "../models/User.js";


// ===============================
// USER → CREATE FEEDBACK
// ===============================
export const createFeedback = async (req, res) => {
  try {
    const { rating, feedback } = req.body;

    if (!rating || !feedback) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const newFeedback = await Feedback.create({
      userId: user._id,
      name: user.name,
      rating,
      feedback,
    });

    return res.json({
      message: "Feedback submitted successfully!",
      feedback: newFeedback,
    });

  } catch (err) {
    console.error("Feedback Error:", err);
    res.status(500).json({ message: err.message });
  }
};


// ===============================
// ADMIN → GET ALL FEEDBACK
// ===============================
export const getAllFeedback = async (req, res) => {
  try {
    const all = await Feedback.find().sort({ createdAt: -1 });

    // ⭐ FIX: rename `feedback` → `message`
    const formatted = all.map((fb) => ({
      _id: fb._id,
      name: fb.name,
      rating: fb.rating,
      message: fb.feedback,  // ⭐ ADMIN PANEL MESSAGE FIELD
      createdAt: fb.createdAt,
    }));

    return res.json(formatted);

  } catch (err) {
    console.error("Fetch Feedback Error:", err);
    res.status(500).json({ message: err.message });
  }
};


// ===============================
// ADMIN → DELETE FEEDBACK
// ===============================
export const deleteFeedback = async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);

    return res.json({
      message: "Feedback deleted successfully",
    });

  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: err.message });
  }
};