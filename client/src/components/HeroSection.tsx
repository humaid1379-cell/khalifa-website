/*
 * Design: Kharij Al Nass — Warm editorial Arabic-first (Final 2026 branding)
 * Hero: Full-width section with Arabic calligraphy background, profile image, name, tagline
 * Dark teal calligraphy background with cream/white text for contrast
 * Brand colors: #f1efd6 (beige), #bf4240 (red), #87b0b6 (blue), #455a5d (dark teal)
 */
import { Instagram } from "lucide-react";

const PROFILE_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663135713175/7bAYv5QYZcia9BxhPhwv4f/khalifa-profile_3a7883a5.jpeg";
const CALLIGRAPHY_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663135713175/7EAJf9X3KvFUwHgCUasNkN/kharij-alnass-calligraphy-bg-jNhSnM3nVz85joMPP3VWgB.webp";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden"
    >
      {/* Arabic calligraphy background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${CALLIGRAPHY_BG}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.1,
        }}
      />

      {/* Overlay for text readability — semi-transparent dark teal */}
      <div className="absolute inset-0 bg-[#455a5d]/40" />

      {/* Content */}
      <div className="container relative z-10 py-24 md:py-0">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10">
          {/* Profile Image */}
          <div
            className="flex-shrink-0 order-1 md:order-2"
            style={{ animation: "heroSlideIn 0.8s ease 0.3s both" }}
          >
            <div className="relative">
              <div className="w-52 h-64 md:w-64 md:h-80 rounded-2xl overflow-hidden border-2 border-[#87b0b6]/50 shadow-2xl">
                <img
                  src={PROFILE_IMG}
                  alt="خليفة جمعة الرميثي"
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
              {/* Decorative frame */}
              <div className="absolute -top-3 -right-3 w-52 h-64 md:w-64 md:h-80 rounded-2xl border-2 border-[#87b0b6]/30 -z-10" />
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 text-center md:text-right order-2 md:order-1">
            {/* Small label — emptied, kept for layout spacing */}
            <div
              className="inline-block mb-4"
              style={{ animation: "heroFadeUp 0.6s ease 0.1s both" }}
            >
              <span className="font-[Amiri] text-[#f1efd6] text-base tracking-wider font-bold">
                &nbsp;
              </span>
            </div>

            {/* Name */}
            <h1
              className="font-[Amiri] text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4"
              style={{ animation: "heroFadeUp 0.7s ease 0.2s both" }}
            >
              خليفة جمعة الرميثي
            </h1>

            {/* Tagline — moved above slogan */}
            <p
              className="font-[Amiri] text-base md:text-lg text-white font-bold max-w-lg mb-6 leading-relaxed"
              style={{ animation: "heroFadeUp 0.6s ease 0.35s both" }}
            >
              إعلامي و كاتب في الصحف و المجلات الخليجية و العربية. يكتب في السياسة والاقتصاد والشؤون الاجتماعية بأسلوب تحليلي ساخر.
            </p>

            {/* Slogan — moved below tagline, with decorative border frame */}
            <div
              className="mb-8 inline-block"
              style={{ animation: "heroFadeUp 0.6s ease 0.45s both" }}
            >
              <div className="relative inline-block border-2 border-[#455a5d] px-6 py-3 md:px-8 md:py-4">
                {/* Corner accents */}
                <span className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#f1efd6]" />
                <span className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#f1efd6]" />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#f1efd6]" />
                <span className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#f1efd6]" />
                <p className="font-[Amiri] text-4xl md:text-6xl lg:text-7xl font-bold text-[#f1efd6] leading-tight">
                  الواقع ليس كما تقرآه
                </p>
              </div>
            </div>

            {/* CTA Buttons — stacked vertically, centered, outline style */}
            <div
              className="flex flex-col items-center gap-4"
              style={{ animation: "heroFadeUp 0.6s ease 0.5s both" }}
            >
              <a
                href="#articles"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#articles")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="border-2 border-[#455a5d] bg-transparent hover:bg-[#455a5d]/20 text-white flex items-center gap-2 px-8 py-2.5 rounded-lg transition-all duration-300 font-[Amiri] text-sm"
              >
                اقرأ المقالات
              </a>
              <a
                href="https://instagram.com/kjalromaithi"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-[#455a5d] bg-transparent hover:bg-[#455a5d]/20 text-white flex items-center gap-2 px-8 py-2.5 rounded-lg transition-all duration-300 font-[Amiri] text-sm"
              >
                <Instagram size={18} />
                <span>تابعني على انستغرام</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade to beige */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f1efd6] to-transparent" />
    </section>
  );
}
