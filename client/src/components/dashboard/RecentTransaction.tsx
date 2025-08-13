"use client";
import type { Transaction } from "../../types/Transaction";

export default function RecentTransactions({
  transactions,
  loading,
}: {
  transactions: Transaction[];
  loading: boolean;
}) {
  const recent = transactions
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  if (loading) {
    return (
      <div className="bg-[#1A1A1A] p-4 rounded-2xl border border-[#2a2a2a]">
        <p className="text-gray-400">Loading recent transactions…</p>
      </div>
    );
  }

  if (recent.length === 0) {
    return (
      <div className="bg-[#1A1A1A] p-4 rounded-2xl border border-[#2a2a2a]">
        <p className="text-gray-400">No transactions yet. Add your first one!</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] p-4 rounded-2xl border border-[#2a2a2a] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-gray-400 border-b border-[#2a2a2a]">
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Description</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((t) => (
              <tr key={t._id} className="border-b border-[#222] hover:bg-[#121212]">
                <td className="px-3 py-3 text-gray-300">{new Date(t.date).toLocaleDateString("en-IN")}</td>
                <td className="px-3 py-3 font-medium">{t.description || "No description"}</td>
                <td className="px-3 py-3 text-gray-400">{t.category}</td>
                <td className={`px-3 py-3 text-right ${t.amount < 0 ? "text-red-400" : "text-green-400"}`}>
                  ₹{t.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
