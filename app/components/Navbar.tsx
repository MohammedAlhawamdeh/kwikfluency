"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, ReactNode } from "react";
import { useTheme } from "./ThemeProvider";
import lightLogo from "../../public/Light.svg";
import darkLogo from "../../public/Dark.svg";
import Sun from "./icons/Sun";
import Moon from "./icons/Moon";
import Hamburger from "./icons/Hamburger";
import MobileMenu from "./MobileMenu";

interface NavbarProps {
  authButton?: ReactNode;
}

const Navbar = ({ authButton }: NavbarProps) => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isDark = theme === "dark";
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
          {authButton}
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
      />
    </>
  );
};

export default Navbar;
