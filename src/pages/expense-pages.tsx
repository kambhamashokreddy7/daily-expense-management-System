import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Check,
  Download,
  IndianRupee,
  ListFilter,
  Search,
  Sparkles,
  TrendingDown,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  useExpenses,
  type ExpenseFormValues,
} from "@/hooks/use-expenses";

import {
  CATEGORIES,
  PAYMENT_METHODS,
  categoryColors,
  formatRupees,
  isThisMonth,
  todayInputValue,
  type Expense,
} from "@/lib/expense";

import { ExpenseShell } from "@/components/expense-shell";

import {
  CategoryIcon,
  EmptyState,
  ExpenseRow,
  PageHeading,
  SummaryCard,
} from "@/components/expense-ui";

/* =========================================================
   BUTTON
========================================================= */

function Button({
  children,
  className = "",
  type = "button",
  onClick,
  disabled,
  testId,
}: {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  testId?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      data-testid={testId}
    >
      {children}
    </button>
  );
}

/* =========================================================
   CHART TOOLTIP
========================================================= */

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-lg">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 font-mono text-sm font-bold text-primary">
        {formatRupees(payload[0].value)}
      </p>
    </div>
  );
}

/* =========================================================
   MONTHLY DATA
========================================================= */

function monthlyData(expenses: Expense[]) {
  const values = new Map<string, number>();

  expenses.forEach((expense) => {
    const key = expense.date.slice(0, 7);

    values.set(
      key,
      (values.get(key) ?? 0) + expense.amount
    );
  });

  return [...values.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, amount]) => ({
      name: new Date(`${key}-15T12:00:00`).toLocaleDateString(
        "en-IN",
        {
          month: "short",
        }
      ),
      amount,
    }));
}

/* =========================================================
   CATEGORY DATA
========================================================= */

function categoryData(expenses: Expense[]) {
  return CATEGORIES.map((category) => ({
    name: category,

    value: expenses
      .filter((e) => e.category === category)
      .reduce(
        (sum, e) => sum + e.amount,
        0
      ),

    color: categoryColors[category],
  })).filter((entry) => entry.value > 0);
}

/* =========================================================
   DASHBOARD / HOME
========================================================= */

