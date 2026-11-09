import AnimatedSection from "./AnimatedSection";

const timeline = [
  { label: "التعليم", title: "درجة البكالوريوس من جامعة Hope", description: "تخرج من جامعة Hope في الولايات المتحدة الأمريكية بتخصص إدارة دولية." },
  { label: "التطوير", title: "ماجستير تنفيذي من جامعة هارفارد", description: "حاصل على ماجستير تنفيذي من جامعة هارفارد في القيادة والتطوير." },
  { label: "المسيرة", title: "خبرة مؤسسية وحضور إعلامي", description: "يعمل رئيساً تنفيذياً في إحدى المؤسسات الاستثمارية الإماراتية، ويكتب بانتظام في الصحف والمجلات الخليجية والعربية." },
];

export default function BioSection() {
  return (
    <section id="bio" className="section-spacing bio-section" aria-labelledby="bio-title">
      <div className="container bio-grid">
        <AnimatedSection>
          <p className="eyebrow">السيرة الذاتية</p>
          <h2 id="bio-title" className="section-title">بين الخبرة المؤسسية<br />وشغف الكتابة.</h2>
          <div className="bio-rule" aria-hidden="true" />
          <p className="section-copy">
            يجمع خليفة جمعة الرميثي بين الخبرة المؤسسية والإدارة الدولية والاهتمام الإعلامي.
            يكتب بانتظام في صحف إماراتية وخليجية وعربية، وتغطي مقالاته السياسة والاقتصاد والرياضة والشؤون الاجتماعية.
          </p>
          <p className="section-copy mt-5">
            عُرف بأسلوبه التحليلي الساخر، وقدّم مساهمات لافتة في تعزيز الحوار العام حول قضايا متنوعة في الاقتصاد والتنمية الاجتماعية والرياضة في المنطقة.
          </p>
        </AnimatedSection>
        <div className="bio-timeline">
          {timeline.map((item, index) => (
            <AnimatedSection key={item.label} delay={index * 50}>
              <div className="timeline-entry">
                <span className="timeline-index" aria-hidden="true">{["٠١", "٠٢", "٠٣"][index]}</span>
                <div>
                  <p className="eyebrow">{item.label}</p>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
