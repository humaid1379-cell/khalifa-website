import { HttpError, requireDatabase, requireSameOrigin } from "./http.js";

export const COOKIE_NAME = "__Host-khalifa_session";
export const SESSION_SECONDS = 8 * 60 * 60;
export const LOGIN_WINDOW_SECONDS = 15 * 60;
export const LOGIN_LIMIT = 10;
const encoder = new TextEncoder();

function configuration(env) {
  if (
    typeof env.ADMIN_PASSWORD !== "string" ||
    env.ADMIN_PASSWORD.length < 16 ||
    typeof env.SESSION_SECRET !== "string" ||
    env.SESSION_SECRET.length < 32
  ) {
    throw new HttpError(
      503,
      "تسجيل الدخول غير متاح مؤقتاً. يرجى مراجعة إعدادات الموقع."
    );
  }
  requireDatabase(env);
}

async function digest(value) {
  return new Uint8Array(
    await crypto.subtle.digest("SHA-256", encoder.encode(value))
  );
}

export async function passwordMatches(password, expected) {
  const [a, b] = await Promise.all([digest(password), digest(expected)]);
  let difference = 0;
  for (let index = 0; index < a.length; index++)
    difference |= a[index] ^ b[index];
  return difference === 0;
}

async function keyedHash(value, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return Array.from(
    new Uint8Array(
      await crypto.subtle.sign("HMAC", key, encoder.encode(value))
    ),
    byte => byte.toString(16).padStart(2, "0")
  ).join("");
}

function cookieToken(request) {
  const cookie = request.headers.get("Cookie") || "";
  const token = cookie
    .split(";")
    .map(part => part.trim())
    .find(part => part.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);
  return /^[a-f0-9]{64}$/.test(token || "") ? token : null;
}

export function sessionCookie(token, maxAge = SESSION_SECONDS) {
  return `${COOKIE_NAME}=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Strict`;
}

export async function authenticate(context) {
  configuration(context.env);
  const token = cookieToken(context.request);
  if (!token) return false;
  const tokenHash = await keyedHash(
    `session:${token}`,
    context.env.SESSION_SECRET
  );
  const now = Math.floor(Date.now() / 1000);
  const session = await context.env.DB.prepare(
    "SELECT expires_at FROM admin_sessions WHERE token_hash = ? AND expires_at > ?"
  )
    .bind(tokenHash, now)
    .first();
  return Boolean(session);
}

export async function requireAdmin(context) {
  requireSameOrigin(context.request);
  if (!(await authenticate(context)))
    throw new HttpError(
      401,
      "انتهت الجلسة. يرجى تسجيل الدخول مجدداً؛ سيبقى النص محفوظاً في المحرر."
    );
}

export async function checkLoginRate(context) {
  configuration(context.env);
  const now = Math.floor(Date.now() / 1000);
  const windowStart =
    Math.floor(now / LOGIN_WINDOW_SECONDS) * LOGIN_WINDOW_SECONDS;
  // Cloudflare supplies this header at its edge. Hash IPs so the database does not retain raw addresses.
  const address = context.request.headers.get("CF-Connecting-IP") || "unknown";
  const key = await keyedHash(`login:${address}`, context.env.SESSION_SECRET);
  // Keep failed-login history bounded even when no administrator signs in.
  // The window_start index makes this an indexed range delete.
  await context.env.DB.prepare(
    "DELETE FROM admin_login_attempts WHERE window_start < ?"
  )
    .bind(now - 86400)
    .run();
  const row = await context.env.DB.prepare(
    `INSERT INTO admin_login_attempts (ip_hash, window_start, attempts)
    VALUES (?, ?, 1) ON CONFLICT(ip_hash) DO UPDATE SET
    attempts = CASE WHEN window_start = excluded.window_start THEN attempts + 1 ELSE 1 END,
    window_start = excluded.window_start RETURNING attempts`
  )
    .bind(key, windowStart)
    .first();
  if (!row || row.attempts > LOGIN_LIMIT)
    throw new HttpError(
      429,
      "محاولات كثيرة. يرجى الانتظار ١٥ دقيقة قبل المحاولة مجدداً."
    );
}

export async function createSession(context) {
  configuration(context.env);
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)), byte =>
    byte.toString(16).padStart(2, "0")
  ).join("");
  const tokenHash = await keyedHash(
    `session:${token}`,
    context.env.SESSION_SECRET
  );
  const now = Math.floor(Date.now() / 1000);
  await context.env.DB.batch([
    context.env.DB.prepare(
      "DELETE FROM admin_sessions WHERE expires_at <= ?"
    ).bind(now),
    context.env.DB.prepare(
      "INSERT INTO admin_sessions (token_hash, expires_at) VALUES (?, ?)"
    ).bind(tokenHash, now + SESSION_SECONDS),
  ]);
  return token;
}

export async function revokeSession(context) {
  configuration(context.env);
  const token = cookieToken(context.request);
  if (!token) return;
  const tokenHash = await keyedHash(
    `session:${token}`,
    context.env.SESSION_SECRET
  );
  await context.env.DB.prepare(
    "DELETE FROM admin_sessions WHERE token_hash = ?"
  )
    .bind(tokenHash)
    .run();
}