function Dashboard() {
  const [, setLocation] = useLocation();

  const {
    expenses,
    ready,
    deleteExpense,
  } = useExpenses();

  const monthExpenses = useMemo(
    () =>
      expenses.filter((expense) =>
        isThisMonth(expense.date)
      ),
    [expenses]
  );

  const monthTotal = monthExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const monthly = useMemo(
    () => monthlyData(expenses),
    [expenses]
  );

  const byCategory = useMemo(
    () => categoryData(monthExpenses),
    [monthExpenses]
  );

  if (!ready) {
    return <LoadingPage />;
  }

  return (
    <ExpenseShell>

      {/* =================================================
          PAGE HEADING
      ================================================= */}

      <PageHeading
        eyebrow="Your daily money journal"
        title="Good Morning!"
        description="Here's your expense summary for today."
        action={
          <Button
            onClick={() =>
              setLocation("/add-expense")
            }
            className="bg-primary text-primary-foreground shadow-[0_6px_18px_rgba(40,47,70,0.18)]"
            testId="button-add-expense-header"
          >
            <span className="text-lg leading-none">
              +
            </span>

            Add Expense
          </Button>
        }
      />

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="mb-8 grid gap-4 md:grid-cols-3">

        <SummaryCard
          label="Total Income"
          value="₹0"
          note="This Month · informational"
          icon={ArrowUpRight}
          tone="green"
        />

        <SummaryCard
          label="Total Expenses"
          value={formatRupees(monthTotal)}
          note="This Month"
          icon={ArrowDownRight}
          tone="coral"
        />

        <SummaryCard
          label="Transactions"
          value={String(monthExpenses.length)}
          note="This Month"
          icon={TrendingDown}
          tone="purple"
        />

      </div>

      {/* =================================================
          CHARTS
      ================================================= */}

      <div className="grid gap-5 xl:grid-cols-[1.45fr_0.85fr]">

        {/* =================================================
            MONTHLY EXPENSE
        ================================================= */}

        <section className="rounded-2xl border border-border/75 bg-card/95 p-5 sm:p-6">

          <div className="mb-5 flex items-start justify-between">

            <div>

              <h2 className="font-serif text-xl font-bold text-primary">
                Monthly Expense Overview
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Only your recorded expenses, month by month.
              </p>

            </div>

            <span className="rounded-lg bg-secondary px-2.5 py-1.5 font-mono text-[10px] text-muted-foreground">
              Last 6 months
            </span>

          </div>

          {monthly.length ? (

            <ResponsiveContainer
              width="100%"
              height={260}
            >

              <BarChart
                data={monthly}
                barSize={28}
                margin={{
                  top: 10,
                  right: 4,
                  left: -20,
                  bottom: 0,
                }}
              >

                <CartesianGrid
                  vertical={false}
                  stroke="#e8e0d4"
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#8c867d",
                    fontSize: 11,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#8c867d",
                    fontSize: 10,
                  }}
                  tickFormatter={(value) =>
                    `₹${value}`
                  }
                />

                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{
                    fill: "#f4eedf",
                  }}
                />

                <Bar
                  dataKey="amount"
                  radius={[
                    7,
                    7,
                    2,
                    2,
                  ]}
                  fill="#e6a52d"
                />

              </BarChart>

            </ResponsiveContainer>

          ) : (

            <EmptyState
              title="No expense data yet"
              description="Add your first expense to see your monthly spending."
            />

          )}

        </section>

        {/* =================================================
            CATEGORY CHART
        ================================================= */}

        <section className="rounded-2xl border border-border/75 bg-card/95 p-5 sm:p-6">

          <div className="mb-5">

            <h2 className="font-serif text-xl font-bold text-primary">
              Expense by Category
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              This month at a glance.
            </p>

          </div>

          {byCategory.length ? (

            <>

              <div className="relative h-[190px]">

                <ResponsiveContainer>

                  <PieChart>

                    <Pie
                      data={byCategory}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={54}
                      outerRadius={78}
                      paddingAngle={3}
                      stroke="none"
                    >

                      {byCategory.map(
                        (entry) => (
                          <Cell
                            key={entry.name}
                            fill={entry.color}
                          />
                        )
                      )}

                    </Pie>

                    <Tooltip
                      content={
                        <ChartTooltip />
                      }
                    />

                  </PieChart>

                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">

                  <span className="font-mono text-xl font-bold text-primary">
                    {formatRupees(
                      monthTotal
                    )}
                  </span>

                  <span className="text-[10px] text-muted-foreground">
                    this month
                  </span>

                </div>

              </div>

              <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2">

                {byCategory
                  .slice(0, 6)
                  .map((entry) => (

                    <div
                      key={entry.name}
                      className="flex min-w-0 items-center gap-2 text-xs"
                    >

                      <span
                        className="size-2 rounded-full"
                        style={{
                          backgroundColor:
                            entry.color,
                        }}
                      />

                      <span className="truncate text-muted-foreground">
                        {entry.name}
                      </span>

                    </div>

                  ))}

              </div>

            </>

          ) : (

            <EmptyState
              title="No category data yet"
              description="Add an expense to start tracking your spending."
            />

          )}

        </section>

      </div>

      {/* =================================================
          RECENT TRANSACTIONS
      ================================================= */}

      <section className="mt-5 rounded-2xl border border-border/75 bg-card/95 p-5 sm:p-6">

        <div className="mb-3 flex items-center justify-between">

          <div>

            <h2 className="font-serif text-xl font-bold text-primary">
              Recent Transactions
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Your latest entries, kept close at hand.
            </p>

          </div>

          <Link
            href="/expenses"
            className="text-xs font-bold text-[#9b7216] hover:underline"
            data-testid="link-view-all"
          >
            View All →
          </Link>

        </div>

        {expenses.length ? (

          <div>

            <div className="hidden border-b border-border pb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:grid sm:grid-cols-[100px_1.2fr_1.6fr_120px_110px_80px] sm:gap-4">

              <span>Date</span>
              <span>Category</span>
              <span>Description</span>
              <span>Amount</span>
              <span>Payment</span>
              <span>Actions</span>

            </div>

            {expenses
              .slice(0, 5)
              .map((expense) => (

                <ExpenseRow
                  key={expense.id}
                  expense={expense}
                  onEdit={() =>
                    setLocation(
                      `/add-expense?edit=${expense.id}`
                    )
                  }
                  onDelete={deleteExpense}
                />

              ))}

          </div>

        ) : (

          <EmptyState
            title="No transactions yet"
            description="Your added expenses will appear here."
          />

        )}

      </section>

    </ExpenseShell>
  );
}

