import mongoose from "mongoose";

const ConnectDb = () => {
mongoose.connect(process.env.MONGODB_URI,{dbName:"Finance"})
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

}

export default ConnectDb;
