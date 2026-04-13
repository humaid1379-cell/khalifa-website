/*
 * Design: Kharij Al Nass — Warm editorial Arabic-first
 * Footer: Teal footer with copyright, social links, quick nav
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
            <p className="font-[Amiri] text-sm text-[#f5f0e1]/50">
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
                className="font-[Amiri] text-sm text-[#f5f0e1]/60 hover:text-[#f5f0e1] transition-colors"
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
              className="w-9 h-9 rounded-full bg-[#f5f0e1]/10 hover:bg-[#f5f0e1]/20 flex items-center justify-center transition-colors"
              aria-label="انستغرام"
            >
              <Instagram size={16} />
            </a>
            <a
              href="https://wa.me/971500000000"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[#f5f0e1]/10 hover:bg-[#f5f0e1]/20 flex items-center justify-center transition-colors"
              aria-label="واتساب"
            >
              <MessageCircle size={16} />
            </a>
          </div>
        </div>

        {/* Flower motif divider */}
        <div className="flex justify-center mt-8 mb-2 opacity-20">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663135713175/7EAJf9X3KvFUwHgCUasNkN/flower-motif_20551baa.webp"
            alt=""
            className="w-12 h-12 object-contain invert"
            aria-hidden="true"
            loading="lazy"
            width={389}
            height={342}
            decoding="async"
          />
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-[#f5f0e1]/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-[Poppins] text-xs text-[#f5f0e1]/40">
            &copy; {new Date().getFullYear()} خليفة جمعة الرميثي. جميع الحقوق محفوظة.
          </p>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 font-[Amiri] text-xs text-[#f5f0e1]/40 hover:text-[#f5f0e1]/70 transition-colors"
          >
            <ChevronUp size={14} />
            <span>العودة للأعلى</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
