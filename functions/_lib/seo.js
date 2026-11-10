const ORIGIN = "https://khaleefa-alromaithi11.ae";
const DESCRIPTION = "قراءات في السياسة والاقتصاد والمجتمع بقلم خليفة جمعة الرميثي.";
const TITLES = {
  "/": "خليفة جمعة الرميثي | خارج النص",
  "/archive": "أرشيف المقالات | خارج النص",
  "/podcast": "البودكاست | خارج النص",
  "/admin": "إدارة الموقع | خارج النص",
};

// Normalize route names, but never case-fold an opaque article identifier.
export function normalizedPath(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";
  const lower = path.toLowerCase();
  if (Object.hasOwn(TITLES, lower)) return lower;
  const article = /^\/articles\/([a-zA-Z0-9_-]{1,100})$/i.exec(path);
  if (article) return `/articles/${article[1]}`;
  if (lower === "/sitemap.xml") return lower;
  return path;
}

export function canonicalUrl(url) {
  const path = normalizedPath(url.pathname);
  const result = new URL(ORIGIN);
  result.pathname = path;
  if (path === "/archive") {
    const page = url.searchParams.get("page") || "";
    if (/^[1-9]\d{0,6}$/.test(page) && Number(page) > 1)
      result.searchParams.set("page", String(Number(page)));
  }
  return result.href;
}

export function pageMetadata(url, article = null, unavailable = false) {
  const path = normalizedPath(url.pathname);
  const isArticle = /^\/articles\/[^/]+$/.test(path);
  const known = Object.hasOwn(TITLES, path);
  const filtered = path === "/archive" && ["q", "category", "year"].some(key => url.searchParams.get(key)?.trim());
  const status = unavailable ? 503 : isArticle ? (article ? 200 : 404) : known ? 200 : 404;
  const title = unavailable ? "تعذّر تحميل المقال | خارج النص" : article ? `${article.title} | خارج النص` :
    TITLES[path] || (isArticle ? "المقال غير موجود | خارج النص" : "الصفحة غير موجودة | خارج النص");
  const description = article ? (article.excerpt || article.content.slice(0, 160)) : DESCRIPTION;
  return {
    title, description, status, canonical: canonicalUrl(url),
    type: article ? "article" : "website",
    robots: path === "/admin" ? "noindex,nofollow" : status !== 200 || filtered ? "noindex,follow" : "index,follow",
    schema: article ? {
      "@context": "https://schema.org", "@type": "Article",
      headline: article.title, description, inLanguage: "ar",
      datePublished: article.date,
      ...(article.updated_at ? { dateModified: String(article.updated_at).replace(" ", "T").replace(/(?<!Z)$/, "Z") } : {}),
      author: { "@type": "Person", name: "خليفة جمعة الرميثي" },
      mainEntityOfPage: canonicalUrl(url),
      image: `${ORIGIN}/media/YmbibFaRiUfZjDYH.jpg`,
    } : null,
  };
}

export function safeJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

export function xmlEscape(value) {
  return String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[character]);
}

const SITEMAP_SIZE = 10000;
export async function sitemapResponse(request, db) {
  try {
    if (!db) throw new Error("Database unavailable");
    const url = new URL(request.url);
    const count = await db.prepare("SELECT COUNT(*) AS count FROM articles").first();
    const pages = Math.max(1, Math.ceil(Number(count.count) / SITEMAP_SIZE));
    const requested = url.searchParams.get("page");
    let xml;
    if (!requested && pages > 1) {
      xml = `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Array.from({ length: pages }, (_, i) => `<sitemap><loc>${ORIGIN}/sitemap.xml?page=${i + 1}</loc></sitemap>`).join("")}</sitemapindex>`;
    } else {
      const page = requested ? Number(requested) : 1;
      if (!Number.isSafeInteger(page) || page < 1 || page > pages || (requested && !/^[1-9]\d*$/.test(requested)))
        return new Response("Sitemap not found", { status: 404, headers: { "X-Robots-Tag": "noindex", "Cache-Control": "no-store" } });
      const { results } = await db.prepare("SELECT id, updated_at FROM articles ORDER BY id LIMIT ? OFFSET ?")
        .bind(SITEMAP_SIZE, (page - 1) * SITEMAP_SIZE).all();
      const paths = page === 1 ? ["/", "/archive", "/podcast"] : [];
      const entries = paths.map(path => `<url><loc>${ORIGIN}${path}</loc></url>`);
      for (const article of results || []) {
        const date = String(article.updated_at || "").slice(0, 10);
        const modified = /^\d{4}-\d{2}-\d{2}$/.test(date) ? `<lastmod>${date}</lastmod>` : "";
        entries.push(`<url><loc>${ORIGIN}/articles/${xmlEscape(encodeURIComponent(article.id))}</loc>${modified}</url>`);
      }
      xml = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join("")}</urlset>`;
    }
    return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n${xml}`, { headers: {
      "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "no-cache", "X-Content-Type-Options": "nosniff",
    } });
  } catch {
    return new Response("Sitemap temporarily unavailable", { status: 503, headers: {
      "Cache-Control": "no-store", "Retry-After": "60", "X-Robots-Tag": "noindex", "X-Content-Type-Options": "nosniff",
    } });
  }
}
