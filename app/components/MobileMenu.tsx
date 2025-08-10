"use client";

import React from "react";
import Link from "next/link";

interface MobileMenuProps {
  isOpen: boolean;
  isDark: boolean;
  menuItemsStyle: string;
  closeMenu: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  isDark,
  menuItemsStyle,
  closeMenu,
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
        <ul className="flex flex-col px-6 py-6 space-y-6">
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
          <li className="pt-4">
            <Link
              href="/"
              className="w-full bg-[var(--vivid-orange)] text-white py-3 px-6 font-bold rounded-full hover:bg-amber-700 transition-colors flex justify-center items-center"
              onClick={closeMenu}
            >
              Get Started
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MobileMenu;
