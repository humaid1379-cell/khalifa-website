/*
 * Design: Kharij Al Nass — Warm editorial Arabic-first
 * Dedicated /podcast page — mirrors PodcastSection content with full-page layout
 *
 * Fixes applied:
 * - "البودكاست" heading changed to cream for contrast on teal (#3)
 * - Removed redundant "خارج النص" text below logo (#5)
 * - Reduced "قريباً" text size (#14)
 * - Back button arrow direction fixed for RTL: → instead of ← (#10)
 * - Back button uses solid border, not dashed (#1)
 * - Logo container uses mix-blend-mode to blend with teal (#4)
 */
import { useLocation } from "wouter";
import KharijLogo from "@/components/KharijLogo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ROSETTE_SVG = `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f1efd6'%3E%3Crect x='52' y='38' width='16' height='16' rx='2' transform='rotate(45 60 46)'/%3E%3Crect x='52' y='66' width='16' height='16' rx='2' transform='rotate(45 60 74)'/%3E%3Crect x='38' y='52' width='16' height='16' rx='2' transform='rotate(45 46 60)'/%3E%3Crect x='66' y='52' width='16' height='16' rx='2' transform='rotate(45 74 60)'/%3E%3Crect x='40' y='40' width='12' height='12' rx='2' transform='rotate(30 46 46)'/%3E%3Crect x='68' y='40' width='12' height='12' rx='2' transform='rotate(60 74 46)'/%3E%3Crect x='40' y='68' width='12' height='12' rx='2' transform='rotate(60 46 74)'/%3E%3Crect x='68' y='68' width='12' height='12' rx='2' transform='rotate(30 74 74)'/%3E%3C/g%3E%3C/svg%3E")`;

export default function PodcastPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f5f0e1" }}>
      <Navbar />

      {/* Main podcast hero — teal background matching homepage section */}
      <main className="flex-1">
        <section
          className="relative py-32 md:py-48 overflow-hidden flex items-center justify-center"
          style={{ backgroundColor: "#87b0b6", minHeight: "80vh" }}
        >
          {/* Decorative rosette pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{ backgroundImage: ROSETTE_SVG, backgroundRepeat: "repeat" }}
          />

          <div className="container relative z-10">
            {/* Section Header */}
            <div className="text-center mb-10">
              {/* Heading — cream text for contrast on teal (#3) */}
              <p className="font-[Amiri] text-lg uppercase tracking-[0.15em] text-[#f5f0e1]/70 mb-6">
                البودكاست
              </p>

              {/* Logo — blended with teal background (#4) */}
              <div className="flex justify-center mb-6">
                <div className="rounded-xl overflow-hidden" style={{ mixBlendMode: 'multiply' }}>
                  <KharijLogo variant="podcast" className="drop-shadow-xl" />
                </div>
              </div>

              {/* Removed redundant "خارج النص" heading — logo already shows it (#5) */}

              {/* Double divider */}
              <div className="flex justify-center mt-4 mb-8">
                <div className="relative h-[6px] w-48">
                  <div className="absolute left-0 right-0 top-0 h-[2px] bg-[#f5f0e1]/40" />
                  <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#f5f0e1]/40" />
                </div>
              </div>
            </div>

            {/* Coming Soon — reduced size (#14) */}
            <div className="text-center">
              <p className="font-[Amiri] text-4xl md:text-5xl font-bold text-[#f5f0e1] leading-tight">
                قريباً
              </p>
              <p className="font-[Amiri] text-[#f5f0e1]/60 text-sm mt-6 tracking-wider">
                سيتم إطلاق البودكاست قريباً
              </p>

              {/* Back to home — solid border, RTL arrow direction fixed (#1, #10) */}
              <button
                onClick={() => navigate("/")}
                className="mt-12 inline-flex items-center gap-2 border-2 border-[#f5f0e1]/50 hover:border-[#f5f0e1] hover:bg-[#f5f0e1]/10 text-[#f5f0e1]/80 hover:text-[#f5f0e1] px-6 py-2.5 rounded-lg transition-all duration-300 font-[Amiri] text-sm"
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
