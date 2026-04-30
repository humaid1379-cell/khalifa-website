/*
 * Design: Kharij Al Nass — Warm editorial Arabic-first
 * Podcast: "Coming Soon" section with brand logo, teal/cream theme, and CTA to /podcast
 */
import { Link } from "wouter";
import AnimatedSection from "./AnimatedSection";
import KharijLogo from "./KharijLogo";

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
          <p className="font-[Amiri] text-5xl md:text-7xl font-bold text-[#455a5d] mb-4">البودكاست</p>
          
          {/* Double white line divider */}
          <div className="flex justify-center my-6">
            <div className="relative h-[6px] w-48">
              <div className="absolute left-0 right-0 top-0 h-[2px] bg-white" />
              <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-white" />
            </div>
          </div>
          
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <KharijLogo variant="podcast" className="drop-shadow-xl rounded-xl" />
          </div>
        </AnimatedSection>

        {/* Coming Soon Text */}
        <AnimatedSection delay={200} className="text-center">
          <p className="font-[Amiri] text-6xl md:text-8xl font-bold text-[#f5f0e1] leading-tight">
            قريباً
          </p>
          {/* CTA button → /podcast */}
          <div className="mt-10">
            <Link href="/podcast">
              <span
                className="inline-block font-[Amiri] text-xl font-bold px-8 py-4 rounded-lg text-[#455a5d] border-2 border-[#455a5d] hover:bg-[#6a9199] transition-all duration-300 cursor-pointer"
                style={{ backgroundColor: '#87b0b6', letterSpacing: '0' }}
              >
                اكتشف البودكاست
              </span>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
