// src/components/transactions/TransactionRow.tsx
"use client";
import { motion } from "framer-motion";
import type { Transaction } from "../../types/Transaction";
import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteTransactionApi } from "../../hooks/useTransactionCrud";
import { useState } from "react";

function getCategoryColor(category?: string) {
  switch ((category || "").toLowerCase()) {
    case "food":
      return "bg-pink-600/10 text-pink-300";
    case "transport":
      return "bg-yellow-600/10 text-yellow-300";
    case "shopping":
      return "bg-purple-600/10 text-purple-300";
    case "bills":
      return "bg-red-600/10 text-red-300";
    case "health":
      return "bg-green-600/10 text-green-300";
    case "other":
      return "bg-gray-700/10 text-gray-300";
    default:
      return "bg-gray-700/10 text-gray-300";
  }
}

export default function TransactionRow({ tx, onDeleted }: { tx: Transaction; onDeleted: () => void }) {
  const [deleting, setDeleting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!tx._id) return;
    if (!confirm("Delete this transaction? This is permanent.")) return;
    setDeleting(true);
    setErr(null);
    try {
      await deleteTransactionApi(tx._id);
      onDeleted();
    } catch (e) {
      setErr((e as {message?:string})?.message ?? "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.18 }}
      className="flex items-center justify-between gap-4 p-3 rounded-lg bg-[#071011] border border-[#0f1416] hover:shadow-md"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <div className={`px-2 py-1 rounded text-xs font-semibold ${getCategoryColor(tx.category)}`}>
            {tx.category || "Other"}
          </div>
          <div className="text-sm text-gray-300 font-medium truncate">{tx.description || "No description"}</div>
        </div>
        <div className="text-xs text-gray-500 mt-1">{new Date(tx.date).toLocaleString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</div>
      </div>

      <div className="flex items-center gap-3">
        <div className={`font-semibold ${tx.amount < 0 ? "text-red-400" : "text-cyan-300"}`}>
          ₹{tx.amount.toFixed(2)}
        </div>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-2 rounded-md bg-white/3 hover:bg-white/6 text-red-300"
          title="Delete"
        >
          {deleting ? (
            <svg className="animate-spin h-4 w-4 text-red-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          ) : (
            <TrashIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      {err && <div className="text-xs text-red-400 mt-2">{err}</div>}
    </motion.li>
  );
}
