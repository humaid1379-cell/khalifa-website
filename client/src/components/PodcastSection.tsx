/*
 * Design: Green Ink Press — Editorial newspaper style
 * Podcast: Dark green section with podcast studio background
 * Episode cards with play buttons, coming soon state
 * CSS IntersectionObserver animations — no framer-motion
 */
import { Play, Headphones, Clock } from "lucide-react";
import { podcastEpisodes } from "@/data/podcasts";
import { toast } from "sonner";
import AnimatedSection from "./AnimatedSection";

const PODCAST_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663135713175/7bAYv5QYZcia9BxhPhwv4f/podcast-bg-cByCNKiME5YQwrWoiXAypU.webp";

export default function PodcastSection() {
  return (
    <section id="podcast" className="relative py-20 md:py-28 overflow-hidden">
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
        <AnimatedSection className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#2e7d4a]/30 px-4 py-1.5 rounded-full mb-4">
            <Headphones size={16} className="text-[#7cc89a]" />
            <span className="font-[Tajawal] text-sm text-[#7cc89a]">قريباً</span>
          </div>
          <h2 className="font-[Amiri] text-3xl md:text-4xl font-bold text-white mb-4">
            بودكاست قريباً
          </h2>
          <div className="w-48 mx-auto mb-6">
            <div className="h-0.5 bg-[#2e7d4a]" />
            <div className="h-0.5 bg-[#2e7d4a] mt-1" />
          </div>
          <p className="font-[Cairo] text-white/60 max-w-2xl mx-auto leading-relaxed">
            حوارات ونقاشات معمقة حول الصحافة والكتابة والقضايا المجتمعية مع نخبة من الكتّاب والمفكرين
          </p>
        </AnimatedSection>

        {/* Episodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {podcastEpisodes.map((episode, i) => (
            <AnimatedSection key={episode.id} delay={i * 100}>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-300 group">
                <div className="flex gap-4">
                  {/* Play Button */}
                  <button
                    onClick={() => toast("الحلقات ستكون متاحة قريباً", { description: "ترقبوا إطلاق البودكاست" })}
                    className="flex-shrink-0 w-14 h-14 rounded-full bg-[#2e7d4a] flex items-center justify-center group-hover:bg-[#3a9d5e] transition-colors shadow-lg"
                  >
                    <Play size={20} className="text-white mr-[-2px]" fill="white" />
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-[Tajawal] text-xs text-[#7cc89a] bg-[#2e7d4a]/30 px-2 py-0.5 rounded">
                        الحلقة {i + 1}
                      </span>
                      <span className="flex items-center gap-1 font-[Tajawal] text-xs text-white/40">
                        <Clock size={12} />
                        {episode.duration}
                      </span>
                    </div>
                    <h3 className="font-[Amiri] text-base font-bold text-white mb-1.5 leading-relaxed">
                      {episode.title}
                    </h3>
                    <p className="font-[Cairo] text-sm text-white/50 leading-relaxed line-clamp-2">
                      {episode.description}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Subscribe CTA */}
        <AnimatedSection delay={300} className="text-center mt-12">
          <p className="font-[Cairo] text-white/50 text-sm mb-4">
            اشترك ليصلك إشعار عند إطلاق البودكاست
          </p>
          <button
            onClick={() => toast("شكراً لاهتمامك!", { description: "سنعلمك فور إطلاق البودكاست" })}
            className="bg-[#2e7d4a] hover:bg-[#3a9d5e] text-white font-[Cairo] text-sm px-8 py-3 rounded-lg transition-colors shadow-lg"
          >
            أعلمني عند الإطلاق
          </button>
        </AnimatedSection>
      </div>
    </section>
  );
}
