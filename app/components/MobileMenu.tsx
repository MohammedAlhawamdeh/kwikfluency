"use client";

import React from "react";
import Link from "next/link";

// Type for user data
type User = {
  id: string;
  email: string;
  name?: string;
  emailVerified: boolean;
} | null;

interface MobileMenuProps {
  isOpen: boolean;
  isDark: boolean;
  menuItemsStyle: string;
  closeMenu: () => void;
  user?: User;
  isLoading?: boolean;
  onSignOut?: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  isDark,
  menuItemsStyle,
  closeMenu,
  user,
  isLoading,
  onSignOut,
}) => {
  return (
    <div
      className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ${
        isOpen ? "visible" : "invisible"
      }`}
      style={{
        top: "72px",
      }}
    >
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? "opacity-50" : "opacity-0"
        }`}
        onClick={closeMenu}
      />

      <div
        className={`mobile-menu absolute left-0 right-0 transition-all duration-300 transform ${
          isDark ? "bg-black" : "bg-white"
        } shadow-lg ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="flex flex-col px-6 py-6">
          {/* User Info Section (if authenticated) */}
          {user && (
            <div className="mb-6 pb-6 border-b border-gray-300 dark:border-gray-600">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-medium"
                  style={{ backgroundColor: "var(--vivid-orange)" }}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {user.name || user.email.split("@")[0]}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {user.email}
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard"
                className="block w-full text-center py-2 px-4 text-sm font-medium bg-[var(--vivid-orange)] text-white rounded-lg hover:bg-[rgba(255,92,0,0.9)] transition-colors"
                onClick={closeMenu}
              >
                Go to Dashboard
              </Link>
            </div>
          )}

          {/* Navigation Links */}
          <ul className="flex flex-col space-y-6 mb-6">
            <li>
              <Link
                href="#"
                className={`block text-lg font-medium ${menuItemsStyle}`}
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className={`block text-lg font-medium ${menuItemsStyle}`}
                onClick={closeMenu}
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className={`block text-lg font-medium ${menuItemsStyle}`}
                onClick={closeMenu}
              >
                Features
              </Link>
            </li>
          </ul>

          {/* Authentication Actions */}
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-[var(--vivid-orange)] rounded-full animate-spin"></div>
            </div>
          ) : user ? (
            /* Authenticated User Actions */
            <div className="border-t border-gray-300 dark:border-gray-600 pt-6">
              <button
                onClick={() => {
                  closeMenu();
                  onSignOut?.();
                }}
                className={`w-full py-3 px-4 text-left font-medium rounded-lg transition-colors ${
                  isDark 
                    ? 'text-red-400 hover:bg-gray-800' 
                    : 'text-red-600 hover:bg-gray-100'
                }`}
              >
                Sign Out
              </button>
            </div>
          ) : (
            /* Unauthenticated User Actions */
            <div className="space-y-3">
              <Link
                href="/login"
                className={`block w-full text-center py-3 px-4 font-medium rounded-lg transition-colors ${
                  isDark
                    ? 'text-white border border-gray-600 hover:bg-gray-800'
                    : 'text-gray-900 border border-gray-300 hover:bg-gray-100'
                }`}
                onClick={closeMenu}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="block w-full text-center bg-[var(--vivid-orange)] text-white py-3 px-4 font-medium rounded-lg hover:bg-[rgba(255,92,0,0.9)] transition-colors"
                onClick={closeMenu}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
