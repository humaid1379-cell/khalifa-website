import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BioSection from "@/components/BioSection";
import ArticlesSection from "@/components/ArticlesSection";
import PodcastSection from "@/components/PodcastSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

/* Decorative teal divider between cream sections — fix #8 */
function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-2" style={{ backgroundColor: '#f1efd6' }}>
      <div className="flex items-center gap-3 w-full max-w-xs mx-auto">
        <div className="flex-1 h-px bg-[#87b0b6]/30" />
        <div className="w-2 h-2 rotate-45 bg-[#87b0b6]/40" />
        <div className="flex-1 h-px bg-[#87b0b6]/30" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f1efd6' }}>
      <Navbar />
      <HeroSection />
      <SectionDivider />
      <BioSection />
      <SectionDivider />
      <ArticlesSection />
      <PodcastSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
