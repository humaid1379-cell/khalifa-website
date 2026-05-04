/*
 * Design: Kharij Al Nass — Warm editorial Arabic-first (Final 2026 branding)
 * Navbar: Sticky top nav with cream/teal branding
 * Logo switches color: beige on dark scrolled bg, beige on transparent hero bg
 * Brand colors: #f1efd6 (beige), #bf4240 (red), #87b0b6 (blue), #455a5d (dark teal)
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
  { label: "البودكاست", href: "/podcast", isRoute: true },
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

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

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
          ? "bg-[#455a5d] backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">

        {/* Logo — right side (RTL: visually leading) */}
        <div className="hidden md:flex items-center">
          <button
            onClick={() => handleClick("/", false)}
            className="group transition-transform duration-300 hover:scale-105"
            aria-label="خارج النص"
          >
            <KharijLogo variant="navbar" color="beige" />
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
                  ? "text-[#f1efd6]/90 hover:text-[#f1efd6]"
                  : "text-[#455a5d]/80 hover:text-[#455a5d]"
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
            className="p-2 transition-colors text-white"
            aria-label="القائمة"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <button onClick={() => handleClick("/", false)} aria-label="خارج النص">
            <KharijLogo variant="navbar" color="beige" />
          </button>
        </div>
      </div>

      {/* Mobile Menu — full height with scroll so nothing is cut off */}
      <div
        className={`md:hidden transition-all duration-300 bg-[#455a5d] border-t border-[#f1efd6]/20 ${
          isOpen ? "block" : "hidden"
        }`}
        style={{ maxHeight: "calc(100vh - 4rem)", overflowY: "auto" }}
      >
        <div className="container py-4 flex flex-col">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleClick(link.href, link.isRoute)}
              className="font-[Amiri] text-lg text-[#f1efd6]/90 hover:text-[#bf4240] text-right py-3 px-2 border-b border-[#f1efd6]/20 transition-colors w-full"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
