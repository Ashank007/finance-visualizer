
"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { Transaction } from "../types/Transaction";
import { motion, AnimatePresence } from "framer-motion";
import { ChartBarIcon, ExclamationCircleIcon} from '@heroicons/react/24/outline'; // Importing icons

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function MonthlyChart() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE_URL}/api/transactions`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data: Transaction[] = await res.json();
      setTransactions(data);
    } catch (err: any) {
      console.error("Failed to fetch transactions for chart:", err);
      setError("Failed to load chart data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []); // Fetch data only once on component mount for the chart

  // Data processing logic
  const grouped = transactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleString("en-IN", { month: "short", year: "numeric" });
    acc[month] = (acc[month] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(grouped)
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => {
      const [monthA, yearA] = a.month.split(" ");
      const [monthB, yearB] = b.month.split(" ");
      // Create full date objects for accurate sorting across years
      const dateA = new Date(`${monthA} 1, ${yearA}`);
      const dateB = new Date(`${monthB} 1, ${yearB}`);
      return dateA.getTime() - dateB.getTime();
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="max-w-lg mx-auto p-6 md:p-8 bg-white rounded-xl shadow-lg border border-gray-200
                 font-sans text-gray-800 mt-8"
    >
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8 pb-4 border-b border-gray-200">
        Monthly Spending Overview
      </h2>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading-chart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-[300px] text-blue-600"
          >
            <svg className="animate-spin h-8 w-8 text-blue-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg">Loading chart data...</p>
          </motion.div>
        )}

        {error && !loading && (
          <motion.div
            key="error-chart"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative h-[300px] justify-center text-center"
            role="alert"
          >
            <ExclamationCircleIcon className="h-6 w-6 mr-3 flex-shrink-0" />
            <span className="block sm:inline">{error}</span>
            <button
              onClick={() => setError("")}
              className="absolute top-2 right-2 px-2 py-1 text-red-700 hover:text-red-900"
              aria-label="Close alert"
            >
              &times;
            </button>
          </motion.div>
        )}

        {!loading && !error && chartData.length === 0 && (
          <motion.div
            key="no-chart-data"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center h-[300px] text-gray-500"
          >
            <ChartBarIcon className="h-12 w-12 mb-4 text-gray-400" />
            <p className="text-lg text-center">No transactions to generate a chart.</p>
            <p className="text-md text-gray-400">Start by adding your first transaction!</p>
          </motion.div>
        )}

        {!loading && !error && chartData.length > 0 && (
          <motion.div
            key="actual-chart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full"
            style={{ height: "300px" }} // Explicit height for ResponsiveContainer's parent
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} /> {/* Add subtle grid */}
                <XAxis
                  dataKey="month"
                  tickLine={false} // Remove tick lines
                  axisLine={false} // Remove axis line
                  interval="preserveStartEnd"
                  style={{ fontSize: "0.85rem", fill: "#6b7280" }} // Smaller, grayer font
                />
                <YAxis
                  tickFormatter={(value: number) => `₹${value.toLocaleString()}`} // Format Y-axis ticks
                  tickLine={false}
                  axisLine={false}
                  style={{ fontSize: "0.85rem", fill: "#6b7280" }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.05)" }} // Subtle highlight on hover
                  formatter={(value: number) => [`₹${value.toFixed(2)}`, "Total Amount"]} // Tooltip label and value
                  labelFormatter={(label: string) => `Month: ${label}`} // Format month label in tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    padding: "0.75rem",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                  }}
                  labelStyle={{ fontWeight: "bold", color: "#374151", marginBottom: "0.25rem" }}
                  itemStyle={{ color: "#4f46e5" }}
                />
                <Bar
                  dataKey="total"
                  fill="#6366f1" // A slightly more vibrant indigo
                  radius={[6, 6, 0, 0]} // Rounded tops for bars
                  barSize={30} // Adjust bar thickness
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

