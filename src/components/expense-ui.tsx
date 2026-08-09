import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bus,
  Check,
  ChevronDown,
  Clapperboard,
  Ellipsis,
  GraduationCap,
  HeartPulse,
  MoreHorizontal,
  Pencil,
  ReceiptText,
  Search,
  ShoppingBag,
  Trash2,
  TrendingDown,
  Utensils,
} from "lucide-react";
import type { Expense, Category } from "@/lib/expense";
import { categoryColors, categoryIcons, formatRupees, prettyDate } from "@/lib/expense";
import { Link } from "wouter";
import { useState } from "react";
import type { ReactNode } from "react";

const iconMap = { Utensils, Bus, ShoppingBag, ReceiptText, GraduationCap, Clapperboard, HeartPulse, Ellipsis };

export function PageHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
    <div>{eyebrow && <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{eyebrow}</p>}<h1 className="font-serif text-4xl font-bold tracking-[-0.04em] text-primary sm:text-5xl">{title}</h1>{description && <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>}</div>
    {action}
  </div>;
}

export function EmptyState({ title, description, actionLabel = "Add an expense", href = "/add-expense", icon: Icon = BarChart3 }: { title: string; description: string; actionLabel?: string; href?: string; icon?: typeof BarChart3 }) {
  return <div className="flex min-h-[230px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 px-6 text-center">
    <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-[#f1e6bf] text-primary"><Icon size={21} /></div>
    <h3 className="font-serif text-xl font-bold text-primary">{title}</h3><p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
    <Link href={href} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground transition hover:-translate-y-0.5" data-testid="link-empty-action"><span>+</span>{actionLabel}</Link>
  </div>;
}

export function SummaryCard({ label, value, note, icon: Icon, tone }: { label: string; value: string; note: string; icon: typeof TrendingDown; tone: "green" | "coral" | "purple" }) {
  const styles = { green: "bg-[#e8f0e8] text-[#4a7650]", coral: "bg-[#f7e7df] text-[#b65f4b]", purple: "bg-[#e8e4f0] text-[#716295]" };
  return <div className="rounded-2xl border border-border/75 bg-card p-5 shadow-[0_5px_18px_rgba(58,48,33,0.035)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(58,48,33,0.07)]"><div className="flex items-start justify-between"><p className="text-sm font-medium text-muted-foreground">{label}</p><span className={`grid size-9 place-items-center rounded-xl ${styles[tone]}`}><Icon size={17} /></span></div><p className="mt-6 font-mono text-2xl font-bold tracking-tight text-primary">{value}</p><p className="mt-1 text-xs text-muted-foreground">{note}</p></div>;
}

export function ExpenseRow({ expense, onEdit, onDelete }: { expense: Expense; onEdit: (expense: Expense) => void; onDelete: (id: string) => void }) {
  const Icon = iconMap[categoryIcons[expense.category] as keyof typeof iconMap] ?? MoreHorizontal;
  const [confirm, setConfirm] = useState(false);
  return <div className="group grid grid-cols-[1fr_auto] gap-3 border-b border-border/60 py-4 last:border-0 sm:grid-cols-[100px_1.2fr_1.6fr_120px_110px_80px] sm:items-center sm:gap-4" data-testid={`row-expense-${expense.id}`}>
    <span className="text-xs text-muted-foreground">{prettyDate(expense.date)}</span>
    <span className="flex items-center gap-2 text-sm font-medium"><span className="grid size-8 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: `${categoryColors[expense.category]}22`, color: categoryColors[expense.category] }}><Icon size={15} /></span><span className="truncate">{expense.category}</span></span>
    <span className="hidden truncate text-sm text-muted-foreground sm:block">{expense.description || "Untitled expense"}</span>
    <span className="text-right font-mono text-sm font-bold text-primary sm:text-left">{formatRupees(expense.amount)}</span>
    <span className="hidden text-xs text-muted-foreground sm:block">{expense.paymentMethod}</span>
    <span className="col-span-2 flex justify-end gap-1 sm:col-span-1 sm:justify-start">
      <button onClick={() => onEdit(expense)} className="rounded-lg p-2 text-muted-foreground transition hover:bg-secondary hover:text-primary" aria-label={`Edit ${expense.description}`} data-testid={`button-edit-${expense.id}`}><Pencil size={15} /></button>
      {confirm ? <button onClick={() => onDelete(expense.id)} className="rounded-lg bg-destructive/10 px-2 text-[10px] font-bold text-destructive" data-testid={`button-confirm-delete-${expense.id}`}>Confirm</button> : <button onClick={() => setConfirm(true)} className="rounded-lg p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive" aria-label={`Delete ${expense.description}`} data-testid={`button-delete-${expense.id}`}><Trash2 size={15} /></button>}
    </span>
  </div>;
}

export function CategoryIcon({ category, size = 18 }: { category: Category; size?: number }) {
  const Icon = iconMap[categoryIcons[category] as keyof typeof iconMap] ?? MoreHorizontal;
  return <span className="grid size-10 place-items-center rounded-xl" style={{ backgroundColor: `${categoryColors[category]}20`, color: categoryColors[category] }}><Icon size={size} /></span>;
}