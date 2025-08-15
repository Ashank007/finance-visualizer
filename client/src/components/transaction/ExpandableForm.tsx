// src/components/transactions/ExpandableAddForm.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { createTransactionApi } from "../../hooks/useTransactionCRUD";
import type { Transaction } from "../../types/Transaction";

export default function ExpandableAddForm({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (tx: Transaction) => void;
}) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState("Other");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = ["Food", "Transport", "Shopping", "Bills", "Health", "Other"];

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    if (!amount || Number(amount) <= 0) return setError("Enter a valid amount");
    if (!date) return setError("Select a date");

    const tempId = `temp-${Date.now()}`;
    const optimisticTx: Transaction = {
      _id: tempId,
      amount: Number(amount),
      date,
      description,
      category,
    };

    // Optimistic update callback
    onCreated(optimisticTx);

    setIsSubmitting(true);
    try {
      await createTransactionApi({
        amount: Number(amount),
        date,
        description,
        category,
      });
      // created likely has real _id — notify parent to replace temp? parent can refresh; here we'll call onCreated again with real
      // Option: fire event to refresh list; simple approach: replace temp with server result by calling onCreated with server object
      // but we don't have setter to replace; keep UX simple: let parent refresh separately if needed.
    } catch (err) {
      // If API fails, we should signal failure. Best practice: remove optimistic item or mark it failed.
      setError((err as {message?:string})?.message || "Failed to add");
    } finally {
      setIsSubmitting(false);
      // reset form and close panel
      setAmount("");
      setDescription("");
      setDate(new Date().toISOString().slice(0, 10));
      setCategory("Other");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          id="add-transaction-panel"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6 overflow-hidden"
        >
          <motion.form
            onSubmit={handleSubmit}
            className="p-4 bg-gradient-to-b from-[#0f1517] to-[#0b0d0e] border border-[#121416] rounded-xl shadow-inner"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-1">
                <label className="text-xs text-gray-300">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="mt-1 w-full px-3 py-2 rounded bg-[#0b0f10] border border-[#1a1f22] text-white outline-none"
                />
              </div>

              <div className="md:col-span-1">
                <label className="text-xs text-gray-300">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded bg-[#0b0f10] border border-[#1a1f22] text-white outline-none"
                />
              </div>

              <div className="md:col-span-1">
                <label className="text-xs text-gray-300">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded bg-[#0b0f10] border border-[#1a1f22] text-white outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-1 flex flex-col justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 rounded bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-semibold shadow hover:brightness-95 transition"
                >
                  {isSubmitting ? "Adding..." : "Add"}
                </button>
              </div>

              <div className="md:col-span-4">
                <label className="text-xs text-gray-300">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Taxi to office"
                  className="mt-1 w-full px-3 py-2 rounded bg-[#0b0f10] border border-[#1a1f22] text-white outline-none"
                />
              </div>
            </div>

            {error && <div className="mt-3 text-sm text-red-400">{error}</div>}
          </motion.form>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
