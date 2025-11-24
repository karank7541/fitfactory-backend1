// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToDb from "./database/db.js";

import authRoutes from "./routes/authRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";

dotenv.config();
connectToDb();

const app = express();

// Allow all origins
app.use(cors());
app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("FitFactory Backend Running...");
});

// USER AUTH + OTP ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/auth", otpRoutes);

// CONTACT ROUTES
app.use("/api/contact", contactRoutes);

// FEEDBACK ROUTES
app.use("/api/feedback", feedbackRoutes);

// ADMIN ROUTES
app.use("/api/admin", adminRoutes);

// ✔ IMPORTANT FOR RAILWAY
const PORT = process.env.PORT || 5001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✔ Server running on ${PORT}`);
});