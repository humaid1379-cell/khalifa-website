/*
 * Design: Kharij Al Nass — Warm editorial Arabic-first (Final 2026 branding)
 * Dedicated /podcast page — mirrors PodcastSection content with full-page layout
 * Brand colors: #f1efd6 (beige), #bf4240 (red), #87b0b6 (blue), #455a5d (dark teal)
 * Uses brand pattern1 as background overlay
 */
import { useLocation } from "wouter";
import KharijLogo from "@/components/KharijLogo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PATTERN_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663135713175/7EAJf9X3KvFUwHgCUasNkN/pattern1_b9a20e8e.png";

export default function PodcastPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f1efd6" }}>
      <Navbar />

      {/* Main podcast hero — teal background matching homepage section */}
      <main className="flex-1">
        <section
          className="relative py-32 md:py-48 overflow-hidden flex items-center justify-center"
          style={{ backgroundColor: "#87b0b6", minHeight: "80vh" }}
        >
          {/* Decorative brand pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: `url("${PATTERN_URL}")`, backgroundRepeat: "repeat", backgroundSize: "300px" }}
          />

          <div className="container relative z-10">
            {/* Section Header */}
            <div className="text-center mb-10">
              {/* Heading — cream text for contrast on teal */}
              <p className="font-[Amiri] text-lg uppercase tracking-[0.15em] text-[#f1efd6]/70 mb-6">
                البودكاست
              </p>

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
            </div>

            {/* Coming Soon */}
            <div className="text-center">
              <p className="font-[Amiri] text-4xl md:text-5xl font-bold text-[#f1efd6] leading-tight">
                قريباً
              </p>
              <p className="font-[Amiri] text-[#f1efd6]/60 text-sm mt-6 tracking-wider">
                سيتم إطلاق البودكاست قريباً
              </p>

              {/* Back to home */}
              <button
                onClick={() => navigate("/")}
                className="mt-12 inline-flex items-center gap-2 border-2 border-[#f1efd6]/50 hover:border-[#f1efd6] hover:bg-[#f1efd6]/10 text-[#f1efd6]/80 hover:text-[#f1efd6] px-6 py-2.5 rounded-lg transition-all duration-300 font-[Amiri] text-sm"
              >
                العودة للرئيسية →
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
