// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: "",
    },

    // ⭐ EMAIL VERIFICATION FLAG
    isVerified: {
      type: Boolean,
      default: false,   // jab tak OTP verify nahi karega, false rahega
    },

    // ======================
    // ⭐ ADMIN CONTROL FIELDS
    // ======================

    plan: {
      type: String,
      default: "None",
    },

    status: {
      type: String,
      enum: ["active", "expired", "not_subscribed"],
      default: "not_subscribed",
    },

    startDate: {
      type: String,
      default: "-",
    },

    expiryDate: {
      type: String,
      default: "-",
    },

    attendance: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;