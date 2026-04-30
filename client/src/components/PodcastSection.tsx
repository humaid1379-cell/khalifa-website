/*
 * Design: Kharij Al Nass — Warm editorial Arabic-first
 * Podcast: "Coming Soon" section with brand logo and teal/cream theme
 *
 * Fixes applied:
 * - Removed redundant "خارج النص" text below logo (#5)
 * - Reduced "قريباً" text size (#14)
 * - Logo container uses mix-blend-mode to blend with teal background (#4)
 * - "اكتشف البودكاست" button uses solid border, not dashed (#1)
 */
import AnimatedSection from "./AnimatedSection";
import KharijLogo from "./KharijLogo";
import { Link } from "wouter";

export default function PodcastSection() {
  return (
    <section id="podcast" className="relative py-32 md:py-40 overflow-hidden" style={{ backgroundColor: '#87b0b6' }}>
      {/* Decorative rosette pattern overlay */}
      <div className="absolute inset-0 opacity-[0.08]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f1efd6'%3E%3Crect x='52' y='38' width='16' height='16' rx='2' transform='rotate(45 60 46)'/%3E%3Crect x='52' y='66' width='16' height='16' rx='2' transform='rotate(45 60 74)'/%3E%3Crect x='38' y='52' width='16' height='16' rx='2' transform='rotate(45 46 60)'/%3E%3Crect x='66' y='52' width='16' height='16' rx='2' transform='rotate(45 74 60)'/%3E%3Crect x='40' y='40' width='12' height='12' rx='2' transform='rotate(30 46 46)'/%3E%3Crect x='68' y='40' width='12' height='12' rx='2' transform='rotate(60 74 46)'/%3E%3Crect x='40' y='68' width='12' height='12' rx='2' transform='rotate(60 46 74)'/%3E%3Crect x='68' y='68' width='12' height='12' rx='2' transform='rotate(30 74 74)'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }} />

      <div className="container relative z-10">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-10">
          <p className="font-[Amiri] text-sm uppercase tracking-[0.15em] text-[#f5f0e1]/70 mb-6">البودكاست</p>
          {/* Logo — blended with teal background */}
          <div className="flex justify-center mb-6">
            <div className="rounded-xl overflow-hidden" style={{ mixBlendMode: 'multiply' }}>
              <KharijLogo variant="podcast" className="drop-shadow-xl" />
            </div>
          </div>
          {/* Removed redundant "خارج النص" heading — logo already shows it (#5) */}
          <div className="flex justify-center mt-4 mb-8">
            <div className="relative h-[6px] w-48">
              <div className="absolute left-0 right-0 top-0 h-[2px] bg-[#f5f0e1]/40" />
              <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#f5f0e1]/40" />
            </div>
          </div>
        </AnimatedSection>

        {/* Coming Soon Text — reduced size (#14) */}
        <AnimatedSection delay={200} className="text-center">
          <p className="font-[Amiri] text-4xl md:text-5xl font-bold text-[#f5f0e1] leading-tight">
            قريباً
          </p>
          <p className="font-[Amiri] text-[#f5f0e1]/60 text-sm mt-6 tracking-wider">سيتم إطلاق البودكاست قريباً</p>

          {/* Discover podcast button — solid border, not dashed (#1) */}
          <Link href="/podcast">
            <span className="mt-10 inline-flex items-center gap-2 border-2 border-[#f5f0e1]/50 hover:border-[#f5f0e1] hover:bg-[#f5f0e1]/10 text-[#f5f0e1]/80 hover:text-[#f5f0e1] px-6 py-2.5 rounded-lg transition-all duration-300 font-[Amiri] text-sm cursor-pointer">
              اكتشف البودكاست
            </span>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
