import { useState } from "react";
import { useLocation } from "wouter";

import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import "./login.css";
import Lightfall from "../components/Lightfall";

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

    {/* FULL SCREEN LIGHTFALL */}
    <div className="login-background">
      <Lightfall
        colors={["#2875FF", "#5227FF", "#A6C8FF", "#FF9FFC"]}
        backgroundColor="#061C45"
        speed={0.5}
        streakCount={4}
        streakWidth={1}
        streakLength={1}
        glow={1}
        density={0.6}
        twinkle={1}
        zoom={3}
        backgroundGlow={0.5}
        opacity={1}
        mouseInteraction={true}
      />
    </div>

    {/* CENTER LOGIN */}
    <div className="login-center">

      <div className="login-card">

        <div className="language">
          🌐 English <span>⌄</span>
        </div>

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

        {/* Form */}
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