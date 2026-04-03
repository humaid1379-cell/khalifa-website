/**
 * Cloudflare Pages Function — /api/articles/:id
 * GET:    Get a single article by ID (public)
 * PUT:    Update an article (admin auth required)
 * DELETE: Delete an article (admin auth required)
 *
 * NOTE: Does NOT use the 'year' column — it may not exist in older D1 tables.
 * year is computed from the date field on the fly.
 */

const ADMIN_PASSWORD = "Khalifa@2025";
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
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

function yearFromDate(dateStr) {
  try {
    return new Date(dateStr).getFullYear();
  } catch {
    return new Date().getFullYear();
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

// GET /api/articles/:id — get single article
export async function onRequestGet(context) {
  const { id } = context.params;
  try {
    const article = await context.env.DB.prepare(
      "SELECT id, title, excerpt, content, date, category, newspaper, created_at FROM articles WHERE id = ?"
    )
      .bind(id)
      .first();

    if (!article) {
      return jsonResponse({ success: false, error: "المقال غير موجود" }, 404);
    }

    return jsonResponse({ success: true, article: { ...article, year: yearFromDate(article.date) } });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

// PUT /api/articles/:id — update article (no year column)
export async function onRequestPut(context) {
  if (!checkAuth(context.request)) {
    return jsonResponse({ success: false, error: "غير مصرح" }, 401);
  }

  const { id } = context.params;

  try {
    const body = await context.request.json();
    const { title, excerpt, content, date, category, newspaper } = body;

    if (!title || !content || !date || !category) {
      return jsonResponse({ success: false, error: "بيانات ناقصة" }, 400);
    }

    const result = await context.env.DB.prepare(
      `UPDATE articles
       SET title = ?, excerpt = ?, content = ?, date = ?, category = ?, newspaper = ?, updated_at = datetime('now')
       WHERE id = ?`
    )
      .bind(title, excerpt || "", content, date, category, newspaper || "", id)
      .run();

    if (result.meta.changes === 0) {
      return jsonResponse({ success: false, error: "المقال غير موجود" }, 404);
    }

    return jsonResponse({ success: true, message: "تم تحديث المقال بنجاح" });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

// DELETE /api/articles/:id — delete article
export async function onRequestDelete(context) {
  if (!checkAuth(context.request)) {
    return jsonResponse({ success: false, error: "غير مصرح" }, 401);
  }

  const { id } = context.params;

  try {
    const result = await context.env.DB.prepare(
      "DELETE FROM articles WHERE id = ?"
    )
      .bind(id)
      .run();

    if (result.meta.changes === 0) {
      return jsonResponse({ success: false, error: "المقال غير موجود" }, 404);
    }

    return jsonResponse({ success: true, message: "تم حذف المقال بنجاح" });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}
