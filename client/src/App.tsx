"use client";

import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import MonthlyChart from "./components/MonthlyChart";
import CategoryPieChart from "./components/CategoryPieChart";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import type { Transaction } from "./types/Transaction";

type LoadingSpinnerProps = {
  message: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/transactions`);
      const data = await res.json();
      setTransactions(data);
    } catch (err: any) {
      setError(err.message || "Failed to load transactions.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDataChange = () => {
    fetchData(); // Refetch data on transaction add/delete
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10 font-sans text-gray-800">
      {/* Background */}
      <div className="absolute inset-0 bg-white bg-grid-pattern opacity-5 -z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 opacity-80 -z-20"></div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-4xl mx-auto text-center py-10 md:py-12 mb-12 bg-white rounded-xl shadow-lg border border-gray-200"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
          Finance <span className="text-blue-600">Dashboard</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mt-4 max-w-xl mx-auto">
          Manage your transactions and track spending with ease.
        </p>
      </motion.header>

      <main className="max-w-6xl mx-auto space-y-10">
        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md max-w-lg mx-auto"
              role="alert"
            >
              <ExclamationCircleIcon className="h-6 w-6 mr-3" />
              <span className="font-medium">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-700 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-1"
              >
                &times;
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
          className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100"
        >
          <TransactionForm onAdd={handleDataChange} />
        </motion.section>

        {/* Transaction List & Monthly Bar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* List */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 min-h-[480px]"
          >
            {isLoading ? (
              <LoadingSpinner message="Loading transactions..." />
            ) : (
              <TransactionList
                transactions={transactions}
                onDelete={handleDataChange}
                key={`list-${refreshKey}`}
              />
            )}
          </motion.section>

          {/* Monthly Bar Chart */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 min-h-[480px]"
          >
            {isLoading ? (
              <LoadingSpinner message="Loading chart..." />
            ) : (
              <MonthlyChart transactions={transactions} />
            )}
          </motion.section>
        </div>

        {/* Category Pie Chart */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7, ease: "easeOut" }}
          className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 min-h-[400px]"
        >
          {isLoading ? (
            <LoadingSpinner message="Loading categories..." />
          ) : (
            <CategoryPieChart transactions={transactions} />
          )}
        </motion.section>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-16 py-8 text-center text-gray-500 text-sm"
      >
        &copy; {new Date().getFullYear()} Finance Dashboard. All rights reserved.
      </motion.footer>

      <style>{`
        .bg-grid-pattern {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
        }
        * {
          scrollbar-width: thin;
          scrollbar-color: #6366f1 #e0e7ff;
        }
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #e0e7ff;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background-color: #6366f1;
          border-radius: 10px;
          border: 2px solid #e0e7ff;
        }
      `}</style>
    </div>
  );
}

// Reusable Spinner
const LoadingSpinner = ({ message }: LoadingSpinnerProps) => (
  <div className="flex flex-col items-center justify-center h-full text-blue-600">
    <svg className="animate-spin h-10 w-10 text-blue-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
    <p className="text-lg text-gray-600">{message}</p>
  </div>
);

export default App;


