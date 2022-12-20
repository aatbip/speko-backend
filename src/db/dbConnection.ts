import mongoose from "mongoose";

const dbConnection = async (): Promise<void> => {
  try {
    if (process.env.MONGO_URI) await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database...");
  } catch (e) {
    console.log(e);
  }
};

export { dbConnection };
