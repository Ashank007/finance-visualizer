import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import ConnectDb from "./config/connectdb.js";
import TransactionRouter from "./routes/transaction.routes.js";

const app = express();
const port = process.env.PORT || 3001;

dotenv.config();

app.use(cors({
  origin:"*"
}));
app.use(express.json());

ConnectDb();


app.use("/api",TransactionRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


