import {
  Bell,
  CircleHelp,
  ClipboardList,
  FolderOpen,
  LayoutDashboard,
  Menu,
  Plus,
  Tags,
  X,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, type ReactNode } from "react";
import { getInitial, logout } from "../auth/auth";
import DotField from "./DotField";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/add-expense", label: "Add Expense", icon: Plus },
  { href: "/expenses", label: "View Expenses", icon: ClipboardList },
  { href: "/categories", label: "Categories", icon: Tags },
  { href: "/reports", label: "Reports", icon: FolderOpen },
  { href: "/about", label: "About", icon: CircleHelp },
];

export function ExpenseShell({
  children,
}: {
  children: ReactNode;
}) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  let user: {
    name?: string;
    email?: string;
    photo?: string | null;
  } = {};

  try {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch {
    localStorage.removeItem("user");
  }

  const initial = getInitial(user.email || "");

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* ========================================================= */}
      {/* DOT FIELD BACKGROUND                                      */}
      {/* ========================================================= */}

      <div
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: 10,
        }}
      >
        <DotField />
      </div>

      {/* ========================================================= */}
      {/* SIDEBAR                                                   */}
      {/* ========================================================= */}

      <aside
        className={
          "fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col " +
          "bg-sidebar px-5 py-6 text-sidebar-foreground " +
          "transition-transform duration-300 lg:translate-x-0 " +
          (open ? "translate-x-0" : "-translate-x-full")
        }
      >
        {/* Logo */}
        <div className="mb-8 flex items-start justify-between px-3">
          <div>
            <h2 className="text-lg font-bold leading-tight">
              Daily Expense
            </h2>

            <p className="text-sm text-sidebar-foreground/60">
              Management System
            </p>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-1 text-sidebar-foreground/70 hover:bg-sidebar-accent lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Workspace */}
        <div className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
          Workspace
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/"
                ? location === "/"
                : location.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={
                  "group flex items-center gap-3 rounded-xl px-3 py-3 " +
                  "text-sm font-medium transition-all " +
                  (active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground " +
                      "shadow-[0_6px_18px_rgba(230,165,45,0.18)]"
                    : "text-sidebar-foreground/65 hover:bg-sidebar-accent " +
                      "hover:text-sidebar-accent-foreground")
                }
              >
                <Icon
                  size={18}
                  strokeWidth={active ? 2.4 : 1.9}
                />

                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="mt-auto border-t border-sidebar-border/50 pt-5">
          <p className="text-xs leading-relaxed text-sidebar-foreground/45">
            A calmer way to track the little things.
          </p>

          <p className="mt-2 text-xs text-sidebar-foreground/35">
            Your entries stay in this browser.
          </p>

          <p className="mt-5 text-[11px] text-sidebar-foreground/30">
            © 2026 Daily Expense
          </p>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MOBILE OVERLAY                                            */}
      {/* ========================================================= */}

      {open && (
        <button
          className="fixed inset-0 z-30 bg-primary/35 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close navigation"
        />
      )}

      {/* ========================================================= */}
      {/* MAIN CONTENT                                              */}
      {/* ========================================================= */}

      <div className="relative z-20 lg:pl-[260px]">

        {/* ======================================================= */}
        {/* HEADER                                                  */}
        {/* ======================================================= */}

        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-border/70 bg-background/75 px-5 backdrop-blur-md sm:px-8 lg:px-12">

          {/* Mobile Menu */}
          <button
            className="rounded-xl border border-border bg-card/90 p-2.5 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={19} />
          </button>

          {/* Status */}
          <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <span className="size-2 rounded-full bg-[#6fa36b]" />

            Local journal · changes saved automatically
          </div>

          {/* Right Header */}
          <div className="ml-auto flex items-center gap-2.5">

            {/* Notification */}
            <button
              className="relative rounded-xl border border-border bg-card/90 p-2.5 text-muted-foreground transition hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell size={18} />

              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-accent" />
            </button>

            {/* Profile */}
            <div className="relative">

              <button
                onClick={() =>
                  setProfileOpen(!profileOpen)
                }
                className="grid size-9 place-items-center rounded-xl bg-[#e8dfc8] text-xs font-bold text-primary transition hover:opacity-80"
                aria-label="Open profile"
              >
                {initial}
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-12 z-50 w-44 rounded-xl border border-border bg-card p-2 shadow-lg">

                  <Link
                    href="/profile"
                    onClick={() =>
                      setProfileOpen(false)
                    }
                    className="block rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>

                </div>
              )}

            </div>
          </div>
        </header>

        {/* ======================================================= */}
        {/* PAGE CONTENT                                             */}
        {/* ======================================================= */}

        <main className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
          {children}
        </main>

      </div>
    </div>
  );
}