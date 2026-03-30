export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
}

export const podcastEpisodes: PodcastEpisode[] = [
  {
    id: "1",
    title: "الحلقة الأولى: لماذا نكتب؟",
    description: "في هذه الحلقة الافتتاحية نتحدث عن دوافع الكتابة وأهمية الكلمة في تشكيل الوعي المجتمعي.",
    date: "قريباً",
    duration: "45 دقيقة",
  },
  {
    id: "2",
    title: "الحلقة الثانية: مستقبل الصحافة العربية",
    description: "حوار مع نخبة من الصحفيين العرب حول التحديات والفرص التي تواجه الصحافة في العصر الرقمي.",
    date: "قريباً",
    duration: "38 دقيقة",
  },
  {
    id: "3",
    title: "الحلقة الثالثة: قصص من الميدان",
    description: "تجارب صحفية حقيقية من الميدان، ودروس مستفادة من سنوات العمل في المؤسسات الإعلامية.",
    date: "قريباً",
    duration: "52 دقيقة",
  },
  {
    id: "4",
    title: "الحلقة الرابعة: الكتابة الإبداعية",
    description: "كيف يمكن للصحفي أن يطور أسلوبه الكتابي ويجعل مقالاته أكثر تأثيراً وجاذبية للقارئ.",
    date: "قريباً",
    duration: "41 دقيقة",
  },
];
