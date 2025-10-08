"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen max-h-screen bg-black text-white overflow-hidden flex items-center justify-center p-8">
      <div className="text-center space-y-12">
        {/* Branding */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-7xl font-black tracking-tighter">SAVE DROPS</h1>
            <div className="w-24 h-1 bg-white mx-auto"></div>
          </div>
          <p className="text-gray-400 text-lg font-light uppercase tracking-widest">
            Digital Preservation
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {user ? (
            <Link
              href="/dashboard"
              className="inline-block px-12 py-4 bg-white text-black font-bold text-lg hover:bg-gray-200 transition-colors duration-200"
            >
              CONTINUE
            </Link>
          ) : (
            <div className="space-y-3">
              <Link
                href="/login"
                className="block px-12 py-4 bg-white text-black font-bold text-lg hover:bg-gray-200 transition-colors duration-200"
              >
                SIGN IN
              </Link>
              <Link
                href="/signup"
                className="block px-12 py-4 border border-white text-white font-bold text-lg hover:bg-white hover:text-black transition-all duration-200"
              >
                GET STARTED
              </Link>
            </div>
          )}
        </div>

        {/* Status */}
        <p className="text-gray-500 text-sm font-mono">
          {user ? `ACTIVE SESSION: ${user.email}` : "READY FOR ACTION"}
        </p>
      </div>
    </main>
  );
}
