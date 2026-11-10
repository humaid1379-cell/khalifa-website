import { HttpError } from "./http.js";

export function validId(id) {
  if (typeof id !== "string" || !/^[a-zA-Z0-9_-]{1,100}$/.test(id))
    throw new HttpError(400, "معرّف المقال غير صالح.");
  return id;
}

/** Only the exact revision the editor loaded may be changed or deleted. */
export function requireRevision(request) {
  const condition = request.headers.get("If-Match");
  if (condition === null)
    throw new HttpError(
      428,
      "يرجى إعادة تحميل المقال قبل حفظ التغييرات أو حذفه."
    );
  const match = /^"([1-9]\d*)"$/.exec(condition);
  const revision = match ? Number(match[1]) : NaN;
  if (!Number.isSafeInteger(revision) || revision >= Number.MAX_SAFE_INTEGER)
    throw new HttpError(400, "نسخة المقال غير صالحة.");
  return revision;
}

export function validateArticle(body) {
  const limits = {
    title: 300,
    excerpt: 1500,
    content: 100000,
    category: 80,
    newspaper: 300,
    date: 10,
  };
  const output = {};
  for (const [key, maximum] of Object.entries(limits)) {
    const value = body[key] ?? "";
    if (typeof value !== "string" || value.length > maximum)
      throw new HttpError(400, "يرجى مراجعة طول حقول المقال.");
    output[key] = value.trim();
  }
  if (!output.title || !output.content || !output.category)
    throw new HttpError(400, "العنوان والنص والتصنيف حقول مطلوبة.");
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(output.date) ||
    !Number.isFinite(Date.parse(`${output.date}T00:00:00Z`)) ||
    new Date(`${output.date}T00:00:00Z`).toISOString().slice(0, 10) !==
      output.date
  )
    throw new HttpError(400, "تاريخ النشر غير صالح.");
  return output;
}

export function withYear(article) {
  return { ...article, year: Number(String(article.date).slice(0, 4)) };
}