/* =========================================================
   LOADING PAGE
========================================================= */

function LoadingPage() {
  return (
    <ExpenseShell>

      <div className="animate-pulse space-y-5">

        <div className="h-14 w-2/3 rounded-xl bg-secondary" />

        <div className="grid gap-4 md:grid-cols-3">

          <div className="h-36 rounded-2xl bg-secondary" />

          <div className="h-36 rounded-2xl bg-secondary" />

          <div className="h-36 rounded-2xl bg-secondary" />

        </div>

        <div className="h-80 rounded-2xl bg-secondary" />

      </div>

    </ExpenseShell>
  );
}

/* =========================================================
   EXPENSE FORM
========================================================= */

function ExpenseForm({
  existing,
  onSaved,
}: {
  existing?: Expense;
  onSaved: () => void;
}) {
  const {
    addExpense,
    updateExpense,
  } = useExpenses();

  const [form, setForm] =
    useState<ExpenseFormValues>({
      amount: existing
        ? String(existing.amount)
        : "",

      category:
        existing?.category ??
        "Food & Drinks",

      description:
        existing?.description ?? "",

      date:
        existing?.date ??
        todayInputValue(),

      paymentMethod:
        existing?.paymentMethod ??
        "UPI",
    });

  const [error, setError] =
    useState("");

  const update = (
    key: keyof ExpenseFormValues,
    value: string
  ) =>
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

  function submit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    const amount = Number(
      form.amount
    );

    if (!amount || amount <= 0) {
      setError(
        "Enter an amount greater than zero."
      );
      return;
    }

    const data = {
      amount,
      category: form.category,
      description:
        form.description.trim(),
      date: form.date,
      paymentMethod:
        form.paymentMethod,
    };

    if (existing) {
      updateExpense(
        existing.id,
        data
      );
    } else {
      addExpense(data);
    }

    onSaved();
  }

  return (
    <form
      onSubmit={submit}
      className="max-w-2xl rounded-2xl border border-border/75 bg-card p-5 shadow-[0_8px_30px_rgba(58,48,33,0.04)] sm:p-8"
    >

      <div className="mb-7 flex items-center gap-3 border-b border-border/60 pb-6">

        <span className="grid size-11 place-items-center rounded-2xl bg-[#f1e6bf] text-primary">
          <IndianRupee size={21} />
        </span>

        <div>

          <h2 className="font-serif text-2xl font-bold text-primary">
            {existing
              ? "Edit expense"
              : "Add a new expense"}
          </h2>

          <p className="text-xs text-muted-foreground">
            A small note today makes tomorrow clearer.
          </p>

        </div>

      </div>

      <div className="grid gap-5 sm:grid-cols-2">

        <label className="sm:col-span-2">

          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
            Amount
          </span>

          <div className="flex items-center rounded-xl border border-input bg-background px-4 focus-within:ring-2 focus-within:ring-accent">

            <span className="font-mono text-lg text-muted-foreground">
              ₹
            </span>

            <input
              autoFocus
              inputMode="decimal"
              value={form.amount}
              onChange={(event) =>
                update(
                  "amount",
                  event.target.value
                )
              }
              placeholder="0.00"
              className="w-full bg-transparent px-3 py-3 font-mono text-lg font-bold outline-none"
              aria-label="Expense amount"
              data-testid="input-expense-amount"
            />

          </div>

        </label>

        <label>

          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
            Category
          </span>

          <select
            value={form.category}
            onChange={(event) =>
              update(
                "category",
                event.target.value
              )
            }
            className="w-full appearance-none rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent"
            aria-label="Expense category"
            data-testid="select-expense-category"
          >

            {CATEGORIES.map(
              (category) => (
                <option
                  key={category}
                >
                  {category}
                </option>
              )
            )}

          </select>

        </label>

        <label>

          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
            Date
          </span>

          <input
            type="date"
            value={form.date}
            onChange={(event) =>
              update(
                "date",
                event.target.value
              )
            }
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent"
            aria-label="Expense date"
            data-testid="input-expense-date"
          />

        </label>

        <label className="sm:col-span-2">

          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">

            Description{" "}

            <span className="font-normal normal-case tracking-normal">
              (optional)
            </span>

          </span>

          <input
            value={form.description}
            onChange={(event) =>
              update(
                "description",
                event.target.value
              )
            }
            placeholder="Enter expense description"
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent"
            aria-label="Expense description"
            data-testid="input-expense-description"
          />

        </label>

        <label>

          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
            Payment method
          </span>

          <select
            value={
              form.paymentMethod
            }
            onChange={(event) =>
              update(
                "paymentMethod",
                event.target.value
              )
            }
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent"
            aria-label="Payment method"
            data-testid="select-payment-method"
          >

            {PAYMENT_METHODS.map(
              (method) => (
                <option
                  key={method}
                >
                  {method}
                </option>
              )
            )}

          </select>

        </label>

      </div>

      {error && (

        <p
          className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
          role="alert"
          data-testid="status-form-error"
        >
          {error}
        </p>

      )}

      <div className="mt-8 flex justify-end gap-3">

        <Button
          onClick={onSaved}
          className="border border-border bg-background text-foreground"
          testId="button-cancel-expense"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          className="bg-primary text-primary-foreground"
          testId="button-save-expense"
        >
          <Check size={16} />

          {existing
            ? "Update Expense"
            : "Save Expense"}

        </Button>

      </div>

    </form>
  );
}

