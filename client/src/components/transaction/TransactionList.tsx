// src/components/transactions/TransactionList.tsx
"use client";
import { AnimatePresence, motion } from "framer-motion";
import TransactionRow from "./TransactionRow";
import type { Transaction } from "../../types/Transaction";
import { InformationCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

export default function TransactionList({
  transactions,
  loading,
  error,
  onRefresh,
  onDeleted,
}: {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onDeleted: () => void;
}) {
  return (
    <section className="bg-[#0b0f10] border border-[#121416] p-4 rounded-xl shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">History</h2>
        <div className="text-sm text-gray-400">{transactions.length} transactions</div>
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 flex items-center justify-center text-cyan-300">
            <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-cyan-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm">Loading transactions...</span>
          </motion.div>
        )}

        {!loading && error && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6">
            <div className="flex items-center gap-3 bg-red-900/40 border border-red-800 p-3 rounded">
              <ExclamationCircleIcon className="h-5 w-5 text-red-200" />
              <div className="text-sm text-red-200">{error}</div>
            </div>
            <div className="mt-3">
              <button onClick={onRefresh} className="px-3 py-2 rounded bg-white/5 text-white text-sm">Retry</button>
            </div>
          </motion.div>
        )}

        {!loading && !error && transactions.length === 0 && (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 flex flex-col items-center gap-3 text-gray-400">
            <InformationCircleIcon className="h-10 w-10 text-gray-500" />
            <div className="text-sm">No transactions yet. Click Add Transaction to create one.</div>
          </motion.div>
        )}

        {!loading && !error && transactions.length > 0 && (
          <motion.ul key="list" className="space-y-3">
            {transactions.map((t) => (
              <TransactionRow key={t._id} tx={t} onDeleted={onDeleted} />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </section>
  );
}
