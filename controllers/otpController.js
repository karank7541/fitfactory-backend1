// controllers/otpController.js

import Otp from "../models/Otp.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

// ==========================
// SEND OTP (for register)
// ==========================
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email is required" });

    // 4 digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Remove old OTPs
    await Otp.deleteMany({ email });

    // Save new OTP (auto delete 5 min via schema)
    await Otp.create({ email, otp });

    // Send email
    await sendEmail(
      email,
      "FitFactory OTP Verification",
      `Your OTP is <b>${otp}</b>. It will expire in 5 minutes.`
    );

    return res.json({ message: "OTP sent successfully!" });

  } catch (error) {
    console.error("OTP Error:", error);
    return res.status(500).json({ message: "Server Error!" });
  }
};

// ==========================
// VERIFY OTP (🧠 IMPORTANT)
// ==========================
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // 1️⃣ Check OTP exist
    const validOtp = await Otp.findOne({ email, otp });

    if (!validOtp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // 2️⃣ Mark user as verified
    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      // Safety: agar user mil hi nahi raha
      return res.status(404).json({ message: "User not found for this email" });
    }

    // 3️⃣ Delete OTP so it can't be reused
    await Otp.deleteMany({ email });

    return res.json({
      message: "OTP verified successfully. You can now login.",
      user: {
        id: user._id,
        email: user.email,
        isVerified: user.isVerified,
      },
    });

  } catch (error) {
    console.error("OTP Verify Error:", error);
    return res.status(500).json({ message: "Server Error!" });
  }
};