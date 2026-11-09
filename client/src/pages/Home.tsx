import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BioSection from "@/components/BioSection";
import ArticlesSection from "@/components/ArticlesSection";
import PodcastSection from "@/components/PodcastSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <HeroSection />
        <ArticlesSection />
        <BioSection />
        <PodcastSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
