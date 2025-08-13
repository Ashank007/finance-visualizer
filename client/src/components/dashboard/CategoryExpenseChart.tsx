"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { Transaction } from "../../types/Transaction";
import { useMemo } from "react";

const COLORS = ["#00E5FF", "#A259FF", "#10B981", "#F59E0B", "#EF4444", "#60A5FA"];

export default function CategoryExpenseChart({
  transactions,
  loading,
}: {
  transactions: Transaction[];
  loading: boolean;
}) {
  const data = useMemo(() => {
    const grouped: Record<string, number> = {};
    transactions.forEach((t) => {
      const cat = t.category || "Other";
      grouped[cat] = (grouped[cat] || 0) + t.amount;
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  if (loading) {
    return (
      <div className="bg-[#1A1A1A] p-5 rounded-2xl shadow-md border border-[#2a2a2a] flex items-center justify-center h-[320px]">
        <p className="text-gray-400">Loading categories…</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-[#1A1A1A] p-5 rounded-2xl shadow-md border border-[#2a2a2a] flex flex-col items-center justify-center h-[320px]">
        <p className="text-gray-400">No category data available.</p>
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-[#1A1A1A] p-5 rounded-2xl shadow-md border border-[#2a2a2a]">
      <h3 className="text-lg font-semibold mb-3">Category Breakdown</h3>
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div style={{ width: 260, height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip formatter={(v: number) => `₹${v.toFixed(2)}`} contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #2a2a2a" }} />
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1">
          <ul className="space-y-2">
            {data.map((d, i) => (
              <li key={d.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-gray-200">{d.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">₹{d.value.toFixed(2)}</div>
                  <div className="text-xs text-gray-400">{((d.value / total) * 100).toFixed(1)}%</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