/* =========================================================
   ADD EXPENSE
========================================================= */

function AddExpense() {
  const [, setLocation] =
    useLocation();

  const params =
    new URLSearchParams(
      window.location.search
    );

  const editId =
    params.get("edit");

  const {
    expenses,
    ready,
  } = useExpenses();

  const existing =
    expenses.find(
      (expense) =>
        expense.id === editId
    );

  if (!ready) {
    return <LoadingPage />;
  }

  return (
    <ExpenseShell>

      <PageHeading
        eyebrow={
          existing
            ? "Make it right"
            : "New entry"
        }
        title={
          existing
            ? "Edit Expense"
            : "Add Expense"
        }
        description={
          existing
            ? "Update the details and keep your journal tidy."
            : "Capture the everyday spending that adds up."
        }
      />

      <ExpenseForm
        existing={existing}
        onSaved={() =>
          setLocation("/expenses")
        }
      />

    </ExpenseShell>
  );
}

/* =========================================================
   EXPENSES
========================================================= */

function Expenses() {
  const {
    expenses,
    ready,
    deleteExpense,
  } = useExpenses();

  const [, setLocation] =
    useLocation();

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All categories");

  const [payment, setPayment] =
    useState("All methods");

  const [date, setDate] =
    useState("");

  const [sort, setSort] =
    useState("date-desc");

  const filtered = useMemo(
    () =>
      expenses
        .filter((expense) => {

          const matchesSearch =
            `${expense.description} ${expense.category} ${expense.paymentMethod}`
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          return (
            matchesSearch &&
            (
              category ===
                "All categories" ||
              expense.category ===
                category
            ) &&
            (
              payment ===
                "All methods" ||
              expense.paymentMethod ===
                payment
            ) &&
            (!date ||
              expense.date === date)
          );
        })
        .sort((a, b) =>
          sort === "amount-desc"
            ? b.amount - a.amount
            : sort === "amount-asc"
            ? a.amount - b.amount
            : sort === "date-asc"
            ? a.date.localeCompare(
                b.date
              )
            : b.date.localeCompare(
                a.date
              )
        ),
    [
      expenses,
      search,
      category,
      payment,
      date,
      sort,
    ]
  );

  if (!ready) {
    return <LoadingPage />;
  }

  return (
    <ExpenseShell>

      <PageHeading
        eyebrow="Your full journal"
        title="View Expenses"
        description="Search, sort, and keep every entry within reach."
        action={
          <Button
            onClick={() =>
              setLocation(
                "/add-expense"
              )
            }
            className="bg-primary text-primary-foreground"
            testId="button-add-expense-page"
          >
            + Add Expense
          </Button>
        }
      />

      <section className="rounded-2xl border border-border/75 bg-card p-5 sm:p-6">

        <div className="mb-5 flex flex-col gap-3 lg:flex-row">

          <div className="relative flex-1">

            <Search
              size={17}
              className="absolute left-3.5 top-3.5 text-muted-foreground"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search descriptions, categories..."
              className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-accent"
              aria-label="Search expenses"
              data-testid="input-search-expenses"
            />

          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:flex">

            <select
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value
                )
              }
              className="rounded-xl border border-input bg-background px-3 py-3 text-xs outline-none"
              aria-label="Filter by category"
              data-testid="select-filter-category"
            >

              <option>
                All categories
              </option>

              {CATEGORIES.map(
                (item) => (
                  <option key={item}>
                    {item}
                  </option>
                )
              )}

            </select>

            <select
              value={payment}
              onChange={(event) =>
                setPayment(
                  event.target.value
                )
              }
              className="rounded-xl border border-input bg-background px-3 py-3 text-xs outline-none"
              aria-label="Filter by payment method"
              data-testid="select-filter-payment"
            >

              <option>
                All methods
              </option>

              {PAYMENT_METHODS.map(
                (item) => (
                  <option key={item}>
                    {item}
                  </option>
                )
              )}

            </select>

            <input
              type="date"
              value={date}
              onChange={(event) =>
                setDate(
                  event.target.value
                )
              }
              className="rounded-xl border border-input bg-background px-3 py-3 text-xs outline-none"
              aria-label="Filter by date"
              data-testid="input-filter-date"
            />

            <select
              value={sort}
              onChange={(event) =>
                setSort(
                  event.target.value
                )
              }
              className="rounded-xl border border-input bg-background px-3 py-3 text-xs outline-none"
              aria-label="Sort expenses"
              data-testid="select-sort-expenses"
            >

              <option value="date-desc">
                Newest first
              </option>

              <option value="date-asc">
                Oldest first
              </option>

              <option value="amount-desc">
                Highest amount
              </option>

              <option value="amount-asc">
                Lowest amount
              </option>

            </select>

          </div>

        </div>

        {filtered.length ? (

          <>

            <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">

              <ListFilter size={14} />

              Showing{" "}
              {filtered.length}{" "}
              of{" "}
              {expenses.length}{" "}
              entries

            </div>

            <div className="hidden border-b border-border pb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:grid sm:grid-cols-[100px_1.2fr_1.6fr_120px_110px_80px] sm:gap-4">

              <span>Date</span>
              <span>Category</span>
              <span>Description</span>
              <span>Amount</span>
              <span>Payment</span>
              <span>Actions</span>

            </div>

            {filtered.map(
              (expense) => (

                <ExpenseRow
                  key={expense.id}
                  expense={expense}
                  onEdit={() =>
                    setLocation(
                      `/add-expense?edit=${expense.id}`
                    )
                  }
                  onDelete={
                    deleteExpense
                  }
                />

              )
            )}

          </>

        ) : (

          <EmptyState
            title={
              expenses.length
                ? "No expenses match"
                : "No expenses found"
            }
            description={
              expenses.length
                ? "Try widening your filters or searching another phrase."
                : "Start by adding your first expense."
            }
            actionLabel={
              expenses.length
                ? "Clear filters"
                : "Add an expense"
            }
            href={
              expenses.length
                ? "/expenses"
                : "/add-expense"
            }
          />

        )}

      </section>

    </ExpenseShell>
  );
}

