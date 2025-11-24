import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✔ MongoDB Connected Successfully");
  } catch (error) {
    console.log("❌ MongoDB Connection Failed:", error.message);
  }
};

export default connectToDb;