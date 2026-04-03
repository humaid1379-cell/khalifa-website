/**
 * Cloudflare Pages Function — /api/articles
 * GET:  List all articles (public, no auth needed)
 * POST: Create a new article (admin auth required)
 */

const ADMIN_PASSWORD = "Khalifa@2025";
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS, ...extraHeaders },
  });
}

function checkAuth(request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }
  return authHeader.slice(7) === ADMIN_PASSWORD;
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

// GET /api/articles — list all articles
// Cache-Control: public, max-age=60 — CDN caches for 60s, stale-while-revalidate for 300s
export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB.prepare(
      `SELECT id, title, excerpt, content, date, category, year, newspaper, created_at
       FROM articles
       ORDER BY date DESC, created_at DESC
       LIMIT 500`
    ).all();

    return jsonResponse(
      { success: true, articles: results || [] },
      200,
      { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" }
    );
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

// POST /api/articles — create a new article
export async function onRequestPost(context) {
  if (!checkAuth(context.request)) {
    return jsonResponse({ success: false, error: "غير مصرح" }, 401);
  }

  try {
    const body = await context.request.json();
    const { id, title, excerpt, content, date, category, year, newspaper } = body;

    if (!id || !title || !content || !date || !category) {
      return jsonResponse({ success: false, error: "بيانات ناقصة" }, 400);
    }

    await context.env.DB.prepare(
      `INSERT INTO articles (id, title, excerpt, content, date, category, year, newspaper)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(id, title, excerpt || "", content, date, category, year || new Date(date).getFullYear(), newspaper || "")
      .run();

    return jsonResponse({ success: true, message: "تم إضافة المقال بنجاح" }, 201);
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}
