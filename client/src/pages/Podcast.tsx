/*
 * Design: Kharij Al Nass — Warm editorial Arabic-first
 * Dedicated /podcast page — mirrors PodcastSection content with full-page layout
 */
import { useLocation } from "wouter";
import KharijLogo from "@/components/KharijLogo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ROSETTE_SVG = `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f1efd6'%3E%3Crect x='52' y='38' width='16' height='16' rx='2' transform='rotate(45 60 46)'/%3E%3Crect x='52' y='66' width='16' height='16' rx='2' transform='rotate(45 60 74)'/%3E%3Crect x='38' y='52' width='16' height='16' rx='2' transform='rotate(45 46 60)'/%3E%3Crect x='66' y='52' width='16' height='16' rx='2' transform='rotate(45 74 60)'/%3E%3Crect x='40' y='40' width='12' height='12' rx='2' transform='rotate(30 46 46)'/%3E%3Crect x='68' y='40' width='12' height='12' rx='2' transform='rotate(60 74 46)'/%3E%3Crect x='40' y='68' width='12' height='12' rx='2' transform='rotate(60 46 74)'/%3E%3Crect x='68' y='68' width='12' height='12' rx='2' transform='rotate(30 74 74)'/%3E%3C/g%3E%3C/svg%3E")`;

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
          {/* Decorative rosette pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{ backgroundImage: ROSETTE_SVG, backgroundRepeat: "repeat" }}
          />

          <div className="container relative z-10">
            {/* Section Header */}
            <div className="text-center mb-10">
              <p className="font-[Amiri] text-4xl md:text-6xl font-bold text-[#455a5d] mb-6">
                البودكاست
              </p>

              {/* Logo */}
              <div className="flex justify-center mb-6">
                <KharijLogo variant="podcast" className="drop-shadow-xl rounded-xl" />
              </div>

              <h1 className="font-[Amiri] text-4xl md:text-5xl font-bold text-[#f1efd6] mb-4">
                خارج النص
              </h1>

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
              <p className="font-[Amiri] text-6xl md:text-8xl font-bold text-[#f1efd6] leading-tight">
                قريباً
              </p>
              <p className="font-[Amiri] text-xl font-bold text-[#455a5d] mt-6">
                سيتم إطلاق البودكاست قريباً
              </p>

              {/* Back to home */}
              <button
                onClick={() => navigate("/")}
                className="mt-12 inline-flex items-center gap-2 border border-[#f1efd6]/40 hover:border-[#f1efd6]/80 text-[#f1efd6]/70 hover:text-[#f1efd6] px-6 py-2.5 rounded-lg transition-all duration-300 font-[Amiri] text-sm"
              >
                ← العودة للرئيسية
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
