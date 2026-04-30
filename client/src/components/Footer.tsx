/*
 * Design: Kharij Al Nass — Warm editorial Arabic-first
 * Footer: Dark green footer with copyright, social links, quick nav
 *
 * Fixes applied:
 * - Flower motif enlarged to ~80px (#13)
 * - All elements use clean solid styles, no dashed borders (#1)
 * - Text colors updated for WCAG 4.5:1 contrast ratio on #3d5a45 bg
 */
import { Instagram, MessageCircle, ChevronUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#3d5a45] text-[#f5f0e1]">
      {/* Top divider */}
      <div className="h-1 bg-gradient-to-l from-[#87b07a] via-[#8b2e3b] to-[#87b07a]" />

      <div className="container py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Name & Tagline */}
          <div className="text-center md:text-right">
            <h3 className="font-[Amiri] text-xl font-bold text-[#f5f0e1] mb-1">
              خليفة جمعة الرميثي
            </h3>
            <p className="font-[Amiri] text-sm text-[#c0d2c3]">
              كاتب وصحفي إماراتي
            </p>
          </div>

          {/* Quick Links — clean text buttons */}
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
                className="font-[Amiri] text-sm text-[#c0d2c3] hover:text-[#f5f0e1] transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Social Icons — solid circular buttons */}
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com/kjalromaithi"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[#f5f0e1]/15 hover:bg-[#f5f0e1]/25 flex items-center justify-center transition-colors"
              aria-label="انستغرام"
            >
              <Instagram size={16} />
            </a>
            <a
              href="https://wa.me/971500000000"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[#f5f0e1]/15 hover:bg-[#f5f0e1]/25 flex items-center justify-center transition-colors"
              aria-label="واتساب"
            >
              <MessageCircle size={16} />
            </a>
          </div>
        </div>

        {/* Flower motif divider — enlarged to ~80px (#13) */}
        <div className="flex justify-center mt-8 mb-4 opacity-30">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663135713175/7EAJf9X3KvFUwHgCUasNkN/flower-motif_8ce1a1cf.jpeg"
            alt=""
            className="w-20 h-20 md:w-24 md:h-24 object-contain invert"
            loading="lazy"
            decoding="async"
            aria-hidden="true"
          />
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-[#f5f0e1]/15 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-[Poppins] text-xs text-[#c0d2c3]">
            &copy; {new Date().getFullYear()} خليفة جمعة الرميثي. جميع الحقوق محفوظة.
          </p>

          {/* Back to top — clean text button */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 font-[Amiri] text-xs text-[#c0d2c3] hover:text-[#f5f0e1] transition-colors"
          >
            <ChevronUp size={14} />
            <span>العودة للأعلى</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
