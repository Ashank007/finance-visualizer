"use client";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { Transaction } from "../../types/Transaction";

export default function MonthlyReportChart({
  transactions,
  loading,
}: {
  transactions: Transaction[];
  loading: boolean;
}) {
  // group per month-year
  const chartData = useMemo(() => {
    const grouped: Record<string, number> = {};
    transactions.forEach((t) => {
      const d = new Date(t.date);
      // month label like 'Aug 2025'
      const label = d.toLocaleString("en-IN", { month: "short", year: "numeric" });
      grouped[label] = (grouped[label] || 0) + t.amount;
    });
    return Object.entries(grouped)
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  }, [transactions]);

  if (loading) {
    return (
      <div className="bg-[#1A1A1A] p-5 rounded-2xl shadow-md border border-[#2a2a2a] flex items-center justify-center h-[320px]">
        <p className="text-gray-400">Loading monthly chart…</p>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-[#1A1A1A] p-5 rounded-2xl shadow-md border border-[#2a2a2a] flex flex-col items-center justify-center h-[320px]">
        <p className="text-gray-400">No transactions to generate monthly chart.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] p-5 rounded-2xl shadow-md border border-[#2a2a2a]">
      <h3 className="text-lg font-semibold mb-3">Monthly Spending Overview</h3>
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
            <CartesianGrid stroke="#2a2a2a" vertical={false} />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" tickFormatter={(v) => `₹${v.toLocaleString()}`} />
            <Tooltip
              formatter={(value: number) => `₹${value.toFixed(2)}`}
              contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #2a2a2a" }}
            />
            <Bar dataKey="total" fill="#00E5FF" radius={[6, 6, 0, 0]} barSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
