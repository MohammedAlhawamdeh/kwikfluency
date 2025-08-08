import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "../../public/Light.svg";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow">
      <div>
        <Image src={logo} alt="kwikfluency" className="h-10 w-auto" />
      </div>

      <ul className="flex gap-10">
        <li>
          <Link
            href="#"
            className="text-black hover:text-[var(--vivid-orange)]"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="text-black hover:text-[var(--vivid-orange)]"
          >
            Pricing
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="text-black hover:text-[var(--vivid-orange)]"
          >
            Features
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

export default Navbar;
