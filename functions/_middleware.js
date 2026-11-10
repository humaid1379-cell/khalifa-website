import { normalizedPath, pageMetadata, safeJson, sitemapResponse } from "./_lib/seo.js";

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  if (!["GET", "HEAD"].includes(request.method) || url.pathname.startsWith("/api/"))
    return context.next();

  const path = normalizedPath(url.pathname);
  if (path !== url.pathname) {
    const destination = new URL(url);
    destination.pathname = path;
    return Response.redirect(destination.href, 308);
  }
  if (path === "/sitemap.xml") {
    const response = await sitemapResponse(request, env.DB);
    return request.method === "HEAD" ? new Response(null, response) : response;
  }

  // A cached SPA shell validator says nothing about current article metadata.
  // Fetch the complete shell so conditional requests cannot turn a stale/static
  // 304 into an empty document or skip the route's current 404/503 status.
  const shellRequest = new Request(request);
  for (const header of ["If-None-Match", "If-Modified-Since", "Range", "If-Range"])
    shellRequest.headers.delete(header);
  const response = await context.next(shellRequest);
  if (response.status !== 200 || !response.headers.get("Content-Type")?.includes("text/html")) return response;
  let article = null;
  let unavailable = false;
  const match = /^\/articles\/([a-zA-Z0-9_-]{1,100})$/.exec(path);
  if (match) {
    try {
      if (!env.DB) throw new Error("Database unavailable");
      article = await env.DB.prepare("SELECT id, title, excerpt, content, date, updated_at FROM articles WHERE id = ?").bind(match[1]).first();
    } catch {
      unavailable = true;
    }
  }
  const metadata = pageMetadata(url, article, unavailable);
  const headers = new Headers(response.headers);
  headers.delete("Content-Length");
  headers.delete("ETag");
  headers.delete("Last-Modified");
  headers.set("Cache-Control", "no-cache");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "SAMEORIGIN");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  headers.set("X-Robots-Tag", url.hostname.endsWith(".pages.dev") ? "noindex,follow" : metadata.robots);
  if (unavailable) headers.set("Retry-After", "60");
  const document = new Response(response.body, { status: metadata.status, headers });
  if (request.method === "HEAD") return new Response(null, document);
  const rewriter = new HTMLRewriter()
    .on("title", { element: element => element.setInnerContent(metadata.title) })
    .on('link[rel="canonical"]', { element: element => element.setAttribute("href", metadata.canonical) })
    .on('meta[name="description"], meta[property="og:description"]', { element: element => element.setAttribute("content", metadata.description) })
    .on('meta[property="og:title"]', { element: element => element.setAttribute("content", metadata.title) })
    .on('meta[property="og:url"]', { element: element => element.setAttribute("content", metadata.canonical) })
    .on('meta[property="og:type"]', { element: element => element.setAttribute("content", metadata.type) })
    .on('meta[name="robots"]', { element: element => element.setAttribute("content", metadata.robots) })
    .on('link[rel="preload"][as="image"]', { element: element => { if (path !== "/") element.remove(); } })
    .on("head", { element: element => {
      if (metadata.schema) element.append(`<script id="article-schema" type="application/ld+json">${safeJson(metadata.schema)}</script>`, { html: true });
    } });
  return rewriter.transform(document);
}
