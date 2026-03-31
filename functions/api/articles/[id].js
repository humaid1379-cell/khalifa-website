/**
 * Cloudflare Pages Function — /api/articles/:id
 * GET:    Get a single article by ID (public)
 * PUT:    Update an article (admin auth required)
 * DELETE: Delete an article (admin auth required)
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

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

// GET /api/articles/:id — get single article
export async function onRequestGet(context) {
  const { id } = context.params;

  try {
    const article = await context.env.DB.prepare(
      "SELECT * FROM articles WHERE id = ?"
    )
      .bind(id)
      .first();

    if (!article) {
      return jsonResponse({ success: false, error: "المقال غير موجود" }, 404);
    }

    return jsonResponse({ success: true, article });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

// PUT /api/articles/:id — update article
export async function onRequestPut(context) {
  if (!checkAuth(context.request)) {
    return jsonResponse({ success: false, error: "غير مصرح" }, 401);
  }

  const { id } = context.params;

  try {
    const body = await context.request.json();
    const { title, excerpt, content, date, category, year, newspaper } = body;

    if (!title || !content || !date || !category) {
      return jsonResponse({ success: false, error: "بيانات ناقصة" }, 400);
    }

    const result = await context.env.DB.prepare(
      `UPDATE articles
       SET title = ?, excerpt = ?, content = ?, date = ?, category = ?, year = ?, newspaper = ?, updated_at = datetime('now')
       WHERE id = ?`
    )
      .bind(title, excerpt || "", content, date, category, year || new Date(date).getFullYear(), newspaper || "", id)
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
