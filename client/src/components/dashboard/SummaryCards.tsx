"use client";
import { useMemo } from "react";
import type { Transaction } from "../../types/Transaction";

export default function SummaryCards({
  transactions,
  loading,
}: {
  transactions: Transaction[];
  loading: boolean;
}) {
console.log(loading);
  const totalExpenses = useMemo(() => {
    // Sum of negative amounts (expenses) or all amounts if amounts are positive-only
    // You used positive amounts earlier; adapt logic to your data shape:
    return transactions.reduce((s, t) => s + t.amount, 0);
  }, [transactions]);

  const totalTransactions = transactions.length;

  const categoryTotals = useMemo(() => {
    const map = new Map<string, number>();
    transactions.forEach((t) => {
      const cat = t.category || "Other";
      map.set(cat, (map.get(cat) || 0) + t.amount);
    });
    // sort entries by amount desc and return top category
    const top = [...map.entries()].sort((a, b) => b[1] - a[1])[0];
    return { map, topCategory: top ? { name: top[0], value: top[1] } : null };
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div className="bg-[#1A1A1A] p-5 rounded-2xl shadow-md border border-[#2a2a2a]">
        <p className="text-sm text-gray-300">Total Expenses</p>
        <div className="flex items-baseline gap-3 mt-2">
          <p className="text-2xl md:text-3xl font-bold">₹{totalExpenses.toFixed(2)}</p>
          <span className="text-sm text-gray-400">• {totalTransactions} txns</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">Current month</p>
      </div>

      <div className="bg-[#1A1A1A] p-5 rounded-2xl shadow-md border border-[#2a2a2a]">
        <p className="text-sm text-gray-300">Top Category</p>
        <div className="mt-2">
          {categoryTotals.topCategory ? (
            <>
              <p className="text-xl font-semibold">{categoryTotals.topCategory.name}</p>
              <p className="text-sm text-gray-400 mt-1">₹{categoryTotals.topCategory.value.toFixed(2)}</p>
            </>
          ) : (
            <p className="text-gray-500">No data</p>
          )}
        </div>
      </div>

      <div className="bg-[#1A1A1A] p-5 rounded-2xl shadow-md border border-[#2a2a2a]">
        <p className="text-sm text-gray-300">Actions</p>
        <div className="flex gap-3 mt-3">
          <button className="px-4 py-2 rounded-md bg-cyan-500 text-black font-semibold hover:brightness-110">
            Quick Add
          </button>
          <button className="px-4 py-2 rounded-md border border-gray-700 text-gray-200 hover:bg-[#252525]">
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}
