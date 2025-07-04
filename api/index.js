import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3001;

dotenv.config();

// Middleware
app.use(cors({
  origin:"*"
}));
app.use(express.json());

// Connect to MongoDB (update your MONGODB_URI)
const MONGODB_URI = process.env.MONGODB_URI 
mongoose.connect(MONGODB_URI,{dbName:"Finance"})
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Transaction Mongoose schema & model
const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: false },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

// Routes

// Get all transactions
app.get("/api/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// Add a transaction
app.post("/api/transactions", async (req, res) => {
  try {
    const { amount, date, description } = req.body;
    if (!amount || !date) {
      return res.status(400).json({ error: "Amount and date are required" });
    }
    const newTransaction = new Transaction({ amount, date: new Date(date), description });
    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(500).json({ error: "Failed to add transaction" });
  }
});

// Delete a transaction
app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Transaction.findByIdAndDelete(id);
    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete transaction" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