/* =========================================================
   CATEGORIES
========================================================= */

function Categories() {
  const {
    expenses,
    ready,
  } = useExpenses();

  if (!ready) {
    return <LoadingPage />;
  }

  return (
    <ExpenseShell>

      <PageHeading
        eyebrow="Your spending, sorted"
        title="Categories"
        description="Eight simple buckets to make patterns easier to spot."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {CATEGORIES.map(
          (category) => {

            const total =
              expenses
                .filter(
                  (expense) =>
                    expense.category ===
                    category
                )
                .reduce(
                  (sum, expense) =>
                    sum +
                    expense.amount,
                  0
                );

            const count =
              expenses.filter(
                (expense) =>
                  expense.category ===
                  category
              ).length;

            const categoryTotals =
              CATEGORIES.map(
                (cat) =>
                  expenses
                    .filter(
                      (e) =>
                        e.category ===
                        cat
                    )
                    .reduce(
                      (sum, e) =>
                        sum +
                        e.amount,
                      0
                    )
              );

            const maxTotal =
              Math.max(
                ...categoryTotals,
                1
              );

            return (
              <div
                key={category}
                className="group rounded-2xl border border-border/75 bg-card p-5 transition hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(58,48,33,0.07)]"
                data-testid={`card-category-${category
                  .toLowerCase()
                  .replaceAll(
                    " ",
                    "-"
                  )}`}
              >

                <div className="flex items-start justify-between">

                  <CategoryIcon
                    category={category}
                  />

                  <span className="font-mono text-[10px] text-muted-foreground">
                    {count}{" "}
                    {count === 1
                      ? "entry"
                      : "entries"}
                  </span>

                </div>

                <h2 className="mt-6 font-serif text-lg font-bold text-primary">
                  {category}
                </h2>

                <p
                  className="mt-2 font-mono text-2xl font-bold"
                  style={{
                    color:
                      categoryColors[
                        category
                      ],
                  }}
                >
                  {formatRupees(
                    total
                  )}
                </p>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary">

                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width:
                        expenses.length
                          ? `${Math.min(
                              100,
                              (total /
                                maxTotal) *
                                100
                            )}%`
                          : "0%",

                      backgroundColor:
                        categoryColors[
                          category
                        ],
                    }}
                  />

                </div>

              </div>
            );
          }
        )}

      </div>

    </ExpenseShell>
  );
}

