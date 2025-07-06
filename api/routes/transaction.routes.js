import express from "express";
import { create_transaction, delete_transaction, getall_transaction } from "../controllers/transaction.controller.js";

const TransactionRouter = express.Router();

TransactionRouter.get("/transactions",getall_transaction);
TransactionRouter.post("/transactions",create_transaction);
TransactionRouter.delete("/transactions/:id",delete_transaction);

export default TransactionRouter;
