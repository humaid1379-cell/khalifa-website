/*
 * Design: Kharij Al Nass — Warm editorial Arabic-first (Final 2026 branding)
 * Podcast: "Coming Soon" section with brand logo and teal/cream theme
 * Brand colors: #f1efd6 (beige), #bf4240 (red), #87b0b6 (blue), #455a5d (dark teal)
 * Uses brand pattern1 as background overlay
 */
import AnimatedSection from "./AnimatedSection";
import KharijLogo from "./KharijLogo";
import { Link } from "wouter";

const PATTERN_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663135713175/7EAJf9X3KvFUwHgCUasNkN/pattern1_b9a20e8e.png";

export default function PodcastSection() {
  return (
    <section id="podcast" className="relative py-32 md:py-40 overflow-hidden" style={{ backgroundColor: '#87b0b6' }}>
      {/* Decorative brand pattern overlay */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: `url("${PATTERN_URL}")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '300px',
      }} />

      <div className="container relative z-10">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-10">
          <p className="font-[Amiri] text-sm uppercase tracking-[0.15em] text-[#f1efd6]/70 mb-6">البودكاست</p>
          {/* Logo — beige on teal background */}
          <div className="flex justify-center mb-6">
            <KharijLogo variant="podcast" color="beige" className="drop-shadow-xl" />
          </div>
          {/* Double divider */}
          <div className="flex justify-center mt-4 mb-8">
            <div className="relative h-[6px] w-48">
              <div className="absolute left-0 right-0 top-0 h-[2px] bg-[#f1efd6]/40" />
              <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#f1efd6]/40" />
            </div>
          </div>
        </AnimatedSection>

        {/* Coming Soon Text */}
        <AnimatedSection delay={200} className="text-center">
          <p className="font-[Amiri] text-4xl md:text-5xl font-bold text-[#f1efd6] leading-tight">
            قريباً
          </p>
          <p className="font-[Amiri] text-[#f1efd6]/60 text-sm mt-6 tracking-wider">سيتم إطلاق البودكاست قريباً</p>

          {/* Discover podcast button */}
          <Link href="/podcast">
            <span className="mt-10 inline-flex items-center gap-2 border-2 border-[#f1efd6]/50 hover:border-[#f1efd6] hover:bg-[#f1efd6]/10 text-[#f1efd6]/80 hover:text-[#f1efd6] px-6 py-2.5 rounded-lg transition-all duration-300 font-[Amiri] text-sm cursor-pointer">
              اكتشف البودكاست
            </span>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
