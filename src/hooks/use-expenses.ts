import { useCallback, useEffect, useMemo, useState } from "react";
import {
  type Expense,
  type Category,
  type PaymentMethod,
  readExpenses,
  STORAGE_KEY,
} from "@/lib/expense";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setExpenses(readExpenses());
    setReady(true);
  }, []);

  const persist = useCallback((next: Expense[]) => {
    setExpenses(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const addExpense = useCallback(
    (data: Omit<Expense, "id">) => {
      const expense = { ...data, id: crypto.randomUUID() };
      persist([expense, ...expenses]);
      return expense;
    },
    [expenses, persist],
  );

  const updateExpense = useCallback(
    (id: string, data: Omit<Expense, "id">) => {
      persist(expenses.map((expense) => (expense.id === id ? { ...data, id } : expense)));
    },
    [expenses, persist],
  );

  const deleteExpense = useCallback(
    (id: string) => persist(expenses.filter((expense) => expense.id !== id)),
    [expenses, persist],
  );

  const total = useMemo(() => expenses.reduce((sum, expense) => sum + expense.amount, 0), [expenses]);

  return { expenses, ready, addExpense, updateExpense, deleteExpense, total };
}

export type ExpenseFormValues = {
  amount: string;
  category: Category;
  description: string;
  date: string;
  paymentMethod: PaymentMethod;
};