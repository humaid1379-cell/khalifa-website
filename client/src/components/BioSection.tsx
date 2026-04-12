/*
 * Design: Kharij Al Nass — Warm editorial Arabic-first
 * Bio: CV-style timeline with cream background, teal/red accents
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
    title: "إعلامي و كاتب في الصحف و المجلات الخليجية و العربية",
    description: "يكتب بانتظام في صحف ومجلات إماراتية وخليجية وعربية، مقالاته متنوعة تغطي السياسة والاقتصاد والشؤون الاجتماعية بأسلوب تحليلي ساخر.",
  },
];

export default function BioSection() {
  return (
    <section id="bio" className="py-12 md:py-24 bg-[#f1efd6]">
      <div className="container">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-10 md:mb-14">
          <h2 className="font-[Amiri] text-5xl md:text-7xl font-bold text-[#455a5d] mb-4">
            السيرة الذاتية
          </h2>
          {/* Double light blue line divider */}
          <div className="flex justify-center mb-6">
            <div className="relative h-[6px] w-48">
              <div className="absolute left-0 right-0 top-0 h-[2px]" style={{ backgroundColor: '#87b0b6' }} />
              <div className="absolute left-0 right-0 bottom-0 h-[2px]" style={{ backgroundColor: '#87b0b6' }} />
            </div>
          </div>
          <p className="font-[Amiri] text-[#5a7275] max-w-2xl mx-auto leading-relaxed">
            مسيرة مهنية متميزة تجمع بين التعليم العالمي والخبرة المؤسسية والشغف الإعلامي
          </p>
        </AnimatedSection>

        {/* Timeline */}
        <div className="max-w-2xl">
          <div className="space-y-6 md:space-y-8">
            {timeline.map((item, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="flex gap-4 md:gap-6">
                  {/* Timeline dot and line */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-[#bf4240] shadow-md mt-1" />
                    {i < timeline.length - 1 && (
                      <div className="w-0.5 flex-1 min-h-[40px] bg-gradient-to-b from-[#bf4240] to-[#bf4240]/30 mt-2" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-2 md:pb-4 flex-1 min-w-0">
                    <span className="inline-block font-[Amiri] text-xs text-[#bf4240] bg-[#bf4240]/10 px-3 py-1 rounded-full mb-2">
                      {item.year}
                    </span>
                    <h3 className="font-[Amiri] text-lg md:text-xl font-bold text-[#455a5d] mb-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="font-[Amiri] text-[#5a7275] leading-relaxed text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        {/* Bio Paragraph */}
        <AnimatedSection delay={400} className="mt-10 md:mt-14 bg-[#faf9f0] rounded-xl p-6 md:p-8 border border-[#d4d1b8] max-w-2xl">
          <p className="font-[Amiri] text-[#5a7275] leading-relaxed text-base">
            تخرج من جامعة Hope في الولايات المتحدة الامريكية بتخصص ادارة دولية . وحاصل على ماجستير تنفيذي من جامعة هارفارد في القيادة والتطوير . ويعمل رئيس تنفيذي في إحدى المؤسسات الاستثمارية الإماراتية.
          </p>
          <p className="font-[Amiri] text-[#5a7275] leading-relaxed text-base mt-4">
            يجمع بين الخبرة المؤسسية والادارة الدولية والاهتمام الإعلامي. يكتب بانتظام في صحف إماراتية وخليجية وعربية، مقالاته متنوعة تغطي السياسة والاقتصاد والرياضة والشؤون الاجتماعية. عُرف بأسلوبه التحليلي الساخر، وقدّم مساهمات لافتة في تعزيز الحوار العام حول قضايا منوعة في الاقتصاد والتنمية الاجتماعية والرياضة في المنطقة.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
