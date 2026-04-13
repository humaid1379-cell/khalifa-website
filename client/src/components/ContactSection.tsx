/*
 * Design: Kharij Al Nass — Warm editorial Arabic-first
 * Contact: Clean section with social links, WhatsApp, Instagram
 */
import { Instagram, MessageCircle, Send } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const contactMethods = [
  {
    icon: Instagram,
    label: "انستغرام",
    value: "@kjalromaithi",
    href: "https://instagram.com/kjalromaithi",
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
];

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 md:py-28 bg-[#f5f0e1]">
      <div className="container">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-14">
          <h2 className="font-[Amiri] text-5xl md:text-7xl font-bold text-[#3d5a45] mb-4">
            تواصل معي
          </h2>
          {/* Double light blue line divider */}
          <div className="flex justify-center mb-6">
            <div className="relative h-[6px] w-48">
              <div className="absolute left-0 right-0 top-0 h-[2px]" style={{ backgroundColor: '#87b07a' }} />
              <div className="absolute left-0 right-0 bottom-0 h-[2px]" style={{ backgroundColor: '#87b07a' }} />
            </div>
          </div>
          <p className="font-[Amiri] text-[#4a6b50] max-w-2xl mx-auto leading-relaxed">
            يسعدني التواصل معكم عبر أي من القنوات التالية
          </p>
        </AnimatedSection>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {contactMethods.map((method, i) => (
            <AnimatedSection key={method.label} delay={i * 100}>
              <a
                href={method.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`block bg-[#faf8f2] rounded-xl p-6 text-center shadow-sm border border-[#d4d1b8] ${method.bgHover} transition-all duration-300 hover:shadow-md hover:-translate-y-1 group`}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${method.color} flex items-center justify-center mx-auto mb-4 shadow-md`}>
                  <method.icon size={24} className="text-white" />
                </div>

                {/* Label */}
                <h3 className="font-[Amiri] text-lg font-bold text-[#3d5a45] mb-2">
                  {method.label}
                </h3>

                {/* Value */}
                <p className="font-[Poppins] text-sm text-[#4a6b50]" dir="ltr">
                  {method.value}
                </p>
              </a>
            </AnimatedSection>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <AnimatedSection delay={300} className="text-center mt-12">
          <p className="font-[Amiri] text-[#4a6b50] text-sm mb-4">
            للاشتراك في المقال الأسبوعي عبر واتساب
          </p>
          <a
            href="https://wa.me/971500000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#8b2e3b] hover:bg-[#731f2c] text-white font-[Amiri] text-sm px-6 py-3 rounded-lg transition-colors shadow-md"
          >
            <Send size={16} />
            <span>اشترك الآن</span>
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
