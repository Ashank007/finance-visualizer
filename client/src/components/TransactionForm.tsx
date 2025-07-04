"use client";
import { useState } from "react";
import { PlusCircleIcon, CalendarIcon, CurrencyRupeeIcon, DocumentTextIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function TransactionForm({ onAdd }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShowSuccess(false); // Reset success message on new submission
    setIsSubmitting(true);

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid positive amount.");
      setIsSubmitting(false);
      return;
    }
    if (!date) {
      setError("Please select a valid date.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/transactions`, {
        method: "POST",
        body: JSON.stringify({ amount: +amount, description, date }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      onAdd(); // Trigger parent's data refresh
      setAmount("");
      setDescription("");
      setDate(new Date().toISOString().slice(0, 10));
      setShowSuccess(true); // Show success message
      setTimeout(() => setShowSuccess(false), 3000); // Hide after 3 seconds

    } catch (err) {
      console.error("Error adding transaction:", err);
      setError("Failed to add transaction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 md:p-8 bg-white rounded-xl shadow-lg border border-gray-200
                 font-sans text-gray-800 relative overflow-hidden"
    >
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8 pb-4 border-b border-gray-200">
        Record New Transaction
      </h2>

      <div className="space-y-6 mb-8">
        {/* Amount Field */}
        <div className="relative">
          <label htmlFor="amount" className="sr-only">Amount</label>
          <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
            <CurrencyRupeeIcon className="h-6 w-6 text-gray-500 ml-4 mr-2" />
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full p-3 text-lg text-gray-900 bg-transparent outline-none
                         placeholder-gray-400"
              placeholder="0.00"
              required
              aria-label="Transaction Amount"
            />
            <span className="text-gray-500 pr-4 text-lg">₹</span>
          </div>
        </div>

        {/* Date Field */}
        <div className="relative">
          <label htmlFor="date" className="sr-only">Date</label>
          <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
            <CalendarIcon className="h-6 w-6 text-gray-500 ml-4 mr-2" />
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().slice(0, 10)}
              className="block w-full p-3 text-lg text-gray-900 bg-transparent outline-none
                         appearance-none"
              required
              aria-label="Transaction Date"
            />
          </div>
        </div>

        {/* Description Field */}
        <div className="relative">
          <label htmlFor="description" className="sr-only">Description</label>
          <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
            <DocumentTextIcon className="h-6 w-6 text-gray-500 ml-4 mr-2" />
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Groceries, Rent, Salary"
              className="block w-full p-3 text-lg text-gray-900 bg-transparent outline-none"
              aria-label="Transaction Description (optional)"
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6"
            role="alert"
          >
            <XCircleIcon className="h-5 w-5 mr-3 flex-shrink-0" />
            <span className="block sm:inline">{error}</span>
            <button
              onClick={() => setError("")}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              aria-label="Close alert"
            >
              <XCircleIcon className="h-5 w-5 text-red-700" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6"
            role="alert"
          >
            <PlusCircleIcon className="h-5 w-5 mr-3 flex-shrink-0" />
            <span className="block sm:inline">Transaction added successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="submit"
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: 1.02 }}
        disabled={isSubmitting}
        className="w-full relative flex items-center justify-center bg-blue-600 text-white font-semibold
                   py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300
                   focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75
                   disabled:opacity-60 disabled:cursor-not-allowed text-lg"
      >
        {isSubmitting ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Adding...
          </div>
        ) : (
          <>
            <PlusCircleIcon className="h-6 w-6 mr-3" />
            Add Transaction
          </>
        )}
      </motion.button>
    </motion.form>
  );
}

