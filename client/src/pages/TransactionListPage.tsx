"use client";

import TransactionList from "../components/TransactionList";
import { useEffect, useState } from "react";
import type { Transaction } from "../types/Transaction";
import { LoadingSpinner, ErrorMessage } from "./Utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function TransactionListPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/transactions`);
      if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);
      const data = await res.json();
      setTransactions(data);
    } catch (err: any) {
      setError(err.message || "Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) return <LoadingSpinner message="Loading transactions..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl border border-gray-100 max-w-5xl mx-auto">
      <TransactionList transactions={transactions} onDelete={fetchTransactions} />
    </div>
  );
}

