import { requireAdmin } from "../_lib/auth.js";
import { validateArticle, validId, withYear } from "../_lib/articles.js";
import {
  errorResponse,
  json,
  readJson,
  requireDatabase,
} from "../_lib/http.js";

export async function onRequestGet(context) {
  try {
    const { results } = await requireDatabase(context.env)
      .prepare(
        "SELECT id, title, excerpt, content, date, category, newspaper, created_at, updated_at, revision FROM articles ORDER BY date DESC, created_at DESC"
      )
      .all();
    return json({ success: true, articles: (results || []).map(withYear) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function onRequestPost(context) {
  try {
    await requireAdmin(context);
    const body = await readJson(context.request);
    const id = validId(body.id);
    const article = validateArticle(body);
    // The insert decides ownership atomically, including simultaneous retries.
    const result = await context.env.DB.prepare(
      "INSERT INTO articles (id, title, excerpt, content, date, category, newspaper) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING"
    )
      .bind(
        id,
        article.title,
        article.excerpt,
        article.content,
        article.date,
        article.category,
        article.newspaper
      )
      .run();
    if (result.meta.changes)
      return json({ success: true, id, revision: 1 }, 201);
    const exists = await context.env.DB.prepare(
      "SELECT title, excerpt, content, date, category, newspaper, revision FROM articles WHERE id = ?"
    )
      .bind(id)
      .first();
    const unchanged =
      exists &&
      Object.keys(article).every(key => (exists[key] || "") === article[key]);
    return unchanged
      ? json({ success: true, id, revision: exists.revision })
      : json({ success: false, error: "يوجد مقال بهذا المعرّف بالفعل." }, 409);
  } catch (error) {
    return errorResponse(error);
  }
}
