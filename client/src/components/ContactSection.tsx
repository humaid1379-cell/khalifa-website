/*
 * Design: Kharij Al Nass — Warm editorial Arabic-first
 * Contact: Clean section with social links, WhatsApp, Instagram
 * Colors: #f1efd6 (bg), #87b0b6 (border/accent), #455a5d (text), #bf4240 (CTA)
 */
import { Instagram, MessageCircle, Send } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const contactMethods = [
  {
    icon: Instagram,
    label: "انستغرام",
    value: "@kjalromaithi",
    href: "https://instagram.com/kjalromaithi",
  },
  {
    icon: MessageCircle,
    label: "واتساب",
    value: "+971 50 000 0000",
    href: "https://wa.me/971500000000",
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 md:py-28 bg-[#f1efd6]">
      <div className="container">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-14">
          <h2 className="font-[Amiri] text-5xl md:text-7xl font-bold text-[#455a5d] mb-4">
            تواصل معي
          </h2>
          <div className="divider-double mx-auto mb-6" />
          <p className="font-[Amiri] text-[#455a5d]/70 max-w-2xl mx-auto leading-relaxed">
            يسعدني التواصل معكم عبر أي من القنوات التالية
          </p>
        </AnimatedSection>

        {/* Contact Cards — transparent bg, light blue border, dark blue text */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {contactMethods.map((method, i) => (
            <AnimatedSection key={method.label} delay={i * 100}>
              <a
                href={method.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl p-6 text-center bg-transparent border-2 border-[#87b0b6] hover:bg-[#87b0b6]/10 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-full bg-[#87b0b6]/15 flex items-center justify-center mx-auto mb-4">
                  <method.icon size={24} className="text-[#455a5d]" />
                </div>

                {/* Label */}
                <h3 className="font-[Amiri] text-lg font-bold text-[#455a5d] mb-2">
                  {method.label}
                </h3>

                {/* Value */}
                <p className="font-[Poppins] text-sm text-[#455a5d]/70" dir="ltr">
                  {method.value}
                </p>
              </a>
            </AnimatedSection>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <AnimatedSection delay={300} className="text-center mt-12">
          <p className="font-[Amiri] text-[#455a5d]/70 text-sm mb-4">
            للاشتراك في المقال الأسبوعي عبر واتساب
          </p>
          <a
            href="https://wa.me/971500000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#bf4240] hover:bg-[#bf4240]/85 text-white font-[Amiri] text-sm px-6 py-3 rounded-lg transition-colors shadow-md"
          >
            <Send size={16} />
            <span>اشترك الآن</span>
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
