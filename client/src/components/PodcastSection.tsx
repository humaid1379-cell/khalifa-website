/*
 * Design: Green Ink Press — Editorial newspaper style
 * Podcast: Minimal "Coming Soon" section with logo icon and text
 */
import AnimatedSection from "./AnimatedSection";
import KharijLogo from "./KharijLogo";

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
          <p className="font-[Cairo] text-xs uppercase tracking-[0.25em] text-white/40 mb-4">البودكاست</p>
          {/* Logo icon */}
          <div className="flex justify-center mb-4">
            <KharijLogo variant="podcast" className="drop-shadow-xl" />
          </div>
          <h2 className="font-[Amiri] text-4xl md:text-5xl font-bold text-white mb-4">
            خارج النص
          </h2>
          <div className="divider-double mx-auto mt-4" />
        </AnimatedSection>

        {/* Coming Soon Text */}
        <AnimatedSection delay={200} className="text-center">
          <p className="font-[Amiri] text-6xl md:text-8xl font-bold text-[#7cc89a] leading-tight">
            قريباً
          </p>
          <p className="font-[Cairo] text-white/40 text-sm mt-6 tracking-wider">سيتم إطلاق البودكاست قريباً</p>
        </AnimatedSection>
      </div>
    </section>
  );
}
