"use client";
import { useEffect, useState } from "react";
import type { Transaction } from "../types/Transaction"; // Assuming this path is correct
import { TrashIcon, ArrowPathIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from "framer-motion";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type TransactionListProps = {
  onDelete: () => void;
};

function getCategoryColor(category: string | undefined) {
  switch ((category || "").toLowerCase()) {
    case "food":
      return "bg-pink-100 text-pink-800";
    case "transport":
      return "bg-yellow-100 text-yellow-800";
    case "shopping":
      return "bg-purple-100 text-purple-800";
    case "bills":
      return "bg-red-100 text-red-800";
    case "health":
      return "bg-green-100 text-green-800";
    case "other":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}


export default function TransactionList({ onDelete }: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(""); // Clear previous errors
    try {
      const res = await fetch(`${API_BASE_URL}/api/transactions`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data: Transaction[] = await res.json();
      setTransactions(data);
    } catch (err: any) {
      console.error("Failed to fetch transactions:", err);
      setError("Failed to load transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this transaction?")) {
      return;
    }
    setDeletingId(id);
    setError(""); // Clear previous errors
    try {
      const res = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      onDelete(); // Notify parent component (e.g., to refresh totals)
      await fetchTransactions(); // Re-fetch to update the list
    } catch (err) {
      console.error("Failed to delete transaction:", err);
      setError("Error deleting transaction. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [onDelete]); // Re-fetch when onDelete callback (or anything that implies data change) is triggered

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="max-w-lg mx-auto p-6 md:p-8 bg-white rounded-xl shadow-lg border border-gray-200
                 font-sans text-gray-800 mt-8"
    >
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8 pb-4 border-b border-gray-200">
        Transaction History
      </h2>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center py-8 text-blue-600"
          >
            <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg">Loading transactions...</p>
          </motion.div>
        )}

        {error && !loading && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6"
            role="alert"
          >
            <ExclamationCircleIcon className="h-5 w-5 mr-3 flex-shrink-0" />
            <span className="block sm:inline">{error}</span>
            <button
              onClick={() => setError("")}
              className="absolute top-0 bottom-0 right-0 px-4 py-3 text-red-700 hover:text-red-900"
              aria-label="Close alert"
            >
              &times;
            </button>
          </motion.div>
        )}

        {!loading && !error && transactions.length === 0 && (
          <motion.div
            key="no-transactions"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center py-8 text-gray-500"
          >
            <InformationCircleIcon className="h-12 w-12 mb-4 text-gray-400" />
            <p className="text-lg">No transactions recorded yet.</p>
            <p className="text-md text-gray-400">Add a new transaction above to get started!</p>
          </motion.div>
        )}

        {!loading && !error && transactions.length > 0 && (
          <motion.ul
            key="transaction-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {transactions.map((t) => (
              <motion.li
                key={t._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="flex justify-between items-center bg-gray-50 border border-gray-200 p-4 rounded-lg
                           hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex flex-col flex-grow min-w-0">
                  <span className="font-semibold text-gray-900 text-lg truncate mb-1" title={t.description}>
                    {t.description || "No Description"}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(t.date).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span
                    className={`inline-block px-3 py-0.5 text-xs font-semibold rounded-full
                                ${getCategoryColor(t.category)}`}
                  >
                    {t.category || "Other"}
                  </span>
                </div>
                  <div className="flex items-center space-x-4 ml-4">
                  <span className="text-blue-600 font-bold text-lg whitespace-nowrap">
                    ₹{t.amount.toFixed(2)}
                  </span>

                  <motion.button
                    onClick={() => handleDelete(t._id!)}
                    disabled={deletingId === t._id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 rounded-full text-red-500 hover:bg-red-100 transition-colors duration-200
                               ${deletingId === t._id ? "opacity-60 cursor-not-allowed" : ""}`}
                    title="Delete Transaction"
                    aria-label={`Delete transaction ${t.description}`}
                  >
                    {deletingId === t._id ? (
                      <svg className="animate-spin h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <TrashIcon className="h-6 w-6" />
                    )}
                  </motion.button>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <button
        onClick={fetchTransactions}
        className="mt-8 w-full flex items-center justify-center bg-gray-100 text-gray-700 font-semibold
                   py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors duration-200
                   focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 text-lg"
        disabled={loading || deletingId !== null}
      >
        <ArrowPathIcon className={`h-5 w-5 mr-3 ${loading ? 'animate-spin' : ''}`} />
        Refresh Transactions
      </button>
    </motion.div>
  );
}

