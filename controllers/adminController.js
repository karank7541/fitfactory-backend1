import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Contact from "../models/Contact.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ===================================================
// 1. ADMIN LOGIN
// ===================================================
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ===================================================
// 2. GET CONTACT MESSAGES
// ===================================================
export const getMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    return res.json(messages);
  } catch (error) {
    console.error("Get Messages Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    return res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Delete Message Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ===================================================
// 3. GET ALL USERS
// ===================================================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    console.error("Get Users Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ===================================================
// 4. GET SINGLE USER
// ===================================================
export const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json(user);
  } catch (error) {
    console.error("Get Single User Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ===================================================
// 5. ASSIGN / UPDATE PLAN (Calendar Based)
// ===================================================
export const assignPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { plan, duration, startDate } = req.body;

    if (!plan || !duration || !startDate)
      return res.status(400).json({
        message: "Plan, duration & start date are required",
      });

    const start = new Date(startDate);
    if (isNaN(start.getTime()))
      return res.status(400).json({ message: "Invalid start date" });

    const expiry = new Date(start);
    expiry.setDate(start.getDate() + Number(duration));

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        plan,
        status: "active",
        startDate: start.toISOString(),
        expiryDate: expiry.toISOString(),
      },
      { new: true }
    ).select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    return res.json({
      message: "Subscription Updated Successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Assign Plan Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ===================================================
// 6. ATTENDANCE LOGS
// ===================================================
export const getAttendance = async (req, res) => {
  try {
    const users = await User.find().select("name email attendance");

    const logs = [];

    users.forEach((u) => {
      (u.attendance || []).forEach((entry) => {
        logs.push({
          userId: u._id,
          name: u.name,
          email: u.email,
          entry,
        });
      });
    });

    return res.json(logs);
  } catch (error) {
    console.error("Get Attendance Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ===================================================
// 7. SUBSCRIPTIONS LIST
// ===================================================
export const getSubscriptions = async (req, res) => {
  try {
    const users = await User.find({ plan: { $ne: "None" } })
      .select("-password")
      .sort({ startDate: -1 });

    return res.json(users);
  } catch (error) {
    console.error("Get Subscriptions Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ===================================================
// 8. DELETE USER  ✅ FULL WORKING FUNCTION
// ===================================================
export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ message: "User not found" });

    return res.json({ message: "Client deleted successfully!" });
  } catch (error) {
    console.error("Delete User Error:", error);
    return res.status(500).json({ message: error.message });
  }
};