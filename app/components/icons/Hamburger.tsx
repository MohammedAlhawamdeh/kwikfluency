import React from "react";

interface HamburgerProps {
  isOpen: boolean;
  onClick: () => void;
  isDark: boolean;
}

const Hamburger: React.FC<HamburgerProps> = ({ isOpen, onClick, isDark }) => {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center w-10 h-10 focus:outline-none md:hidden"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      <div className="relative w-6 h-5">
        <span
          className={`absolute h-0.5 w-6 transform transition-all duration-300 ${
            isDark ? "bg-white" : "bg-black"
          } ${isOpen ? "rotate-45 translate-y-2.5" : "translate-y-0"}`}
        />
        <span
          className={`absolute h-0.5 w-6 transform transition-all duration-300 ${
            isDark ? "bg-white" : "bg-black"
          } ${isOpen ? "opacity-0" : "opacity-100 translate-y-2.5"}`}
        />
        <span
          className={`absolute h-0.5 w-6 transform transition-all duration-300 ${
            isDark ? "bg-white" : "bg-black"
          } ${isOpen ? "-rotate-45 translate-y-2.5" : "translate-y-5"}`}
        />
      </div>
    </button>
  );
};

export default Hamburger;
