"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { Transaction } from "../types/Transaction";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

const COLORS = ["#4F46E5", "#EC4899", "#22C55E", "#F97316", "#06B6D4", "#A855F7"];

const CATEGORY_LABELS: Record<string, string> = {
  Food: "Food",
  Transport: "Transport",
  Shopping: "Shopping",
  Bills: "Bills",
  Health: "Health",
  Other: "Other",
};

export default function CategoryPieChart({ transactions }: { transactions: Transaction[] }) {
  const grouped = transactions.reduce((acc, t) => {
    const category = t.category || "Other";
    acc[category] = (acc[category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(grouped).map(([category, total]) => ({
    name: CATEGORY_LABELS[category] || category,
    value: total,
  }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center text-gray-600 h-64 flex-col">
        <ExclamationCircleIcon className="h-10 w-10 mb-2" />
        <p className="text-sm">No data available to display.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Tooltip />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={110}
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

