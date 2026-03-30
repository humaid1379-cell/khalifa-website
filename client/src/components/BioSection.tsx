/*
 * Design: Green Ink Press — Editorial newspaper style
 * Bio: CV-style timeline with warm background, newspaper-inspired dividers
 * Uses bio-section image as decorative element
 * CSS IntersectionObserver animations — no framer-motion
 */
import AnimatedSection from "./AnimatedSection";

const BIO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663135713175/7bAYv5QYZcia9BxhPhwv4f/bio-section-HoSNDkUUiaPXJoPEHGLXPP.webp";

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
    year: "الكتابة",
    title: "كاتب منتظم في الصحف العربية",
    description: "يكتب بانتظام في صحف إماراتية وخليجية وعربية، مقالاته متنوعة تغطي السياسة والاقتصاد والرياضة والشؤون الاجتماعية بأسلوب تحليلي ساخر مميز.",
  },
  {
    year: "الحالي",
    title: "كاتب منتظم في الصحف و المجلات الخليجية و العربية",
    description: "يكتب بانتظام في صحف ومجلات إماراتية وخليجية وعربية، مقالاته متنوعة تغطي السياسة والاقتصاد والرياضة والشؤون الاجتماعية بأسلوب تحليلي ساخر مميز.",
  },
];

const achievements = [
  "أسلوب تحليلي ساخر معروف في الأوساط الإعلامية العربية",
  "مساهمات لافتة في تعزيز الحوار العام حول الاقتصاد والتنمية الاجتماعية والرياضة",
  "كاتب منتظم في الصحف و المجلات الخليجية و العربية",
  "عضو جمعية الصحفيين الإماراتية",
  "عضو الاتحاد الدولي للصحفيين",
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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Timeline */}
          <div className="lg:col-span-2">
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

          {/* Achievements Card */}
          <div>
            <AnimatedSection delay={400}>
              <div className="bg-white rounded-xl p-6 shadow-md border border-[#e8f0ec] sticky top-24">
                <h3 className="font-[Amiri] text-lg font-bold text-[#0d3b1f] mb-4">
                  المميزات
                </h3>
                <div className="space-y-3">
                  {achievements.map((achievement, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#2e7d4a] flex-shrink-0 mt-2" />
                      <p className="font-[Cairo] text-sm text-[#4a6b5a] leading-relaxed">
                        {achievement}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Bio Paragraph */}
        <AnimatedSection delay={500} className="mt-14 bg-white rounded-xl p-8 border border-[#e8f0ec]">
          <p className="font-[Cairo] text-[#4a6b5a] leading-relaxed text-base">
            تخرج خليفة جمعة الرميثي من جامعة Hope في الولايات المتحدة الأمريكية بتخصص إدارة دولية، وحاصل على ماجستير تنفيذي من جامعة هارفارد في القيادة والتطوير. كاتب منتظم في الصحف و المجلات الخليجية و العربية.
          </p>
          <p className="font-[Cairo] text-[#4a6b5a] leading-relaxed text-base mt-4">
            يكتب بانتظام في صحف إماراتية وخليجية وعربية، مقالاته متنوعة تغطي السياسة والاقتصاد والرياضة والشؤون الاجتماعية. عُرف بأسلوبه التحليلي الساخر، وقدّم مساهمات لافتة في تعزيز الحوار العام حول قضايا منوعة في الاقتصاد والتنمية الاجتماعية والرياضة في المنطقة.
          </p>
          <p className="font-[Cairo] text-[#4a6b5a] leading-relaxed text-base mt-4">
            عضوا جمعية الصحفيين الإماراتية وعضوا الاتحاد الدولي لصحفيين.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
