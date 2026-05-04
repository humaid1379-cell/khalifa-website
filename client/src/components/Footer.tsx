/*
 * Design: Kharij Al Nass — Warm editorial Arabic-first (Final 2026 branding)
 * Footer: Dark teal footer with brand logo, copyright, social links, quick nav
 * Brand colors: #f1efd6 (beige), #bf4240 (red), #87b0b6 (blue), #455a5d (dark teal)
 * Uses shape2 (arabesque flower motif) as decorative divider
 */
import { Instagram, MessageCircle, ChevronUp } from "lucide-react";
import KharijLogo from "./KharijLogo";

const SHAPE2_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663135713175/7EAJf9X3KvFUwHgCUasNkN/shape2_d1e8aa24.png";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#455a5d] text-[#f1efd6]">
      {/* Top divider */}
      <div className="h-1 bg-gradient-to-l from-[#87b0b6] via-[#bf4240] to-[#87b0b6]" />

      <div className="container py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand logo + Name */}
          <div className="text-center md:text-right flex flex-col items-center md:items-end gap-3">
            <KharijLogo variant="navbar" color="beige" />
            <div>
              <h3 className="font-[Amiri] text-xl font-bold text-[#f1efd6] mb-1">
                خليفة جمعة الرميثي
              </h3>
              <p className="font-[Amiri] text-sm text-[#87b0b6]">
                كاتب وصحفي إماراتي
              </p>
            </div>
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
                className="font-[Amiri] text-sm text-[#87b0b6] hover:text-[#f1efd6] transition-colors"
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
              className="w-9 h-9 rounded-full bg-[#f1efd6]/15 hover:bg-[#f1efd6]/25 flex items-center justify-center transition-colors"
              aria-label="انستغرام"
            >
              <Instagram size={16} />
            </a>
            <a
              href="https://wa.me/971500000000"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[#f1efd6]/15 hover:bg-[#f1efd6]/25 flex items-center justify-center transition-colors"
              aria-label="واتساب"
            >
              <MessageCircle size={16} />
            </a>
          </div>
        </div>

        {/* Arabesque flower motif divider — brand shape2 */}
        <div className="flex justify-center mt-8 mb-4 opacity-25">
          <img
            src={SHAPE2_URL}
            alt=""
            className="w-20 h-20 md:w-24 md:h-24 object-contain brightness-200"
            loading="lazy"
            decoding="async"
            aria-hidden="true"
          />
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-[#f1efd6]/15 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-[Poppins] text-xs text-[#87b0b6]">
            &copy; {new Date().getFullYear()} خليفة جمعة الرميثي. جميع الحقوق محفوظة.
          </p>

          {/* Back to top — clean text button */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 font-[Amiri] text-xs text-[#87b0b6] hover:text-[#f1efd6] transition-colors"
          >
            <ChevronUp size={14} />
            <span>العودة للأعلى</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
