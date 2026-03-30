/*
 * Design: Green Ink Press — Editorial newspaper style
 * Footer: Dark green footer with copyright, social links, quick nav
 */
import { Instagram, MessageCircle, ChevronUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0d3b1f] text-white">
      {/* Top divider */}
      <div className="h-1 bg-gradient-to-l from-[#2e7d4a] via-[#1b6b3a] to-[#2e7d4a]" />

      <div className="container py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Name & Tagline */}
          <div className="text-center md:text-right">
            <h3 className="font-[Amiri] text-xl font-bold text-white mb-1">
              خليفة جمعة الرميثي
            </h3>
            <p className="font-[Tajawal] text-sm text-white/50">
              كاتب وصحفي إماراتي
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-6">
            {[
              { label: "الرئيسية", href: "#hero" },
              { label: "السيرة", href: "#bio" },
              { label: "المقالات", href: "#articles" },
              { label: "البودكاست", href: "#podcast" },
            ].map((link) => (
              <button
                key={link.href}
                onClick={() =>
                  document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" })
                }
                className="font-[Cairo] text-sm text-white/60 hover:text-white transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com/kjalromaithi"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="انستغرام"
            >
              <Instagram size={16} />
            </a>
            <a
              href="https://wa.me/971500000000"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="واتساب"
            >
              <MessageCircle size={16} />
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-[Tajawal] text-xs text-white/40">
            © {new Date().getFullYear()} خليفة جمعة الرميثي. جميع الحقوق محفوظة.
          </p>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 font-[Cairo] text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            <ChevronUp size={14} />
            <span>العودة للأعلى</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
