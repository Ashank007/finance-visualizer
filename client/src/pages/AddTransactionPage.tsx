"use client";

import TransactionForm from "../components/TransactionForm";
import { useNavigate } from "react-router-dom";

export default function AddTransactionPage() {
  const navigate = useNavigate();

  const handleAdd = () => {
    // After successful add, redirect to transactions page
    navigate("/transactions");
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md mx-auto">
      <TransactionForm onAdd={handleAdd} />
    </div>
  );
}

