/*
 * Design: Kharij Al Nass — Warm editorial Arabic-first
 * Hero: Full-width cream section with profile image, name, tagline, social link
 * Cream background with teal/red accents
 *
 * Fixes applied:
 * - Removed decorative red dot (#7)
 * - Improved layout balance: reduced gap, increased photo size (#6)
 * - Buttons already use solid styles — confirmed consistent (#1, #2)
 */
import { Instagram } from "lucide-react";

const PROFILE_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663135713175/7bAYv5QYZcia9BxhPhwv4f/khalifa-profile_3a7883a5.jpeg";
// Sunrise/book icon removed per user request

/* Inline SVG rosette pattern for hero background */
function RosettePattern() {
  return (
    <div className="absolute inset-0 opacity-[0.12]" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2387b0b6'%3E%3Crect x='52' y='38' width='16' height='16' rx='2' transform='rotate(45 60 46)'/%3E%3Crect x='52' y='66' width='16' height='16' rx='2' transform='rotate(45 60 74)'/%3E%3Crect x='38' y='52' width='16' height='16' rx='2' transform='rotate(45 46 60)'/%3E%3Crect x='66' y='52' width='16' height='16' rx='2' transform='rotate(45 74 60)'/%3E%3Crect x='40' y='40' width='12' height='12' rx='2' transform='rotate(30 46 46)'/%3E%3Crect x='68' y='40' width='12' height='12' rx='2' transform='rotate(60 74 46)'/%3E%3Crect x='40' y='68' width='12' height='12' rx='2' transform='rotate(60 46 74)'/%3E%3Crect x='68' y='68' width='12' height='12' rx='2' transform='rotate(30 74 74)'/%3E%3C/g%3E%3C/svg%3E")`,
      backgroundRepeat: 'repeat',
    }} />
  );
}

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: '#f5f0e1' }}
    >
      {/* Decorative rosette pattern background */}
      <RosettePattern />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-l from-[#f5f0e1] via-[#f5f0e1]/95 to-[#e8e5c8]/90" />

      {/* Content */}
      <div className="container relative z-10 py-24 md:py-0">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10">
          {/* Profile Image — increased size, reduced gap */}
          <div
            className="flex-shrink-0 order-1 md:order-2"
            style={{ animation: "heroSlideIn 0.8s ease 0.3s both" }}
          >
            <div className="relative">
              <div className="w-52 h-64 md:w-64 md:h-80 rounded-2xl overflow-hidden border-2 border-[#87b0b6]/30 shadow-2xl">
                <img
                  src={PROFILE_IMG}
                  alt="خليفة جمعة الرميثي"
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
              {/* Decorative frame */}
              <div className="absolute -top-3 -right-3 w-52 h-64 md:w-64 md:h-80 rounded-2xl border-2 border-[#87b0b6]/20 -z-10" />
              {/* Red dot removed — fix #7 */}
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 text-center md:text-right order-2 md:order-1">
            {/* Small label */}
            <div
              className="inline-block mb-4"
              style={{ animation: "heroFadeUp 0.6s ease 0.1s both" }}
            >
              <span className="font-[Amiri] text-[#8b2e3b] text-base tracking-wider font-bold">
                كاتب ومحلل
              </span>
            </div>

            {/* Name */}
            <h1
              className="font-[Amiri] text-2xl md:text-3xl lg:text-4xl font-bold text-[#455a5d] leading-tight mb-4"
              style={{ animation: "heroFadeUp 0.7s ease 0.2s both" }}
            >
              خليفة جمعة الرميثي
            </h1>

            {/* Slogan — with decorative border frame */}
            <div
              className="mb-6 inline-block"
              style={{ animation: "heroFadeUp 0.6s ease 0.35s both" }}
            >
              <div className="relative inline-block border-2 border-[#87b0b6]/40 px-6 py-3 md:px-8 md:py-4">
                {/* Corner accents */}
                <span className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#8b2e3b]" />
                <span className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#8b2e3b]" />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#8b2e3b]" />
                <span className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#8b2e3b]" />
                <p className="font-[Amiri] text-4xl md:text-6xl lg:text-7xl font-bold text-[#87b0b6] leading-tight">
                  الواقع ليس كما تقرآه
                </p>
              </div>
            </div>


            {/* Tagline */}
            <p
              className="font-[Amiri] text-base md:text-lg text-[#4a7275] max-w-lg mb-8 leading-relaxed"
              style={{ animation: "heroFadeUp 0.6s ease 0.45s both" }}
            >
              إعلامي و كاتب في الصحف و المجلات الخليجية و العربية. يكتب في السياسة والاقتصاد والشؤون الاجتماعية بأسلوب تحليلي ساخر.
            </p>

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
                className="border-2 border-[#87b0b6] bg-transparent hover:bg-[#87b0b6]/10 text-[#455a5d] flex items-center gap-2 px-8 py-2.5 rounded-lg transition-all duration-300 font-[Amiri] text-sm"
              >
                اقرأ المقالات
              </a>
              <a
                href="https://instagram.com/kjalromaithi"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-[#87b0b6] bg-transparent hover:bg-[#87b0b6]/10 text-[#455a5d] flex items-center gap-2 px-8 py-2.5 rounded-lg transition-all duration-300 font-[Amiri] text-sm"
              >
                <Instagram size={18} />
                <span>تابعني على انستغرام</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f5f0e1] to-transparent" />
    </section>
  );
}
