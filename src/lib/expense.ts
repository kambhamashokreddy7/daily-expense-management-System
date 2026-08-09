export const STORAGE_KEY = "expenses";

export const CATEGORIES = [
  "Food & Drinks",
  "Transport",
  "Shopping",
  "Bills",
  "Education",
  "Entertainment",
  "Health",
  "Other",
] as const;

export const PAYMENT_METHODS = ["Cash", "UPI", "Card", "Other"] as const;

export type Category = (typeof CATEGORIES)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export type Expense = {
  id: string;
  amount: number;
  category: Category;
  description: string;
  date: string;
  paymentMethod: PaymentMethod;
};

export const categoryColors: Record<Category, string> = {
  "Food & Drinks": "#e6a52d",
  Transport: "#4c9b8a",
  Shopping: "#d57a65",
  Bills: "#7e71b4",
  Education: "#4b8fb8",
  Entertainment: "#bd6793",
  Health: "#6fa36b",
  Other: "#8d867a",
};

export const categoryIcons: Record<Category, string> = {
  "Food & Drinks": "Utensils",
  Transport: "Bus",
  Shopping: "ShoppingBag",
  Bills: "ReceiptText",
  Education: "GraduationCap",
  Entertainment: "Clapperboard",
  Health: "HeartPulse",
  Other: "Ellipsis",
};

export function readExpenses(): Expense[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is Expense =>
        item &&
        typeof item.id === "string" &&
        typeof item.amount === "number" &&
        typeof item.category === "string" &&
        CATEGORIES.includes(item.category) &&
        typeof item.description === "string" &&
        typeof item.date === "string" &&
        typeof item.paymentMethod === "string" &&
        PAYMENT_METHODS.includes(item.paymentMethod),
    );
  } catch {
    return [];
  }
}

export function formatRupees(amount: number) {
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export function todayInputValue() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export function isThisMonth(date: string) {
  const now = new Date();
  const value = new Date(`${date}T12:00:00`);
  return value.getMonth() === now.getMonth() && value.getFullYear() === now.getFullYear();
}

export function prettyDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}