export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  year: number;
}

export const categories = [
  "رأي",
  "مجتمع",
  "ثقافة",
  "اقتصاد",
  "تكنولوجيا",
  "رياضة",
  "تعليم",
  "بيئة",
];

/**
 * ONE example article kept for fallback display only.
 * All real articles are stored in and served from the Cloudflare D1 database.
 * To add articles, use the admin panel at /admin.
 */
export const articles: Article[] = [
  {
    id: "example-1",
    title: "مرحباً بكم في موقع خليفة جمعة الرميثي",
    excerpt: "هذا مقال نموذجي يظهر عند عدم توفر اتصال بقاعدة البيانات. يمكن للمدير إضافة المقالات الحقيقية من خلال لوحة الإدارة.",
    content: `هذا مقال نموذجي يظهر فقط عند عدم توفر اتصال بقاعدة البيانات.

لإضافة مقالاتك الحقيقية، يرجى:
١. الانتقال إلى لوحة الإدارة على الرابط: /admin
٢. تسجيل الدخول بكلمة المرور
٣. الضغط على "إضافة مقال جديد"

جميع المقالات المضافة من لوحة الإدارة ستظهر تلقائياً لجميع زوار الموقع على جميع الأجهزة.`,
    date: "2025-01-01",
    category: "رأي",
    year: 2025,
  },
];
