/*
 * Design: Green Ink Press — Editorial newspaper style
 * Bio: CV-style timeline with warm background, newspaper-inspired dividers
 * CSS IntersectionObserver animations — no framer-motion
 */
import AnimatedSection from "./AnimatedSection";

const timeline = [
  {
    year: "التعليم",
    title: "درجة البكالوريوس من جامعة Hope",
    description: "تخرج من جامعة Hope في الولايات المتحدة الأمريكية بتخصص إدارة دولية، حيث اكتسب فهماً عميقاً للعلاقات الاقتصادية والسياسية العالمية.",
  },
  {
    year: "التطوير",
    title: "ماجستير تنفيذي من جامعة هارفارد",
    description: "حاصل على ماجستير تنفيذي من جامعة هارفارد في القيادة والتطوير، مما عزز خبرته في الإدارة الاستراتيجية والقيادة المؤسسية.",
  },
  {
    year: "الحالي",
    title: "كاتب منتظم في الصحف و المجلات الخليجية و العربية",
    description: "يكتب بانتظام في صحف ومجلات إماراتية وخليجية وعربية، مقالاته متنوعة تغطي السياسة والاقتصاد والرياضة والشؤون الاجتماعية بأسلوب تحليلي ساخر مميز.",
  },
];

export default function BioSection() {
  return (
    <section id="bio" className="py-20 md:py-28 bg-[#f7f5f2]">
      <div className="container">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-14">
          <h2 className="font-[Amiri] text-3xl md:text-4xl font-bold text-[#0d3b1f] mb-4">
            السيرة الذاتية
          </h2>
          <div className="divider-double mx-auto mb-6" />
          <p className="font-[Cairo] text-[#4a6b5a] max-w-2xl mx-auto leading-relaxed">
            مسيرة مهنية متميزة تجمع بين التعليم العالمي والخبرة المؤسسية والشغف الإعلامي
          </p>
        </AnimatedSection>

        {/* Timeline — full width now that achievements card is removed */}
        <div className="max-w-2xl">
          <div className="space-y-8">
            {timeline.map((item, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="flex gap-6">
                  {/* Timeline dot and line */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-4 h-4 rounded-full bg-[#2e7d4a] shadow-md" />
                    {i < timeline.length - 1 && (
                      <div className="w-0.5 h-24 bg-gradient-to-b from-[#2e7d4a] to-[#2e7d4a]/30 mt-2" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-4">
                    <span className="inline-block font-[Tajawal] text-xs text-[#2e7d4a] bg-[#e8f0ec] px-3 py-1 rounded-full mb-2">
                      {item.year}
                    </span>
                    <h3 className="font-[Amiri] text-xl font-bold text-[#0d3b1f] mb-2">
                      {item.title}
                    </h3>
                    <p className="font-[Cairo] text-[#4a6b5a] leading-relaxed text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        {/* Bio Paragraph */}
        <AnimatedSection delay={400} className="mt-14 bg-white rounded-xl p-8 border border-[#e8f0ec] max-w-2xl">
          <p className="font-[Cairo] text-[#4a6b5a] leading-relaxed text-base">
            تخرج من جامعة Hope في الولايات المتحدة الامريكية بتخصص ادارة دولية . وحاصل على ماجستير تنفيذي من جامعة هارفارد في القيادة والتطوير . ويعمل رئيس تنفيذي في إحدى المؤسسات الاستثمارية الإماراتية.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
