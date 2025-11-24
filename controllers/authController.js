// controllers/authController.js

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Otp from "../models/Otp.js";
import sendEmail from "../utils/sendEmail.js";

// ====================================================
// 1️⃣ REGISTER USER + SEND OTP
// ====================================================
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // OTP generate
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    await Otp.deleteMany({ email });
    await Otp.create({ email, otp });

    await sendEmail(
      email,
      "FitFactory Email Verification",
      `Your OTP is <b>${otp}</b>. It expires in 5 minutes.`
    );

    await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      isVerified: false,
    });

    return res.status(201).json({
      message: "Registered! OTP sent to email.",
    });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ====================================================
// 2️⃣ LOGIN USER
// ====================================================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    if (!user.isVerified)
      return res.status(400).json({ message: "Verify your email first" });

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,

        plan: user.plan,
        status: user.status,
        startDate: user.startDate,
        expiryDate: user.expiryDate,
        attendance: user.attendance,

        isVerified: user.isVerified,
      },
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ====================================================
// 3️⃣ QR SCAN ENTRY SYSTEM  (Most Important)
// ====================================================
export const scanAccess = async (req, res) => {
  try {
    const { qrCode } = req.body;

    // 1) QR must match the gym entry QR
    if (qrCode !== "FitFactory-Gate-Entry") {
      return res.status(400).json({ message: "Invalid QR Code" });
    }

    // req.user is available from verifyUserToken()
    const user = await User.findById(req.user._id);

    // 2) No subscription
    if (user.plan === "None" || user.status === "not_subscribed") {
      return res.status(401).json({
        message: "No active subscription. Please renew.",
      });
    }

    // 3) Check expiry
    const now = new Date();
    const expiryDate = new Date(user.expiryDate);

    if (now > expiryDate) {
      user.status = "expired";
      await user.save();
      return res.status(401).json({
        message: "Subscription expired! Please renew.",
      });
    }

    // 4) Mark attendance
    const timestamp = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    user.attendance.push(timestamp);
    await user.save();

    return res.json({
      message: "Entry successful! Enjoy your workout 💪",
      attendance: timestamp,
    });

  } catch (error) {
    console.error("QR Scan Error:", error);
    return res.status(500).json({ message: error.message });
  }
};