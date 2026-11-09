import { ArrowUpLeft, Instagram, MessageCircle } from "lucide-react";
import { SITE, whatsappUrl } from "@/config/site";
import AnimatedSection from "./AnimatedSection";

export default function ContactSection() {
  return (
    <section id="contact" className="section-spacing contact-section" aria-labelledby="contact-title">
      <div className="container contact-grid">
        <AnimatedSection>
          <p className="eyebrow">نبقى على تواصل</p>
          <h2 id="contact-title" className="section-title">للكلمات بقية.<br />وللحوار مساحة.</h2>
          <p className="section-copy">يسعدني التواصل معكم، وقراءة آرائكم وملاحظاتكم.</p>
        </AnimatedSection>
        <AnimatedSection className="contact-links" delay={60}>
          <a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer" className="contact-link">
            <Instagram size={26} strokeWidth={1.5} aria-hidden="true" />
            <span><strong>انستغرام</strong><span dir="ltr">@{SITE.instagramHandle}</span></span>
            <ArrowUpLeft size={22} aria-hidden="true" />
            <span className="sr-only">يفتح في نافذة جديدة</span>
          </a>
          {whatsappUrl && (
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="contact-link">
              <MessageCircle size={26} strokeWidth={1.5} aria-hidden="true" />
              <span><strong>واتساب</strong><span dir="ltr">+{SITE.whatsappNumber}</span></span>
              <ArrowUpLeft size={22} aria-hidden="true" />
              <span className="sr-only">يفتح في نافذة جديدة</span>
            </a>
          )}
          <p className="contact-note">تابع جديد المقالات وأخبار «خارج النص» عبر الحساب.</p>
        </AnimatedSection>
      </div>
    </section>
  );
}
