import { ArrowDown, ArrowLeft } from "lucide-react";
import { SITE } from "@/config/site";

export default function HeroSection() {
  return (
    <section id="hero" className="editorial-hero" aria-labelledby="hero-title">
      <div className="hero-calligraphy" style={{ backgroundImage: `url("${SITE.calligraphyUrl}")` }} aria-hidden="true" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow"><span /> كتابةٌ تنظر أبعد</p>
          <h1 id="hero-title">{SITE.author}</h1>
          <p className="hero-statement">الواقع ليس<br /><span>كما تقرأه.</span></p>
          <p className="hero-description">
            إعلامي وكاتب في الصحف والمجلات الخليجية والعربية.
            يكتب في السياسة والاقتصاد والشؤون الاجتماعية بأسلوب تحليلي ساخر.
          </p>
          <div className="hero-actions">
            <a href="#articles" className="editorial-button editorial-button--light">اقرأ المقالات <ArrowLeft size={18} aria-hidden="true" /></a>
            <a href="#bio" className="hero-bio-link">تعرّف على الكاتب <ArrowDown size={16} aria-hidden="true" /></a>
          </div>
        </div>
        <figure className="hero-portrait">
          <div className="portrait-frame">
            <img src={SITE.portraitUrl} alt={SITE.author} width={600} height={750} fetchPriority="high" loading="eager" decoding="async" />
          </div>
          <figcaption><span>كاتب وصحفي إماراتي</span><span lang="en" dir="ltr">KHALEEFA AL ROMAITHI</span></figcaption>
        </figure>
      </div>
      <div className="container hero-bottom-line">
        <span>سياسة <span aria-hidden="true">/</span> اقتصاد <span aria-hidden="true">/</span> مجتمع</span>
        <a href="#articles">بين السطور، تبدأ الحكاية <ArrowDown size={15} aria-hidden="true" /></a>
      </div>
    </section>
  );
}
