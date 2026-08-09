import { type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import {
  Dashboard,
  AddExpense,
  Expenses,
  Categories,
  Reports,
  About,
} from "@/pages/expense-pages";
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
  Redirect,
} from "wouter";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: ReactNode }) {
  const isLoggedIn = !!localStorage.getItem("user");

  if (!isLoggedIn) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        {/* Login */}
        <Route path="/login" component={Login} />

        {/* Dashboard */}
        <Route path="/">
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </Route>

        {/* Other pages */}
        <Route path="/add-expense">
          <ProtectedRoute>
            <AddExpense />
          </ProtectedRoute>
        </Route>

        <Route path="/expenses">
          <ProtectedRoute>
            <Expenses />
          </ProtectedRoute>
        </Route>

        <Route path="/categories">
          <ProtectedRoute>
            <Categories />
          </ProtectedRoute>
        </Route>

        <Route path="/reports">
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        </Route>

        <Route path="/about">
          <ProtectedRoute>
            <About />
          </ProtectedRoute>
        </Route>

        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <ErrorBoundary resetKey={location}>
      {children}
    </ErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter
          base={import.meta.env.BASE_URL.replace(/\/$/, "")}
        >
          <Router />
        </WouterRouter>

        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
