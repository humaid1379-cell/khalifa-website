import { ArrowLeft, AudioLines } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import KharijLogo from "./KharijLogo";

export default function PodcastSection() {
  return (
    <section id="podcast" className="podcast-section section-spacing" aria-labelledby="podcast-title">
      <div className="container podcast-grid">
        <AnimatedSection>
          <p className="eyebrow"><AudioLines size={18} aria-hidden="true" /> البودكاست</p>
          <h2 id="podcast-title" className="section-title">خارج النص.<br /><span>قريباً، بالصوت.</span></h2>
          <p className="section-copy">سيتم إطلاق البودكاست قريباً. تابع الحساب لمعرفة موعد الإطلاق وجديد الحلقات.</p>
          <a href="/podcast" className="editorial-button editorial-button--outline mt-8">اكتشف البودكاست <ArrowLeft size={18} aria-hidden="true" /></a>
        </AnimatedSection>
        <AnimatedSection className="podcast-art" delay={80}>
          <div className="podcast-disc"><KharijLogo variant="podcast" color="beige" /></div>
          <div className="podcast-status"><span aria-hidden="true" /> قيد التحضير</div>
        </AnimatedSection>
      </div>
    </section>
  );
}
