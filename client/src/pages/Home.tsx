import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { lazy, Suspense } from "react";

/* Lazy load below-the-fold sections — only HeroSection + Navbar are critical */
const BioSection = lazy(() => import("@/components/BioSection"));
const ArticlesSection = lazy(() => import("@/components/ArticlesSection"));
const PodcastSection = lazy(() => import("@/components/PodcastSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const Footer = lazy(() => import("@/components/Footer"));

function SectionFallback() {
  return <div className="min-h-[200px]" />;
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <Suspense fallback={<SectionFallback />}>
          <BioSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <ArticlesSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <PodcastSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <ContactSection />
        </Suspense>
      </main>
      <Suspense fallback={<SectionFallback />}>
        <Footer />
      </Suspense>
    </div>
  );
}
