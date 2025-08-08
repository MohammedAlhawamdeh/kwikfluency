"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useTheme } from "./ThemeProvider";
import lightLogo from "../../public/Light.svg";
import darkLogo from "../../public/Dark.svg";
import Sun from "./icons/Sun";
import Moon from "./icons/Moon";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";
  const menuItemsStyle = `transition-colors hover:text-[var(--vivid-orange)] ${
    isDark ? "text-white" : "text-black"
  }`;

  return (
    <nav
      className={`flex items-center justify-between px-6 py-4 shadow transition-colors duration-300 ${
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

      <ul className="flex gap-10">
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

      <div className="flex items-center gap-4">
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

        <button className="bg-[var(--vivid-orange)] text-white py-2 px-4 font-bold rounded-full hover:bg-amber-700 transition-colors">
          Get Started
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
