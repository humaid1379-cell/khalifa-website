/*
 * Design: Green Ink Press — Editorial newspaper style
 * Hero: Full-width dark green section with profile image, name, tagline, social link
 * Dark background → light/white text for contrast
 * Animated entrance with framer-motion
 */
import { Instagram } from "lucide-react";
import { motion } from "framer-motion";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663135713175/7bAYv5QYZcia9BxhPhwv4f/hero-bg-VSR5gUSaEZkvMorofDbQxu.webp";
const PROFILE_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663135713175/7bAYv5QYZcia9BxhPhwv4f/profile-placeholder-cCvrmKH9X8w8hvca5V7rth.webp";

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
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex-shrink-0 order-1 md:order-2"
          >
            <div className="relative">
              <div className="w-52 h-64 md:w-64 md:h-80 rounded-2xl overflow-hidden border-2 border-[#2e7d4a]/40 shadow-2xl">
                <img
                  src={PROFILE_IMG}
                  alt="خليفة جمعة الرميثي"
                  className="w-full h-[130%] object-cover object-[center_15%]"
                  loading="eager"
                />
              </div>
              {/* Decorative frame */}
              <div className="absolute -top-3 -right-3 w-52 h-64 md:w-64 md:h-80 rounded-2xl border-2 border-[#2e7d4a]/30 -z-10" />
              {/* Decorative dot */}
              <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-[#2e7d4a] shadow-lg" />
            </div>
          </motion.div>

          {/* Text Content */}
          <div className="flex-1 text-center md:text-right order-2 md:order-1">
            {/* Small label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-block mb-4"
            >
              <span className="font-[Tajawal] text-[#7cc89a] text-sm tracking-wider uppercase">
                كاتب وصحفي إماراتي
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-[Amiri] text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
            >
              خليفة جمعة
              <br />
              <span className="text-[#7cc89a]">الرميثي</span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="font-[Cairo] text-lg md:text-xl text-white/70 max-w-lg mb-8 leading-relaxed"
            >
              أكثر من عشرين عاماً في عالم الصحافة والكتابة، أسعى من خلال الكلمة
              إلى إثراء الحوار المجتمعي وتسليط الضوء على القضايا التي تهم الإنسان العربي.
            </motion.p>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-4 justify-center md:justify-start"
            >
              <a
                href="https://instagram.com"
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
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f7f5f2] to-transparent" />
    </section>
  );
}
