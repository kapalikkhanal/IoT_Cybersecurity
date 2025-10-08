"use client";

import { useAuth } from "../contexts/AuthContext";
import Link from "next/link";
import SignOutButton from "./SignOutButton";
import { useState } from "react";

const NavBar = () => {
  const authContext = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fallback for undefined context
  if (!authContext) {
    return null;
  }

  const { user } = authContext;

  return (
    <nav className="bg-white backdrop-blur-lg border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-xl uppercase text-black font-extrabold">
              SaveDrops
            </span>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <>
              <div className="hidden md:flex items-center space-x-1">
                <NavLink href="/dashboard">Dashboard</NavLink>
                <NavLink href="/profile">Profile</NavLink>
                <NavLink href="/settings">Settings</NavLink>
              </div>

              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-600 hidden lg:block">
                    <p className="uppercase font-bold">{user.displayName || name || "Hi User"},</p>
                    <p>{user.email}</p>
                  </span>
                </div>
                <div className="w-px h-6 bg-gray-200"></div>
                <SignOutButton />
              </div>
            </>
          )}

          {/* Mobile menu button */}
          {user && (
            <div className="md:hidden flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                  <span
                    className={`block h-0.5 w-6 bg-gray-600 transition-all ${
                      isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                    }`}
                  ></span>
                  <span
                    className={`block h-0.5 w-6 bg-gray-600 transition-all ${
                      isMobileMenuOpen ? "opacity-0" : ""
                    }`}
                  ></span>
                  <span
                    className={`block h-0.5 w-6 bg-gray-600 transition-all ${
                      isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                    }`}
                  ></span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {user && isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-3">
              <MobileNavLink
                href="/dashboard"
                icon="📊"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </MobileNavLink>
              <MobileNavLink
                href="/profile"
                icon="👤"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </MobileNavLink>
              <MobileNavLink
                href="/settings"
                icon="⚙️"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Settings
              </MobileNavLink>
              <div className="pt-3 mt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{user.email}</span>
                  <SignOutButton />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Desktop NavLink Component
const NavLink = ({ href, icon, children }) => (
  <Link
    href={href}
    className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 group font-medium"
  >
    <span className="text-lg">{icon}</span>
    <span>{children}</span>
  </Link>
);

// Mobile NavLink Component
const MobileNavLink = ({ href, icon, children, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium"
  >
    <span className="text-xl">{icon}</span>
    <span>{children}</span>
  </Link>
);

export default NavBar;
