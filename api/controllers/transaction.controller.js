import Transaction from "../models/transaction.js";


const getall_transaction = async(req,res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
}

const create_transaction = async (req,res) => {
  try {
    const { amount, date, description, category } = req.body;
    if (!amount || !date) {
      return res.status(400).json({ error: "Amount and date are required" });
    }
    const newTransaction = new Transaction({ amount, date: new Date(date), description:description,category:category});
    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(500).json({ error: "Failed to add transaction" });
  }
}

const delete_transaction = async (req,res) => {
  try {
    const id = req.params.id;
    await Transaction.findByIdAndDelete(id);
    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete transaction" });
  }
}

export {getall_transaction,create_transaction,delete_transaction};
