import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "../../public/Dark.svg";

const NavbarDark = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-black shadow">
      <div>
        <Image className="h-10 w-auto" src={logo} alt="kwikfluency" />
      </div>

      <ul className="flex gap-10">
        <li>
          <Link
            className="text-white hover:text-[var(--vivid-orange)]"
            href="#"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            className="text-white hover:text-[var(--vivid-orange)]"
            href="#"
          >
            Features
          </Link>
        </li>
        <li>
          <Link
            className="text-white hover:text-[var(--vivid-orange)]"
            href="#"
          >
            Pricing
          </Link>
        </li>
      </ul>

      <div>
        <button className="bg-[var(--vivid-orange)] text-white py-2 px-4 font-bold rounded-full hover:bg-amber-700">
          Get Started
        </button>
      </div>
    </nav>
  );
};

export default NavbarDark;
