import type { StoredArticle } from "./articleStorage";

/** Search tolerates Arabic diacritics, tatweel, and common alef/ya variants. */
export function normalizeSearch(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .toLocaleLowerCase("ar")
    .trim();
}

export function articleDate(value: string): string {
  const date = value.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return "";
  const parsed = new Date(`${date}T12:00:00Z`);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== date
  )
    return "";
  return parsed.toLocaleDateString("ar-AE", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Dubai",
  });
}

export function readingMinutes(content: string): number {
  return Math.max(
    1,
    Math.ceil(content.trim().split(/\s+/).filter(Boolean).length / 180)
  );
}

export function readingLabel(content: string): string {
  const minutes = readingMinutes(content);
  if (minutes === 1) return "دقيقة واحدة للقراءة";
  if (minutes === 2) return "دقيقتان للقراءة";
  return `${minutes.toLocaleString("ar-AE")} ${minutes <= 10 ? "دقائق" : "دقيقة"} للقراءة`;
}

export const articleHref = (id: string) =>
  `/articles/${encodeURIComponent(id)}`;
export const newestFirst = (articles: StoredArticle[]) =>
  [...articles].sort((a, b) => b.date.localeCompare(a.date));

export function filterArticles(
  articles: StoredArticle[],
  query: string,
  category: string,
  year: string
) {
  const search = normalizeSearch(query);
  return articles.filter(
    article =>
      (!category || article.category === category) &&
      (!year || article.date.startsWith(`${year}-`)) &&
      (!search ||
        normalizeSearch(
          `${article.title} ${article.excerpt} ${article.content} ${article.newspaper || ""}`
        ).includes(search))
  );
}
