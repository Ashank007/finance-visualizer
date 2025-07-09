"use client";
import { useMemo } from "react";
import type { Transaction } from "../types/Transaction";

type DashboardSummaryProps = {
  transactions: Transaction[];
};

const categories = ["Food", "Transport", "Shopping", "Bills", "Health", "Other"];

export default function DashboardSummary({ transactions }: DashboardSummaryProps) {
  // Total expenses
  const totalExpenses = useMemo(() => {
    return transactions.reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  // Category-wise totals
  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    categories.forEach(cat => totals[cat] = 0);
    transactions.forEach(t => {
      const cat = t.category && categories.includes(t.category) ? t.category : "Other";
      totals[cat] += t.amount;
    });
    return totals;
  }, [transactions]);

  // Sort categories by amount desc
  const sortedCategories = useMemo(() => {
    return Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  }, [categoryTotals]);

  // Recent transactions (last 5)
  const recentTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  }, [transactions]);

  return (
    <section className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 max-w-6xl mx-auto mb-12">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Dashboard Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Total Expenses Card */}
        <div className="p-6 bg-blue-100 rounded-xl shadow flex flex-col items-center justify-center">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">Total Expenses</h3>
          <p className="text-4xl font-extrabold text-blue-900">₹{totalExpenses.toFixed(2)}</p>
        </div>

        {/* Category Breakdown Card */}
        <div className="p-6 bg-green-100 rounded-xl shadow">
          <h3 className="text-xl font-semibold text-green-700 mb-4">Category Breakdown</h3>
          <ul className="space-y-2 max-h-40 overflow-y-auto">
            {sortedCategories.map(([cat, amt]) => {
              const percent = totalExpenses > 0 ? (amt / totalExpenses) * 100 : 0;
              return (
                <li key={cat} className="flex justify-between text-green-900 font-medium">
                  <span>{cat}</span>
                  <span>
                    ₹{amt.toFixed(2)} ({percent.toFixed(1)}%)
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Recent Transactions Card */}
        <div className="p-6 bg-yellow-100 rounded-xl shadow">
          <h3 className="text-xl font-semibold text-yellow-700 mb-4">Recent Transactions</h3>
          <ul className="space-y-3 max-h-40 overflow-y-auto">
            {recentTransactions.length === 0 && <li className="text-yellow-800 font-medium">No transactions yet.</li>}
            {recentTransactions.map(t => (
              <li key={t._id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-yellow-900">{t.description || "No Description"}</p>
                  <p className="text-sm text-yellow-800">{new Date(t.date).toLocaleDateString("en-IN")}</p>
                </div>
                <p className="font-bold text-yellow-900">₹{t.amount.toFixed(2)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

