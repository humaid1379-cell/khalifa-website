/*
 * Design: Green Ink Press — Editorial newspaper style
 * Bio: CV-style timeline with warm background, newspaper-inspired dividers
 * Uses bio-section image as decorative element
 * Animated with framer-motion
 */
import { motion } from "framer-motion";

const BIO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663135713175/7bAYv5QYZcia9BxhPhwv4f/bio-section-HoSNDkUUiaPXJoPEHGLXPP.webp";

const timeline = [
  {
    year: "2003 - 2008",
    title: "بداية المسيرة الصحفية",
    description: "بدأ مسيرته في جريدة الاتحاد كمحرر صحفي، حيث تدرج في العمل الصحفي من التغطيات الميدانية إلى كتابة التحقيقات.",
  },
  {
    year: "2008 - 2013",
    title: "رئيس قسم الرأي",
    description: "تولى رئاسة قسم الرأي في جريدة البيان، وأشرف على صفحة المقالات الأسبوعية وساهم في تطوير المحتوى التحريري.",
  },
  {
    year: "2013 - 2018",
    title: "كاتب عمود أسبوعي",
    description: "كتب عموداً أسبوعياً في صحيفة الإمارات اليوم تناول فيه قضايا المجتمع والثقافة والتنمية، وحظي بمتابعة واسعة.",
  },
  {
    year: "2018 - 2022",
    title: "مستشار إعلامي",
    description: "عمل مستشاراً إعلامياً لعدة مؤسسات حكومية وخاصة، وساهم في صياغة الاستراتيجيات الإعلامية وتطوير المحتوى.",
  },
  {
    year: "2022 - الحاضر",
    title: "كاتب مستقل ومؤثر",
    description: "يواصل الكتابة عبر منصات متعددة، ويصل أسبوعياً إلى آلاف القراء عبر مقالاته على واتساب وحساباته على وسائل التواصل.",
  },
];

const achievements = [
  "جائزة أفضل مقال صحفي — نادي الصحافة العربية 2015",
  "عضو اتحاد الصحفيين العرب",
  "أكثر من 500 مقال منشور في الصحف الإماراتية",
  "مشارك في أكثر من 30 مؤتمراً إعلامياً دولياً",
];

export default function BioSection() {
  return (
    <section id="bio" className="py-20 md:py-28 bg-[#f7f5f2]">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-[Amiri] text-3xl md:text-4xl font-bold text-[#0d3b1f] mb-4">
            السيرة الذاتية
          </h2>
          <div className="divider-double mx-auto mb-6" />
          <p className="font-[Cairo] text-[#4a6b5a] max-w-2xl mx-auto leading-relaxed">
            مسيرة مهنية حافلة بالإنجازات في عالم الصحافة والكتابة
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left: Image + Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-5/12"
          >
            {/* Bio Image */}
            <div className="rounded-xl overflow-hidden shadow-lg mb-8">
              <img
                src={BIO_IMG}
                alt="مكتب صحفي"
                className="w-full h-56 md:h-72 object-cover"
                loading="lazy"
              />
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#d4edda]">
              <h3 className="font-[Amiri] text-xl font-bold text-[#0d3b1f] mb-4">
                الإنجازات والعضويات
              </h3>
              <ul className="space-y-3">
                {achievements.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 mt-2.5 rounded-full bg-[#2e7d4a]" />
                    <span className="font-[Cairo] text-sm text-[#3a5a4a] leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Right: Timeline */}
          <div className="lg:w-7/12">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute top-0 bottom-0 right-[19px] w-0.5 bg-[#d4edda]" />

              {timeline.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative flex gap-6 mb-10 last:mb-0"
                >
                  {/* Dot */}
                  <div className="flex-shrink-0 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-[#2e7d4a] flex items-center justify-center shadow-md">
                      <div className="w-3 h-3 rounded-full bg-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-white rounded-xl p-5 shadow-sm border border-[#e8f0ec] hover:shadow-md transition-shadow duration-300">
                    <span className="font-[Tajawal] text-xs text-[#2e7d4a] font-medium bg-[#e8f5e9] px-3 py-1 rounded-full">
                      {item.year}
                    </span>
                    <h3 className="font-[Amiri] text-lg font-bold text-[#0d3b1f] mt-3 mb-2">
                      {item.title}
                    </h3>
                    <p className="font-[Cairo] text-sm text-[#4a6b5a] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
