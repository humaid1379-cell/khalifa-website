/*
 * Design: Green Ink Press — Editorial newspaper style
 * Contact: Clean section with social links, WhatsApp, email, Instagram
 * CSS IntersectionObserver animations — no framer-motion
 */
import { Instagram, MessageCircle, Mail, Send } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const contactMethods = [
  {
    icon: Instagram,
    label: "انستغرام",
    value: "@khalifa_alrumaiti",
    href: "https://instagram.com",
    color: "from-[#833AB4] via-[#FD1D1D] to-[#F77737]",
    bgHover: "hover:bg-[#833AB4]/10",
  },
  {
    icon: MessageCircle,
    label: "واتساب",
    value: "+971 50 000 0000",
    href: "https://wa.me/971500000000",
    color: "from-[#25D366] to-[#128C7E]",
    bgHover: "hover:bg-[#25D366]/10",
  },
  {
    icon: Mail,
    label: "البريد الإلكتروني",
    value: "khalifa@example.com",
    href: "mailto:khalifa@example.com",
    color: "from-[#2e7d4a] to-[#1b6b3a]",
    bgHover: "hover:bg-[#2e7d4a]/10",
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 md:py-28 bg-[#f7f5f2]">
      <div className="container">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-14">
          <h2 className="font-[Amiri] text-3xl md:text-4xl font-bold text-[#0d3b1f] mb-4">
            تواصل معي
          </h2>
          <div className="divider-double mx-auto mb-6" />
          <p className="font-[Cairo] text-[#4a6b5a] max-w-2xl mx-auto leading-relaxed">
            يسعدني التواصل معكم عبر أي من القنوات التالية
          </p>
        </AnimatedSection>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {contactMethods.map((method, i) => (
            <AnimatedSection key={method.label} delay={i * 100}>
              <a
                href={method.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`block bg-white rounded-xl p-6 text-center shadow-sm border border-[#e8f0ec] ${method.bgHover} transition-all duration-300 hover:shadow-md hover:-translate-y-1 group`}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${method.color} flex items-center justify-center mx-auto mb-4 shadow-md`}>
                  <method.icon size={24} className="text-white" />
                </div>

                {/* Label */}
                <h3 className="font-[Amiri] text-lg font-bold text-[#0d3b1f] mb-2">
                  {method.label}
                </h3>

                {/* Value */}
                <p className="font-[Cairo] text-sm text-[#4a6b5a]" dir="ltr">
                  {method.value}
                </p>
              </a>
            </AnimatedSection>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <AnimatedSection delay={300} className="text-center mt-12">
          <p className="font-[Cairo] text-[#4a6b5a] text-sm mb-4">
            للاشتراك في المقال الأسبوعي عبر واتساب
          </p>
          <a
            href="https://wa.me/971500000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-[Cairo] text-sm px-6 py-3 rounded-lg transition-colors shadow-md"
          >
            <Send size={16} />
            <span>اشترك الآن</span>
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
