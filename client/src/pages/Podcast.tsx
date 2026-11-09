import { ArrowLeft, Instagram } from "lucide-react";
import { SITE } from "@/config/site";
import KharijLogo from "@/components/KharijLogo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PodcastPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <section className="podcast-page" aria-labelledby="podcast-page-title">
          <div className="container podcast-grid">
            <div>
              <p className="eyebrow">بودكاست خارج النص</p>
              <h1 id="podcast-page-title" className="section-title">قريباً،<br />نلتقي بالصوت.</h1>
              <p className="section-copy">البودكاست قيد التحضير. سنعلن عن موعد الإطلاق والحلقات الجديدة عبر حساب انستغرام.</p>
              <a className="editorial-button editorial-button--light mt-8" href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer"><Instagram size={18} aria-hidden="true" /> تابع أخبار الإطلاق<span className="sr-only"> — يفتح في نافذة جديدة</span></a>
              <a href="/archive" className="podcast-archive-link">إلى أن نلتقي، اقرأ المقالات <ArrowLeft size={17} aria-hidden="true" /></a>
            </div>
            <div className="podcast-art">
              <div className="podcast-disc"><KharijLogo variant="podcast" color="beige" /></div>
              <div className="podcast-status"><span aria-hidden="true" /> قيد التحضير</div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