/* =========================================================
   REPORTS
========================================================= */

function Reports() {
  const {
    expenses,
    ready,
  } = useExpenses();

  const monthly = useMemo(
    () => monthlyData(expenses),
    [expenses]
  );

  const byCategory = useMemo(
    () => categoryData(expenses),
    [expenses]
  );

  if (!ready) {
    return <LoadingPage />;
  }

  return (
    <ExpenseShell>

      <PageHeading
        eyebrow="Look back, learn forward"
        title="Reports"
        description="A clear view built entirely from what you've recorded."
        action={
          expenses.length ? (
            <Button
              onClick={() =>
                window.print()
              }
              className="border border-border bg-card text-primary"
              testId="button-print-report"
            >
              <Download size={15} />
              Print report
            </Button>
          ) : undefined
        }
      />

      {expenses.length ? (

        <>

          <div className="mb-5 grid gap-4 sm:grid-cols-3">

            <SummaryCard
              label="All-time expenses"
              value={formatRupees(
                expenses.reduce(
                  (sum, e) =>
                    sum + e.amount,
                  0
                )
              )}
              note="Across every entry"
              icon={ArrowDownRight}
              tone="coral"
            />

            <SummaryCard
              label="Categories used"
              value={String(
                byCategory.length
              )}
              note={`of ${CATEGORIES.length} categories`}
              icon={BarChart3}
              tone="purple"
            />

            <SummaryCard
              label="Transactions"
              value={String(
                expenses.length
              )}
              note="All recorded entries"
              icon={TrendingDown}
              tone="green"
            />

          </div>

          <div className="grid gap-5 xl:grid-cols-2">

            <section className="rounded-2xl border border-border/75 bg-card p-5 sm:p-6">

              <h2 className="font-serif text-xl font-bold text-primary">
                Monthly expenses
              </h2>

              <p className="mb-5 mt-1 text-xs text-muted-foreground">
                Your actual spending over time.
              </p>

              <ResponsiveContainer
                width="100%"
                height={280}
              >

                <BarChart
                  data={monthly}
                  barSize={32}
                  margin={{
                    left: -20,
                    right: 5,
                    top: 10,
                  }}
                >

                  <CartesianGrid
                    vertical={false}
                    stroke="#e8e0d4"
                  />

                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#8c867d",
                      fontSize: 11,
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#8c867d",
                      fontSize: 10,
                    }}
                  />

                  <Tooltip
                    content={
                      <ChartTooltip />
                    }
                  />

                  <Bar
                    dataKey="amount"
                    fill="#4c9b8a"
                    radius={[
                      7,
                      7,
                      2,
                      2,
                    ]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </section>

            <section className="rounded-2xl border border-border/75 bg-card p-5 sm:p-6">

              <h2 className="font-serif text-xl font-bold text-primary">
                Category expenses
              </h2>

              <p className="mb-5 mt-1 text-xs text-muted-foreground">
                Where your money has gone.
              </p>

              <div className="h-[280px]">

                <ResponsiveContainer>

                  <PieChart>

                    <Pie
                      data={byCategory}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      innerRadius={62}
                      outerRadius={100}
                      paddingAngle={3}
                      stroke="none"
                    >

                      {byCategory.map(
                        (entry) => (

                          <Cell
                            key={entry.name}
                            fill={entry.color}
                          />

                        )
                      )}

                    </Pie>

                    <Tooltip
                      content={
                        <ChartTooltip />
                      }
                    />

                    <Legend
                      iconType="circle"
                      wrapperStyle={{
                        fontSize:
                          "11px",
                      }}
                    />

                  </PieChart>

                </ResponsiveContainer>

              </div>

            </section>

          </div>

        </>

      ) : (

        <EmptyState
          title="No expense reports available yet."
          description="Add expenses to generate your report."
        />

      )}

    </ExpenseShell>
  );
}

