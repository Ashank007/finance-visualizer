"use client";
import { useEffect, useState, useCallback } from "react";
import type { Transaction } from "../types/Transaction";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/transactions`);
      if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);
      const data: Transaction[] = await res.json();
      setTransactions(data);
    } catch (err) {
      setError((err as {message?:string})?.message ?? "Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    setTransactions,
    loading,
    error,
    refresh: fetchTransactions,
  };
}
