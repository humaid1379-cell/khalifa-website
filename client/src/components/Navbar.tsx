import { useEffect, useRef, useState } from "react";
import { ArrowUpLeft, Menu, X } from "lucide-react";
import { useLocation } from "wouter";
import KharijLogo from "./KharijLogo";

const navLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "المقالات", href: "/#articles" },
  { label: "السيرة الذاتية", href: "/#bio" },
  { label: "البودكاست", href: "/podcast" },
  { label: "تواصل", href: "/#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setIsOpen(false), [location]);

  useEffect(() => {
    if (!isOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [isOpen]);

  return (
    <>
      <a className="skip-link" href="#main-content">انتقل إلى المحتوى</a>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand-link" href="/" aria-label="خارج النص — الصفحة الرئيسية">
            <KharijLogo variant="navbar" color="beige" />
            <span className="brand-wordmark">خارج النص<span>خليفة جمعة الرميثي</span></span>
          </a>
          <nav aria-label="التنقل الرئيسي" className="desktop-nav">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} aria-current={location === link.href ? "page" : undefined}>
                {link.label}
              </a>
            ))}
          </nav>
          <a className="header-archive" href="/archive">أرشيف المقالات <ArrowUpLeft size={16} aria-hidden="true" /></a>
          <button
            type="button"
            ref={triggerRef}
            className="mobile-menu-trigger"
            aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <X size={25} aria-hidden="true" /> : <Menu size={25} aria-hidden="true" />}
          </button>
        </div>
        <nav id="mobile-navigation" aria-label="التنقل على الهاتف" className="mobile-nav" hidden={!isOpen}>
          <div className="container">
            {[...navLinks, { label: "أرشيف المقالات", href: "/archive" }].map((link) => (
              <a key={link.href} href={link.href} onClick={() => setIsOpen(false)} aria-current={location === link.href ? "page" : undefined}>
                {link.label}<ArrowUpLeft size={17} aria-hidden="true" />
              </a>
            ))}
          </div>
        </nav>
      </header>
    </>
  );
}
