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

// Article content is served by Cloudflare D1. No synthetic fallback articles.
