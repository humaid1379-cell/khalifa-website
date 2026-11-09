export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...headers,
    },
  });
}

export function errorResponse(error) {
  if (error instanceof HttpError)
    return json({ success: false, error: error.message }, error.status);
  return json(
    { success: false, error: "الخدمة غير متاحة مؤقتاً. يرجى المحاولة لاحقاً." },
    503
  );
}

export function requireSameOrigin(request) {
  const origin = request.headers.get("Origin");
  if (
    !origin ||
    origin !== new URL(request.url).origin ||
    request.headers.get("Sec-Fetch-Site") === "cross-site"
  ) {
    throw new HttpError(403, "هذا الطلب غير مسموح.");
  }
}

export async function readJson(request, maximum = 262144) {
  if (
    !(
      request.headers
        .get("Content-Type")
        ?.split(";")[0]
        .trim()
        .toLowerCase() === "application/json"
    )
  )
    throw new HttpError(415, "صيغة الطلب غير مدعومة.");
  if (Number(request.headers.get("Content-Length")) > maximum)
    throw new HttpError(413, "حجم المحتوى أكبر من المسموح.");
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "بيانات الطلب غير صالحة.");
  let bytes = 0;
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > maximum) {
      await reader.cancel();
      throw new HttpError(413, "حجم المحتوى أكبر من المسموح.");
    }
    chunks.push(value);
  }
  const buffer = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.length;
  }
  try {
    const data = JSON.parse(new TextDecoder().decode(buffer));
    if (!data || typeof data !== "object" || Array.isArray(data))
      throw new Error();
    return data;
  } catch {
    throw new HttpError(400, "بيانات الطلب غير صالحة.");
  }
}

export function requireDatabase(env) {
  if (!env.DB) throw new HttpError(503, "الخدمة غير متاحة مؤقتاً.");
  return env.DB;
}
