import { requireAdmin } from "../../_lib/auth.js";
import {
  requireRevision,
  validateArticle,
  validId,
  withYear,
} from "../../_lib/articles.js";
import {
  errorResponse,
  json,
  readJson,
  requireDatabase,
} from "../../_lib/http.js";

async function revisionFailure(database, id) {
  const current = await database
    .prepare("SELECT revision FROM articles WHERE id = ?")
    .bind(id)
    .first();
  return current
    ? json(
        {
          success: false,
          error:
            "تم تعديل المقال في جلسة أخرى. راجع النسخة الأحدث قبل حفظ التغييرات أو الحذف.",
          currentRevision: current.revision,
        },
        409
      )
    : json({ success: false, error: "المقال غير موجود." }, 404);
}

export async function onRequestGet(context) {
  try {
    const id = validId(context.params.id);
    const article = await requireDatabase(context.env)
      .prepare(
        "SELECT id, title, excerpt, content, date, category, newspaper, created_at, updated_at, revision FROM articles WHERE id = ?"
      )
      .bind(id)
      .first();
    return article
      ? json({ success: true, article: withYear(article) }, 200, {
          ETag: `"${article.revision}"`,
        })
      : json({ success: false, error: "المقال غير موجود." }, 404);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function onRequestPut(context) {
  try {
    await requireAdmin(context);
    const id = validId(context.params.id);
    const revision = requireRevision(context.request);
    const article = validateArticle(await readJson(context.request));
    const result = await context.env.DB.prepare(
      "UPDATE articles SET title = ?, excerpt = ?, content = ?, date = ?, category = ?, newspaper = ?, updated_at = datetime('now'), revision = revision + 1 WHERE id = ? AND revision = ? RETURNING revision"
    )
      .bind(
        article.title,
        article.excerpt,
        article.content,
        article.date,
        article.category,
        article.newspaper,
        id,
        revision
      )
      .first();
    return result
      ? json({ success: true, id, revision: result.revision }, 200, {
          ETag: `"${result.revision}"`,
        })
      : await revisionFailure(context.env.DB, id);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function onRequestDelete(context) {
  try {
    await requireAdmin(context);
    const id = validId(context.params.id);
    const revision = requireRevision(context.request);
    const result = await context.env.DB.prepare(
      "DELETE FROM articles WHERE id = ? AND revision = ? RETURNING id"
    )
      .bind(id, revision)
      .first();
    return result
      ? json({ success: true })
      : await revisionFailure(context.env.DB, id);
  } catch (error) {
    return errorResponse(error);
  }
}
