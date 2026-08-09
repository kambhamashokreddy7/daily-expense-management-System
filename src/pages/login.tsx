import { useLocation } from "wouter";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

export default function Login() {
  const [, setLocation] = useLocation();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const user = result.user;

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
        })
      );

      setLocation("/");
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg text-center">

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Daily Expense Management System
        </h1>

        <p className="text-gray-500 text-lg mb-10">
          Manage your money smarter
        </p>

        <button
          onClick={handleGoogleLogin}
          className="w-full h-14 border border-gray-300 rounded-xl bg-white
                     shadow-sm flex items-center justify-center gap-3
                     text-gray-800 font-semibold text-lg hover:bg-gray-50"
        >
          <span className="text-xl font-bold">G</span>
          Continue with Google
        </button>

        <p className="mt-8 text-sm text-gray-400">
          By continuing, you agree to our Terms and Privacy Policy
        </p>

      </div>
    </div>
  );
}
