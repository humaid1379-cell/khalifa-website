import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { normalizedPath, canonicalUrl, pageMetadata, safeJson, sitemapResponse } from "../functions/_lib/seo.js";
import { onRequest } from "../functions/_middleware.js";

const url = path => new URL(path, "https://khaleefa-alromaithi11.ae");
function database() {
  const db = new DatabaseSync(":memory:");
  db.exec("CREATE TABLE articles (id TEXT PRIMARY KEY, updated_at TEXT)");
  return { db, prepare(sql) {
    let values = [];
    return { bind(...v) { values = v; return this; },
      async first() { return db.prepare(sql).get(...values); },
      async all() { return { results: db.prepare(sql).all(...values) }; } };
  } };
}

test("route normalization preserves case-sensitive article identifiers", () => {
  assert.equal(normalizedPath("/Archive/"), "/archive");
  assert.equal(normalizedPath("/PODCAST//"), "/podcast");
  assert.equal(normalizedPath("/Articles/Mixed_Case-12/"), "/articles/Mixed_Case-12");
  assert.equal(normalizedPath("/"), "/");
});

test("canonical pages retain valid pagination and discard filters and tracking", () => {
  assert.equal(canonicalUrl(url("/archive?q=test&category=Opinion&page=2&utm_source=x")), "https://khaleefa-alromaithi11.ae/archive?page=2");
  for (const value of ["1", "-1", "NaN", "Infinity", "2.5", "99999999", "01"])
    assert.equal(canonicalUrl(url(`/archive?page=${value}`)), "https://khaleefa-alromaithi11.ae/archive");
  assert.equal(pageMetadata(url("/archive?q=test")).robots, "noindex,follow");
  assert.equal(pageMetadata(url("/archive?page=2")).robots, "index,follow");
  const unusual = new URL("https://khaleefa-alromaithi11.ae//example.net/x");
  assert.equal(new URL(canonicalUrl(unusual)).origin, "https://khaleefa-alromaithi11.ae");
  assert.doesNotThrow(() => canonicalUrl(new URL("https://khaleefa-alromaithi11.ae//[/x")));
});

test("metadata distinguishes valid pages, missing articles and backend outages", () => {
  assert.equal(pageMetadata(url("/archive/")).title, "أرشيف المقالات | خارج النص");
  assert.equal(pageMetadata(url("/archive/")).status, 200);
  assert.equal(pageMetadata(url("/admin")).robots, "noindex,nofollow");
  assert.equal(pageMetadata(url("/does-not-exist")).status, 404);
  assert.equal(pageMetadata(url("/articles/missing")).status, 404);
  const outage = pageMetadata(url("/articles/id"), null, true);
  assert.equal(outage.status, 503);
  assert.equal(outage.robots, "noindex,follow");
});

test("article metadata uses actual content and safely serializes script delimiters", () => {
  const article = { title: 'عنوان </script><script>alert(1)</script>', excerpt: '" & مقتطف', content: "النص", date: "2026-11-10", updated_at: "2026-11-10 08:00:00" };
  const meta = pageMetadata(url("/articles/One"), article);
  assert.equal(meta.title, `${article.title} | خارج النص`);
  assert.equal(meta.description, article.excerpt);
  assert.equal(meta.schema.dateModified, "2026-11-10T08:00:00Z");
  assert.equal(meta.status, 200);
  assert.equal(meta.type, "article");
  assert.equal(safeJson(meta.schema).includes("</script>"), false);
  assert.deepEqual(JSON.parse(safeJson(meta.schema)), meta.schema);
});

test("sitemap includes current article URLs and handles an unavailable database honestly", async () => {
  const db = database();
  db.db.prepare("INSERT INTO articles VALUES (?, ?)").run("article-One", "2026-11-10 08:00:00");
  const response = await sitemapResponse(new Request(url("/sitemap.xml")), db);
  assert.equal(response.status, 200);
  const xml = await response.text();
  assert.match(xml, /<loc>https:\/\/khaleefa-alromaithi11.ae\/articles\/article-One<\/loc>/);
  assert.match(xml, /<lastmod>2026-11-10<\/lastmod>/);
  assert.equal((xml.match(/<url>/g) || []).length, 4);
  const outage = await sitemapResponse(new Request(url("/sitemap.xml")), undefined);
  assert.equal(outage.status, 503);
  assert.equal(outage.headers.get("Cache-Control"), "no-store");
  db.db.close();
});

test("large sitemaps use bounded chunks and reject nonexistent pages", async () => {
  const db = database();
  db.db.exec("WITH RECURSIVE n(v) AS (SELECT 1 UNION ALL SELECT v+1 FROM n WHERE v<10001) INSERT INTO articles SELECT 'article-' || printf('%05d',v), '2026-11-10' FROM n");
  const index = await (await sitemapResponse(new Request(url("/sitemap.xml")), db)).text();
  assert.match(index, /<sitemapindex/);
  assert.match(index, /sitemap.xml\?page=2/);
  const second = await (await sitemapResponse(new Request(url("/sitemap.xml?page=2")), db)).text();
  assert.equal((second.match(/<url>/g) || []).length, 1);
  assert.match(second, /article-10001/);
  assert.equal((await sitemapResponse(new Request(url("/sitemap.xml?page=3")), db)).status, 404);
  db.db.close();
});

test("middleware redirects route variants without changing queries and bypasses API mutations", async () => {
  const redirect = await onRequest({ request: new Request(url("/Archive/?page=2")) });
  assert.equal(redirect.status, 308);
  assert.equal(redirect.headers.get("Location"), "https://khaleefa-alromaithi11.ae/archive?page=2");
  const marker = new Response("api");
  const result = await onRequest({ request: new Request(url("/api/articles/id"), { method: "PUT" }), next: () => marker });
  assert.equal(result, marker);
});

test("middleware strips static shell validators and preserves upstream errors and redirects", async () => {
  for (const status of [301, 503]) {
    const upstream = new Response("upstream", { status, headers: { "Content-Type": "text/html" } });
    const result = await onRequest({
      request: new Request(url("/archive"), { headers: { "If-None-Match": '"old-shell"', "If-Modified-Since": "yesterday", Range: "bytes=0-100" } }),
      next(request) {
        assert.equal(request.headers.has("If-None-Match"), false);
        assert.equal(request.headers.has("If-Modified-Since"), false);
        assert.equal(request.headers.has("Range"), false);
        return upstream;
      },
    });
    assert.equal(result, upstream);
  }
});
