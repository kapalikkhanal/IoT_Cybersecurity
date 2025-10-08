"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "../lib/firebase";
import { auth } from "../lib/firebase";
import Link from "next/link";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: input email, 2: success

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Use auth as first parameter for sendPasswordResetEmail
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "Password reset email sent! Check your inbox for further instructions."
      );
      setStep(2);
    } catch (error) {
      console.error("Password reset error:", error);
      // User-friendly error messages
      switch (error.code) {
        case "auth/user-not-found":
          setError("No account found with this email address.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Please try again later.");
          break;
        default:
          setError(
            error.message || "Failed to send reset email. Please try again."
          );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetAnother = () => {
    setStep(1);
    setEmail("");
    setMessage(null);
    setError(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      {step === 1 ? (
        <>
          <form onSubmit={handleReset} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center space-x-2 text-red-700">
                <span>⚠️</span>
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              What to expect:
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Check your email inbox for a reset link</li>
              <li>• The link will expire in 1 hour</li>
              <li>• If you don&apos;t see it, check your spam folder</li>
            </ul>
          </div>
        </>
      ) : (
        // Success State
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">✅</span>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Check Your Email
            </h3>
            <p className="text-gray-600 mb-4">
              We&apos;ve sent a password reset link to:
              <br />
              <span className="font-medium text-gray-900">{email}</span>
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-xl">
            <p className="text-sm text-green-700">
              <strong>Next steps:</strong> Click the link in the email to create
              a new password.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleResetAnother}
              className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Reset Another Email
            </button>
            <Link
              href="/login"
              className="block w-full py-3 px-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium text-center"
            >
              Back to Login
            </Link>
          </div>

          <div className="text-xs text-gray-500">
            Didn&apos;t receive the email?{" "}
            <button
              onClick={() => setStep(1)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Try again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordReset;
