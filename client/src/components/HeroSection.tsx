/*
 * Design: Green Ink Press — Editorial newspaper style
 * Hero: Full-width dark green section with profile image, name, tagline, social link
 * Dark background → light/white text for contrast
 * CSS keyframe entrance animations — no framer-motion
 */
import { Instagram } from "lucide-react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663135713175/7bAYv5QYZcia9BxhPhwv4f/hero-bg-VSR5gUSaEZkvMorofDbQxu.webp";
const PROFILE_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663135713175/7bAYv5QYZcia9BxhPhwv4f/khalifa-profile_3a7883a5.jpeg";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={HERO_BG}
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-[#0d3b1f]/90 via-[#0d3b1f]/80 to-[#0d3b1f]/70" />
      </div>

      {/* Content */}
      <div className="container relative z-10 py-24 md:py-0">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Profile Image */}
          <div
            className="flex-shrink-0 order-1 md:order-2"
            style={{ animation: "heroSlideIn 0.8s ease 0.3s both" }}
          >
            <div className="relative">
              <div className="w-48 h-56 md:w-56 md:h-72 rounded-2xl overflow-hidden border-2 border-[#2e7d4a]/40 shadow-2xl">
                <img
                  src={PROFILE_IMG}
                  alt="خليفة جمعة الرميثي"
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                />
              </div>
              {/* Decorative frame */}
              <div className="absolute -top-3 -right-3 w-48 h-56 md:w-56 md:h-72 rounded-2xl border-2 border-[#2e7d4a]/30 -z-10" />
              {/* Decorative dot */}
              <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-[#2e7d4a] shadow-lg" />
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 text-center md:text-right order-2 md:order-1">
            {/* Small label */}
            <div
              className="inline-block mb-4"
              style={{ animation: "heroFadeUp 0.6s ease 0.1s both" }}
            >
              <span className="font-[Tajawal] text-[#7cc89a] text-sm tracking-wider uppercase">
                كاتب ومحلل
              </span>
            </div>

            {/* Name */}
            <h1
              className="font-[Amiri] text-2xl md:text-3xl lg:text-4xl font-bold text-white/80 leading-tight mb-4"
              style={{ animation: "heroFadeUp 0.7s ease 0.2s both" }}
            >
              خليفة جمعة الرميثي
            </h1>

            {/* Slogan */}
            <div
              className="mb-6"
              style={{ animation: "heroFadeUp 0.6s ease 0.35s both" }}
            >
              <p className="font-[Amiri] text-4xl md:text-6xl lg:text-7xl font-bold text-[#7cc89a] leading-tight">
                الواقع ليس كما تقرآه
              </p>
            </div>

            {/* Tagline */}
            <p
              className="font-[Cairo] text-base md:text-lg text-white/60 max-w-lg mb-8 leading-relaxed"
              style={{ animation: "heroFadeUp 0.6s ease 0.45s both" }}
            >
              كاتب منتظم في الصحف و المجلات الخليجية و العربية.
              يكتب في السياسة والاقتصاد والرياضة والشؤون الاجتماعية بأسلوب تحليلي ساخر مميز.
            </p>

            {/* Social Links */}
            <div
              className="flex items-center gap-4 justify-center md:justify-start"
              style={{ animation: "heroFadeUp 0.6s ease 0.5s both" }}
            >
              <a
                href="https://instagram.com/kjalromaithi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#2e7d4a] hover:bg-[#3a9d5e] text-white px-5 py-2.5 rounded-lg transition-all duration-300 font-[Cairo] text-sm"
              >
                <Instagram size={18} />
                <span>تابعني على انستغرام</span>
              </a>
              <a
                href="#articles"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#articles")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="border border-white/30 hover:border-white/60 text-white px-5 py-2.5 rounded-lg transition-all duration-300 font-[Cairo] text-sm"
              >
                اقرأ المقالات
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f7f5f2] to-transparent" />
    </section>
  );
}
