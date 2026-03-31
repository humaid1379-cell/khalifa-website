/**
 * Cloudflare Pages Function — /api/seed
 * POST: Seed the database with initial hardcoded articles (admin auth required)
 * This is a one-time operation to populate the D1 database with existing articles.
 */

const ADMIN_PASSWORD = "Khalifa@2025";
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

function checkAuth(request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }
  return authHeader.slice(7) === ADMIN_PASSWORD;
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestPost(context) {
  if (!checkAuth(context.request)) {
    return jsonResponse({ success: false, error: "غير مصرح" }, 401);
  }

  try {
    const body = await context.request.json();
    const { articles } = body;

    if (!articles || !Array.isArray(articles) || articles.length === 0) {
      return jsonResponse({ success: false, error: "لا توجد مقالات للإضافة" }, 400);
    }

    // Check if articles already exist
    const { results: existing } = await context.env.DB.prepare(
      "SELECT COUNT(*) as count FROM articles"
    ).all();

    const existingCount = existing[0]?.count || 0;

    let inserted = 0;
    for (const article of articles) {
      try {
        await context.env.DB.prepare(
          `INSERT OR IGNORE INTO articles (id, title, excerpt, content, date, category, year, newspaper)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        )
          .bind(
            article.id,
            article.title,
            article.excerpt || "",
            article.content,
            article.date,
            article.category,
            article.year || new Date(article.date).getFullYear(),
            article.newspaper || ""
          )
          .run();
        inserted++;
      } catch (e) {
        // Skip duplicates
      }
    }

    return jsonResponse({
      success: true,
      message: `تم إضافة ${inserted} مقال. كان هناك ${existingCount} مقال موجود مسبقاً.`,
      inserted,
      existingCount,
    });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}
