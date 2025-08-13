"use client";
import SummaryCards from "./SummaryCards";
import MonthlyReportChart from "./MonthlyReportChart";
import CategoryExpenseChart from "./CategoryExpenseChart";
import RecentTransactions from "./RecentTransaction";
import SectionHeader from "./SectionHeader";
import useTransactions from "../../hooks/useTransaction";

export default function DashboardContainer() {
  const { transactions, loading, error, refresh } = useTransactions();

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Finance Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Overview of your spending and categories</p>
        </header>

        {/* KPI row */}
        <SummaryCards transactions={transactions} loading={loading} />

        {/* Charts */}
        <SectionHeader title="Reports" subtitle="Monthly trends and category breakdowns" className="mt-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MonthlyReportChart transactions={transactions} loading={loading} />
          <CategoryExpenseChart transactions={transactions} loading={loading} />
        </div>

        {/* Recent transactions */}
        <SectionHeader
          title="Recent Transactions"
          subtitle="Quick view — click a row to edit"
          className="mt-8"
          onRefresh={refresh}
        />
        <RecentTransactions transactions={transactions} loading={loading} />
        {error && (
          <div className="mt-4 bg-red-700/20 border border-red-600 text-red-200 p-3 rounded">
            {error}
          </div>
        )}
      </div>
    </main>
  );
}
