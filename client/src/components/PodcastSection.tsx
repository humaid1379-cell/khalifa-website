/*
 * Design: Green Ink Press — Editorial newspaper style
 * Podcast: Minimal "Coming Soon" section with centered text
 */
import AnimatedSection from "./AnimatedSection";

const PODCAST_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663135713175/7bAYv5QYZcia9BxhPhwv4f/podcast-bg-cByCNKiME5YQwrWoiXAypU.webp";

export default function PodcastSection() {
  return (
    <section id="podcast" className="relative py-32 md:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={PODCAST_BG}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[#0d3b1f]/88" />
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-10">
          <p className="font-[Cairo] text-sm uppercase tracking-widest text-white/50 mb-3">البودكاست</p>
          {/* Logo + Name */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <svg width="52" height="52" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8 C18 8 12 7 6 9 L6 27 C12 25 18 26 18 26 L18 8Z" fill="#2e7d4a" stroke="#7cc89a" strokeWidth="0.8" />
              <path d="M18 8 C18 8 24 7 30 9 L30 27 C24 25 18 26 18 26 L18 8Z" fill="#1a5c32" stroke="#7cc89a" strokeWidth="0.8" />
              <line x1="18" y1="8" x2="18" y2="26" stroke="#7cc89a" strokeWidth="1.2" />
              <line x1="9" y1="13" x2="16" y2="12.5" stroke="#7cc89a" strokeWidth="0.7" strokeOpacity="0.7" />
              <line x1="9" y1="16" x2="16" y2="15.5" stroke="#7cc89a" strokeWidth="0.7" strokeOpacity="0.7" />
              <line x1="9" y1="19" x2="16" y2="18.5" stroke="#7cc89a" strokeWidth="0.7" strokeOpacity="0.7" />
              <rect x="21" y="10" width="3.5" height="11" rx="1" transform="rotate(15 21 10)" fill="#7cc89a" />
              <polygon points="22.5,21 24.5,21 23.5,24" transform="rotate(15 23.5 21)" fill="#a8e6c0" />
              <line x1="23" y1="10.5" x2="24.5" y2="10.5" stroke="#0d3b1f" strokeWidth="0.8" transform="rotate(15 23 10.5)" />
            </svg>
            <h2 className="font-[Amiri] text-4xl md:text-5xl font-bold text-white">
              خارج النص
            </h2>
          </div>
          <div className="divider-double mx-auto mt-4" />
        </AnimatedSection>

        {/* Coming Soon Text */}
        <AnimatedSection delay={200} className="text-center">
          <p className="font-[Amiri] text-6xl md:text-8xl font-bold text-[#7cc89a] leading-tight">
            قريباً
          </p>
          <p className="font-[Cairo] text-white/50 text-base mt-6">سيتم إطلاق البودكاست قريباً</p>
        </AnimatedSection>
      </div>
    </section>
  );
}
