import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  amount: Number,
  description: String,
  date: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    enum: ["Food", "Transport", "Shopping", "Bills", "Health", "Other"],     
    default: "Other",
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;

