"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import { getCurrentUser, signOut } from "@/app/lib/auth/actions";
import lightLogo from "../../public/Light.svg";
import darkLogo from "../../public/Dark.svg";
import Sun from "./icons/Sun";
import Moon from "./icons/Moon";
import Hamburger from "./icons/Hamburger";
import MobileMenu from "./MobileMenu";

// Type for user data
type User = {
  id: string;
  email: string;
  name?: string;
  emailVerified: boolean;
} | null;

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isDark = theme === "dark";

  // Load user data on component mount and listen for auth changes
  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error loading user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();

    // Listen for storage events to refresh user state when auth changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth-session' || e.key === null) {
        loadUser();
      }
    };

    // Listen for custom auth events
    const handleAuthChange = () => {
      loadUser();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  // Handle user logout
  const handleSignOut = async () => {
    try {
      // Clear user state immediately for instant UI feedback
      setUser(null);
      
      // Trigger auth change event
      window.dispatchEvent(new CustomEvent('auth-change'));
      
      await signOut();
      // signOut redirects, so this won't be reached
    } catch (error) {
      console.error("Sign out error:", error);
      // Reload user state if sign out failed
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    }
  };
  const menuItemsStyle = `transition-colors hover:text-[var(--vivid-orange)] ${
    isDark ? "text-white" : "text-black"
  }`;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`relative z-50 flex items-center justify-between px-6 py-4 shadow transition-colors duration-300 ${
          isDark ? "bg-black" : "bg-white"
        }`}
      >
        <div>
          <Image
            src={isDark ? darkLogo : lightLogo}
            alt="kwikfluency"
            className="h-10 w-auto"
          />
        </div>

        <ul className="hidden md:flex gap-10">
          <li>
            <Link href="#" className={menuItemsStyle}>
              Home
            </Link>
          </li>
          <li>
            <Link href="#" className={menuItemsStyle}>
              Pricing
            </Link>
          </li>
          <li>
            <Link href="#" className={menuItemsStyle}>
              Features
            </Link>
          </li>
        </ul>

        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {isDark ? <Sun /> : <Moon />}
          </button>

          {/* Authentication UI */}
          {isLoading ? (
            <div className="w-8 h-8 border-2 border-gray-300 border-t-[var(--vivid-orange)] rounded-full animate-spin"></div>
          ) : user ? (
            /* Authenticated User Menu */
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isDark
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                  style={{ backgroundColor: "var(--vivid-orange)" }}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium">{user.name || user.email.split("@")[0]}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {userMenuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-50 ${
                    isDark
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="p-2">
                    <Link
                      href="/dashboard"
                      className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                        isDark ? "hover:bg-gray-700 text-white" : "hover:bg-gray-100 text-gray-900"
                      }`}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleSignOut();
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                        isDark ? "hover:bg-gray-700 text-red-400" : "hover:bg-gray-100 text-red-600"
                      }`}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Unauthenticated User Buttons */
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isDark
                    ? "text-white hover:bg-gray-800"
                    : "text-gray-900 hover:bg-gray-100"
                }`}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-[var(--vivid-orange)] hover:bg-[rgba(255,92,0,0.9)] rounded-lg transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
              isDark
                ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {isDark ? <Sun /> : <Moon />}
          </button>

          <Hamburger isOpen={isMenuOpen} onClick={toggleMenu} isDark={isDark} />
        </div>
      </nav>

      <MobileMenu
        isOpen={isMenuOpen}
        isDark={isDark}
        menuItemsStyle={menuItemsStyle}
        closeMenu={closeMenu}
        user={user}
        isLoading={isLoading}
        onSignOut={handleSignOut}
      />
    </>
  );
};

export default Navbar;
