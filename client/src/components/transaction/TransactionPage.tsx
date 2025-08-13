// src/pages/TransactionsPage.tsx
"use client";
import ActionBar from "./ActionBar";
import ExpandableAddForm from "./ExpandableForm";
import TransactionList from "./TransactionList";
import useTransactions from "../../hooks/useTransaction";
import { useState } from "react";

export default function TransactionsPage() {
  const { transactions, setTransactions, loading, error, refresh } = useTransactions();
  const [formOpen, setFormOpen] = useState(false);

  return (
    <main className="w-full min-h-[calc(100vh-4rem)] p-6 md:p-8">
      {/* Page header + action bar */}
      <ActionBar
        onAddClick={() => setFormOpen((s) => !s)}
        isFormOpen={formOpen}
        onRefresh={refresh}
      />

      {/* Expandable add form (slides down) */}
      <ExpandableAddForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onCreated={(newTx) => {
          // optimistic: prepend new tx to list
          setTransactions((prev) => [newTx, ...prev]);
        }}
      />

      {/* Transaction list */}
      <TransactionList
        transactions={transactions}
        loading={loading}
        error={error}
        onRefresh={refresh}
        onDeleted={() => {
          // after delete, refresh (or we could optimistically remove)
          refresh();
        }}
      />
    </main>
  );
}
