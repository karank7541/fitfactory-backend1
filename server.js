// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToDb from "./database/db.js";

import authRoutes from "./routes/authRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// ⭐ NEW FEEDBACK ROUTE
import feedbackRoutes from "./routes/feedbackRoutes.js";

dotenv.config();
connectToDb();

const app = express();

// Allow all origins for development
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

// ⭐ FEEDBACK ROUTE (User Feedback)
app.use("/api/feedback", feedbackRoutes);

// ADMIN ROUTES
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✔ Server running on ${PORT}`));