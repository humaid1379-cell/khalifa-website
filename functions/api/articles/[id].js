import { requireAdmin } from "../../_lib/auth.js";
import { validateArticle, validId, withYear } from "../../_lib/articles.js";
import {
  errorResponse,
  json,
  readJson,
  requireDatabase,
} from "../../_lib/http.js";

export async function onRequestGet(context) {
  try {
    const id = validId(context.params.id);
    const article = await requireDatabase(context.env)
      .prepare(
        "SELECT id, title, excerpt, content, date, category, newspaper, created_at, updated_at FROM articles WHERE id = ?"
      )
      .bind(id)
      .first();
    return article
      ? json({ success: true, article: withYear(article) })
      : json({ success: false, error: "المقال غير موجود." }, 404);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function onRequestPut(context) {
  try {
    await requireAdmin(context);
    const id = validId(context.params.id);
    const article = validateArticle(await readJson(context.request));
    const result = await context.env.DB.prepare(
      "UPDATE articles SET title = ?, excerpt = ?, content = ?, date = ?, category = ?, newspaper = ?, updated_at = datetime('now') WHERE id = ?"
    )
      .bind(
        article.title,
        article.excerpt,
        article.content,
        article.date,
        article.category,
        article.newspaper,
        id
      )
      .run();
    return result.meta.changes
      ? json({ success: true })
      : json({ success: false, error: "المقال غير موجود." }, 404);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function onRequestDelete(context) {
  try {
    await requireAdmin(context);
    const id = validId(context.params.id);
    const result = await context.env.DB.prepare(
      "DELETE FROM articles WHERE id = ?"
    )
      .bind(id)
      .run();
    return result.meta.changes
      ? json({ success: true })
      : json({ success: false, error: "المقال غير موجود." }, 404);
  } catch (error) {
    return errorResponse(error);
  }
}
