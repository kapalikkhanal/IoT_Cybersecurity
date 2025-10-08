"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, auth } from "../lib/firebase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center ">
      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-6 p-8 w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-100"
      >
        <h1 className="text-2xl font-semibold text-gray-800 text-center">
          Login
        </h1>
        <p className="text-gray-500 text-center text-sm mb-2">
          Sign in to continue to your dashboard
        </p>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full text-black p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full text-black p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 p-3 rounded-lg text-white font-medium bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        {error && (
          <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        <p className="text-center text-gray-500 text-sm mt-4">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign up
          </a>
        </p>
      </motion.form>
    </div>
  );
};

export default Login;
