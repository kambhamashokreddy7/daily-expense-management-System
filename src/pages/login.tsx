import { useState } from "react";
import { useLocation } from "wouter";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import "./Login.css";
import DotField from "../components/DotField";

export default function Login() {
  const [, setLocation] = useLocation();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    try {
      setError("");
      setLoading(true);

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        })
      );

      setLocation("/");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      let result;

      if (isSignUp) {
        result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      } else {
        result = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      }

      const user = result.user;

      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        })
      );

      setLocation("/");
    } catch (err: any) {
      console.error(err);

      if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered.");
      } else if (err.code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else {
        setError(err.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Enter your email address first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setError("Password reset email sent. Check your inbox.");
    } catch (err: any) {
      setError(err.message || "Unable to send reset email.");
    }
  };

  return (
  <div className="login-page">
    <DotField />

      {/* LEFT SIDE */}
      <div className="login-left">

        <div className="left-content">

          <div className="brand">
            <div className="brand-icon">₹</div>
            <span>ExpenseFlow</span>
          </div>

          <div className="hero-text">
            <h1>
              Take Control of
              <span>Your Finances</span>
            </h1>

            <p>
              Daily Expense Management System helps you track
              expenses, set budgets, and achieve your financial goals.
            </p>
          </div>

          {/* Expense Card */}
          <div className="expense-card">

            <div className="expense-card-header">
              <div>
                <span>Monthly Overview</span>
                <strong>₹24,650</strong>
              </div>

              <div className="month">
                June 2025
                <span>⌄</span>
              </div>
            </div>

            <div className="growth">
              +12.5% <small>from last month</small>
            </div>

            <div className="chart">
              <svg
                viewBox="0 0 400 100"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 80
                     C25 65 30 75 55 55
                     C75 38 90 58 110 45
                     C130 30 145 48 165 40
                     C185 28 200 50 220 35
                     C245 18 260 45 280 28
                     C300 10 315 35 335 18
                     C355 8 370 20 400 0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                />

                <path
                  d="M0 80
                     C25 65 30 75 55 55
                     C75 38 90 58 110 45
                     C130 30 145 48 165 40
                     C185 28 200 50 220 35
                     C245 18 260 45 280 28
                     C300 10 315 35 335 18
                     C355 8 370 20 400 0
                     L400 100 L0 100 Z"
                  fill="currentColor"
                  opacity="0.08"
                />
              </svg>
            </div>

            <div className="categories">

              <h4>Top Categories</h4>

              <div className="category-row">
                <span>
                  <i className="dot blue"></i>
                  Food
                </span>
                <strong>₹8,650</strong>
              </div>

              <div className="category-row">
                <span>
                  <i className="dot purple"></i>
                  Transport
                </span>
                <strong>₹6,320</strong>
              </div>

              <div className="category-row">
                <span>
                  <i className="dot violet"></i>
                  Shopping
                </span>
                <strong>₹4,250</strong>
              </div>

              <div className="category-row">
                <span>
                  <i className="dot green"></i>
                  Others
                </span>
                <strong>₹5,430</strong>
              </div>

            </div>
          </div>

          {/* Features */}
          <div className="features">

            <div className="feature">
              <div className="feature-icon">✓</div>
              <div>
                <h3>Secure & Private</h3>
                <p>Your data is encrypted and safe</p>
              </div>
            </div>

            <div className="feature">
              <div className="feature-icon">◔</div>
              <div>
                <h3>Smart Analytics</h3>
                <p>Get insights into your spending</p>
              </div>
            </div>

            <div className="feature">
              <div className="feature-icon">◎</div>
              <div>
                <h3>Achieve Goals</h3>
                <p>Set budgets and save more</p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">

        <div className="language">
          🌐 English <span>⌄</span>
        </div>

        <div className="login-box">

          <div className="welcome">
            <h2>
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h2>

            <p>
              {isSignUp
                ? "Create your account to get started"
                : "Sign in to continue to your account"}
            </p>
          </div>

          {/* Tabs */}
          <div className="tabs">

            <button
              className={!isSignUp ? "active" : ""}
              onClick={() => {
                setIsSignUp(false);
                setError("");
              }}
            >
              Login
            </button>

            <button
              className={isSignUp ? "active" : ""}
              onClick={() => {
                setIsSignUp(true);
                setError("");
              }}
            >
              Sign Up
            </button>

          </div>

          <form onSubmit={handleEmailLogin}>

            {/* Email */}
            <div className="input-group">

              <span className="input-icon">✉</span>

              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

            </div>

            {/* Password */}
            <div className="input-group">

              <span className="input-icon">♙</span>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="password-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "◉" : "◌"}
              </button>

            </div>

            {/* Remember */}
            {!isSignUp && (
              <div className="login-options">

                <label>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(e.target.checked)
                    }
                  />

                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </button>

              </div>
            )}

            {/* Error */}
            {error && (
              <div className="login-message">
                {error}
              </div>
            )}

            {/* Login */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : isSignUp
                ? "Create Account"
                : "Login"}
            </button>

          </form>

          {/* Divider */}
          <div className="divider">
            <span></span>
            <p>or continue with</p>
            <span></span>
          </div>

          {/* Google */}
          <button
            className="google-button"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <span className="google-logo">G</span>
            Continue with Google
          </button>

          {/* Terms */}
          <div className="terms">
            🔒 By continuing, you agree to our
            <a href="#"> Terms of Service</a>
            {" "}and
            <a href="#"> Privacy Policy</a>
          </div>

        </div>
      </div>

    </div>
  );
}