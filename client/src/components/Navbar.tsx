/*
 * Design: Green Ink Press — Editorial newspaper style
 * Navbar: Sticky top nav with deep green background, Amiri headings
 * Clean horizontal links, hamburger on mobile
 */
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "الرئيسية", href: "#hero" },
  { label: "السيرة الذاتية", href: "#bio" },
  { label: "المقالات", href: "#articles" },
  { label: "البودكاست", href: "#podcast" },
  { label: "تواصل", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (href: string) => {
    setIsOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0d3b1f]/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Podcast Name + Logo — upper left (RTL: visually upper right) */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => handleClick("#podcast")}
            className="flex items-center gap-2 group transition-all duration-300"
            aria-label="خارج النص - البودكاست"
          >
            {/* Open book with pen SVG logo */}
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform duration-300 group-hover:scale-110"
            >
              {/* Left book page */}
              <path
                d="M18 8 C18 8 12 7 6 9 L6 27 C12 25 18 26 18 26 L18 8Z"
                fill="#2e7d4a"
                stroke="#7cc89a"
                strokeWidth="0.8"
              />
              {/* Right book page */}
              <path
                d="M18 8 C18 8 24 7 30 9 L30 27 C24 25 18 26 18 26 L18 8Z"
                fill="#1a5c32"
                stroke="#7cc89a"
                strokeWidth="0.8"
              />
              {/* Book spine */}
              <line x1="18" y1="8" x2="18" y2="26" stroke="#7cc89a" strokeWidth="1.2" />
              {/* Left page lines */}
              <line x1="9" y1="13" x2="16" y2="12.5" stroke="#7cc89a" strokeWidth="0.7" strokeOpacity="0.7" />
              <line x1="9" y1="16" x2="16" y2="15.5" stroke="#7cc89a" strokeWidth="0.7" strokeOpacity="0.7" />
              <line x1="9" y1="19" x2="16" y2="18.5" stroke="#7cc89a" strokeWidth="0.7" strokeOpacity="0.7" />
              {/* Pen body on right page */}
              <rect
                x="21"
                y="10"
                width="3.5"
                height="11"
                rx="1"
                transform="rotate(15 21 10)"
                fill="#7cc89a"
              />
              {/* Pen tip */}
              <polygon
                points="22.5,21 24.5,21 23.5,24"
                transform="rotate(15 23.5 21)"
                fill="#a8e6c0"
              />
              {/* Pen clip */}
              <line
                x1="23"
                y1="10.5"
                x2="24.5"
                y2="10.5"
                stroke="#0d3b1f"
                strokeWidth="0.8"
                transform="rotate(15 23 10.5)"
              />
            </svg>
            <span className="font-[Amiri] text-lg font-bold text-[#7cc89a] group-hover:text-white transition-colors tracking-wide">
              خارج النص
            </span>
          </button>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleClick(link.href)}
              className="font-[Cairo] text-sm text-white/80 hover:text-white transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-[#2e7d4a] transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>

        {/* Mobile: podcast logo + name */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => handleClick("#podcast")}
            className="flex items-center gap-1.5"
            aria-label="خارج النص"
          >
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8 C18 8 12 7 6 9 L6 27 C12 25 18 26 18 26 L18 8Z" fill="#2e7d4a" stroke="#7cc89a" strokeWidth="0.8" />
              <path d="M18 8 C18 8 24 7 30 9 L30 27 C24 25 18 26 18 26 L18 8Z" fill="#1a5c32" stroke="#7cc89a" strokeWidth="0.8" />
              <line x1="18" y1="8" x2="18" y2="26" stroke="#7cc89a" strokeWidth="1.2" />
              <line x1="9" y1="13" x2="16" y2="12.5" stroke="#7cc89a" strokeWidth="0.7" strokeOpacity="0.7" />
              <line x1="9" y1="16" x2="16" y2="15.5" stroke="#7cc89a" strokeWidth="0.7" strokeOpacity="0.7" />
              <rect x="21" y="10" width="3.5" height="11" rx="1" transform="rotate(15 21 10)" fill="#7cc89a" />
              <polygon points="22.5,21 24.5,21 23.5,24" transform="rotate(15 23.5 21)" fill="#a8e6c0" />
            </svg>
            <span className="font-[Amiri] text-base font-bold text-[#7cc89a]">خارج النص</span>
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white p-2"
          aria-label="القائمة"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 bg-[#0d3b1f]/98 backdrop-blur-md ${
          isOpen ? "max-h-80" : "max-h-0"
        }`}
      >
        <div className="container py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleClick(link.href)}
              className="font-[Cairo] text-base text-white/90 hover:text-white text-right py-2 border-b border-white/10 transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
