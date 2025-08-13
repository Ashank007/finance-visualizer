// src/hooks/useTransactionCRUD.ts
"use client";
import type { Transaction } from "../types/Transaction";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function createTransactionApi(payload: {
  amount: number;
  date: string;
  description: string;
  category: string;
}) {
  const res = await fetch(`${API_BASE_URL}/api/transactions`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const created: Transaction = await res.json();
  return created;
}

export async function deleteTransactionApi(id: string) {
  const res = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return true;
}
