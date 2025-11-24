import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Admin from "./models/Admin.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(async () => {
  console.log("MongoDB Connected");

  const hashedPass = await bcrypt.hash("admin123", 10);

  await Admin.create({
    email: "admin@gmail.com",
    password: hashedPass
  });

  console.log("Admin Created Successfully!");
  process.exit();
});