import type { StoredArticle } from "./articleStorage";
import { parseArchiveState } from "./archiveState";

export const SITE_ORIGIN = "https://khaleefa-alromaithi11.ae";
const DESCRIPTION =
  "قراءات في السياسة والاقتصاد والمجتمع بقلم خليفة جمعة الرميثي.";
export type ReaderMetadataState = {
  id: string;
  status: "loading" | "ready" | "missing" | "error";
  article?: StoredArticle;
};
export interface PageMetadata {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  type: "website" | "article";
  articleSchema?: Record<string, unknown>;
}

export function normalizedRoute(pathname: string): string {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (/^\/(archive|podcast|admin|404)$/i.test(path)) return path.toLowerCase();
  return path.replace(/^\/articles\//i, "/articles/");
}

export function getPageMetadata(
  pathname: string,
  search = "",
  reader?: ReaderMetadataState
): PageMetadata {
  const path = normalizedRoute(pathname);
  const titles: Record<string, string> = {
    "/": "خليفة جمعة الرميثي | خارج النص",
    "/archive": "أرشيف المقالات | خارج النص",
    "/podcast": "البودكاست | خارج النص",
    "/admin": "إدارة الموقع | خارج النص",
  };
  const articleMatch = /^\/articles\/([^/]+)$/.exec(path);
  const metadata: PageMetadata = {
    title:
      titles[path] ||
      (articleMatch ? "المقال | خارج النص" : "الصفحة غير موجودة | خارج النص"),
    description: DESCRIPTION,
    canonical: `${SITE_ORIGIN}${path}`,
    robots:
      path === "/admin"
        ? "noindex,nofollow"
        : titles[path] || articleMatch
          ? "index,follow"
          : "noindex,follow",
    type: articleMatch ? "article" : "website",
  };
  if (path === "/archive") {
    const { page } = parseArchiveState(search);
    const params = new URLSearchParams(search);
    metadata.canonical += page > 1 ? `?page=${page}` : "";
    if (["q", "category", "year"].some(key => params.get(key)?.trim()))
      metadata.robots = "noindex,follow";
  }
  let articleId: string | undefined;
  try {
    articleId = articleMatch ? decodeURIComponent(articleMatch[1]) : undefined;
  } catch {
    /* Invalid route remains a missing article. */
  }
  if (!articleMatch || !reader || reader.id !== articleId) return metadata;
  if (reader.status === "missing" || reader.status === "error") {
    metadata.title =
      reader.status === "missing"
        ? "المقال غير موجود | خارج النص"
        : "تعذّر تحميل المقال | خارج النص";
    metadata.robots = "noindex,follow";
    metadata.type = "website";
    return metadata;
  }
  if (reader.status !== "ready" || !reader.article) return metadata;
  const article = reader.article;
  metadata.title = `${article.title} | خارج النص`;
  metadata.description = article.excerpt || article.content.slice(0, 160);
  metadata.canonical = `${SITE_ORIGIN}/articles/${encodeURIComponent(article.id)}`;
  metadata.articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: metadata.description,
    datePublished: article.date,
    ...(article.updated_at
      ? {
          dateModified: article.updated_at
            .replace(" ", "T")
            .replace(/(?<!Z)$/, "Z"),
        }
      : {}),
    author: { "@type": "Person", name: "خليفة جمعة الرميثي" },
    mainEntityOfPage: metadata.canonical,
    inLanguage: "ar",
    image: `${SITE_ORIGIN}/media/YmbibFaRiUfZjDYH.jpg`,
  };
  return metadata;
}

export function applyPageMetadata(metadata: PageMetadata): void {
  document.title = metadata.title;
  const setMeta = (
    attribute: "name" | "property",
    name: string,
    content: string
  ) => {
    let element = document.querySelector<HTMLMetaElement>(
      `meta[${attribute}="${name}"]`
    );
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute(attribute, name);
      document.head.append(element);
    }
    element.content = content;
  };
  let canonical = document.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]'
  );
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.append(canonical);
  }
  canonical.href = metadata.canonical;
  setMeta("name", "description", metadata.description);
  setMeta("name", "robots", metadata.robots);
  setMeta("property", "og:title", metadata.title);
  setMeta("property", "og:description", metadata.description);
  setMeta("property", "og:url", metadata.canonical);
  setMeta("property", "og:type", metadata.type);
  setMeta("name", "twitter:title", metadata.title);
  setMeta("name", "twitter:description", metadata.description);
  document.getElementById("article-schema")?.remove();
  if (metadata.articleSchema) {
    const schema = document.createElement("script");
    schema.id = "article-schema";
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify(metadata.articleSchema);
    document.head.append(schema);
  }
}
