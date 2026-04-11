/*
 * Design: Kharij Al Nass — Warm editorial Arabic-first
 * Navbar: Sticky top nav with cream/teal branding
 * Logo (IMG_2207) shown in navbar and podcast section
 */
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import KharijLogo from "./KharijLogo";
import { useLocation } from "wouter";

const navLinks = [
  { label: "الرئيسية", href: "#hero" },
  { label: "السيرة الذاتية", href: "#bio" },
  { label: "المقالات", href: "#articles" },
  { label: "الأرشيف", href: "/archive", isRoute: true },
  { label: "البودكاست", href: "#podcast" },
  { label: "تواصل", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location, navigate] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (href: string, isRoute?: boolean) => {
    setIsOpen(false);
    if (isRoute) {
      navigate(href);
      return;
    }
    if (location !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#f1efd6]/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">

        {/* Logo — right side (RTL: visually leading) */}
        <div className="hidden md:flex items-center">
          <button
            onClick={() => handleClick("#podcast")}
            className="group transition-transform duration-300 hover:scale-105"
            aria-label="خارج النص"
          >
            <KharijLogo variant="navbar" />
          </button>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleClick(link.href, link.isRoute)}
              className={`font-[Amiri] text-sm transition-colors relative group ${
                scrolled
                  ? "text-[#3a3a32]/80 hover:text-[#3a3a32]"
                  : "text-[#3a3a32]/70 hover:text-[#3a3a32]"
              }`}
            >
              {link.label}
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-[#bf4240] transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>

        {/* Mobile: logo + hamburger */}
        <div className="md:hidden flex items-center justify-between w-full">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-[#3a3a32]"
            aria-label="القائمة"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <button onClick={() => handleClick("#podcast")} aria-label="خارج النص">
            <KharijLogo variant="navbar" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 bg-[#f1efd6]/98 backdrop-blur-md ${
          isOpen ? "max-h-80" : "max-h-0"
        }`}
      >
        <div className="container py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleClick(link.href, link.isRoute)}
              className="font-[Amiri] text-base text-[#3a3a32]/90 hover:text-[#3a3a32] text-right py-2 border-b border-[#d4d1b8] transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
