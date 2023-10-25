import mongoose from "mongoose";

mongoose.set('strictQuery', true);


const dbConnection = async (): Promise<void> => {
  try {
    if (process.env.MONGO_URL) await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to database...");
  } catch (e) {
    console.log(e);
  }
};

export { dbConnection };