/* =========================================================
   ABOUT
========================================================= */

function About() {
  const features = [
    "Add expenses",
    "Edit expenses",
    "Delete expenses",
    "Categorize expenses",
    "Track monthly spending",
    "View reports",
  ];

  return (
    <ExpenseShell>

      <div className="mx-auto max-w-4xl">

        <div className="relative overflow-hidden rounded-3xl bg-primary p-7 text-primary-foreground sm:p-12">

          <div className="absolute -right-10 -top-16 size-64 rounded-full border-[28px] border-accent/25" />

          <div className="absolute -bottom-24 right-28 size-52 rounded-full border-[18px] border-[#4c9b8a]/35" />

          <p className="relative mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
            A little project with a useful purpose
          </p>

          <h1 className="relative max-w-xl font-serif text-4xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-6xl">
            About Daily Expense Management System
          </h1>

          <p className="relative mt-6 max-w-2xl text-sm leading-7 text-primary-foreground/70">
            “This project is a simple web-based Daily Expense Management System designed to help users manually record, organize and monitor their daily expenses.”
          </p>

        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-[1fr_0.8fr]">

          <section className="rounded-2xl border border-border/75 bg-card p-6 sm:p-8">

            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              What it does
            </p>

            <h2 className="font-serif text-2xl font-bold text-primary">
              The essentials, without the noise.
            </h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">

              {features.map(
                (feature) => (

                  <div
                    key={feature}
                    className="flex items-center gap-3 rounded-xl bg-secondary/60 px-3 py-3 text-sm"
                  >

                    <span className="grid size-6 place-items-center rounded-full bg-[#e8f0e8] text-[#4a7650]">

                      <Check size={14} />

                    </span>

                    {feature}

                  </div>

                )
              )}

            </div>

          </section>

          <section className="flex flex-col justify-between rounded-2xl border border-border/75 bg-[#f1e6bf] p-6 sm:p-8">

            <div>

              <Sparkles
                className="text-[#9b7216]"
                size={24}
              />

              <h2 className="mt-5 font-serif text-2xl font-bold text-primary">
                Made for real days.
              </h2>

              <p className="mt-3 text-sm leading-6 text-primary/70">
                No accounts, no noise, no pretend numbers. Your journal lives locally in this browser, ready whenever you are.
              </p>

            </div>

            <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.15em] text-primary/55">
              Developed as a College Project
            </p>

          </section>

        </div>

      </div>

    </ExpenseShell>
  );
}

/* =========================================================
   EXPORTS
========================================================= */

export {
  Dashboard,
  AddExpense,
  Expenses,
  Categories,
  Reports,
  About,
};