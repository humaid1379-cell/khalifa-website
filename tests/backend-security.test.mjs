import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import * as auth from "../functions/api/auth.js";
import * as articles from "../functions/api/articles.js";
import * as article from "../functions/api/articles/[id].js";
import { onRequest as seed } from "../functions/api/seed.js";
import { COOKIE_NAME, LOGIN_LIMIT } from "../functions/_lib/auth.js";

function database() {
  const db = new DatabaseSync(":memory:");
  db.exec(readFileSync(new URL("../schema.sql", import.meta.url), "utf8"));
  const prepare = sql => ({
    values: [],
    bind(...values) {
      this.values = values;
      return this;
    },
    async first() {
      return db.prepare(sql).get(...this.values) || null;
    },
    async all() {
      return { results: db.prepare(sql).all(...this.values) };
    },
    async run() {
      return { meta: { changes: db.prepare(sql).run(...this.values).changes } };
    },
  });
  return {
    db,
    prepare,
    async batch(statements) {
      db.exec("BEGIN");
      try {
        const values = [];
        for (const statement of statements) values.push(await statement.run());
        db.exec("COMMIT");
        return values;
      } catch (error) {
        db.exec("ROLLBACK");
        throw error;
      }
    },
  };
}
function environment() {
  return {
    DB: database(),
    ADMIN_PASSWORD: "test-only-long-password-123",
    SESSION_SECRET: "test-only-session-key-12345678901234567890",
  };
}
function context(
  env,
  path,
  {
    method = "GET",
    body,
    cookie,
    origin = "https://example.com",
    headers = {},
  } = {}
) {
  return {
    env,
    params: { id: path.split("/").pop() },
    request: new Request(`https://example.com${path}`, {
      method,
      headers: {
        ...(method !== "GET"
          ? { Origin: origin, "Content-Type": "application/json" }
          : {}),
        "CF-Connecting-IP": "192.0.2.2",
        ...(cookie ? { Cookie: cookie } : {}),
        ...headers,
      },
      ...(body === undefined
        ? {}
        : { body: typeof body === "string" ? body : JSON.stringify(body) }),
    }),
  };
}
async function login(env) {
  const result = await auth.onRequestPost(
    context(env, "/api/auth", {
      method: "POST",
      body: { password: env.ADMIN_PASSWORD },
    })
  );
  assert.equal(result.status, 200);
  return result.headers.get("Set-Cookie").split(";")[0];
}
const sample = {
  id: "test-article",
  title: "عنوان للاختبار",
  excerpt: "مقتطف",
  content: "نص اختباري فقط",
  date: "2026-11-09",
  category: "رأي",
  newspaper: "صحيفة",
};

test("login issues an opaque protected cookie; response contains no password/token", async () => {
  const env = environment();
  const response = await auth.onRequestPost(
    context(env, "/api/auth", {
      method: "POST",
      body: { password: env.ADMIN_PASSWORD },
    })
  );
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    success: true,
    authenticated: true,
  });
  const cookie = response.headers.get("Set-Cookie");
  for (const attribute of [
    "HttpOnly",
    "Secure",
    "SameSite=Strict",
    "Path=/",
    "Max-Age=28800",
  ])
    assert.ok(cookie.includes(attribute));
  assert.ok(!cookie.includes(env.ADMIN_PASSWORD));
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  const token = cookie.split(";")[0].split("=")[1];
  const stored = env.DB.db
    .prepare("SELECT token_hash FROM admin_sessions")
    .get();
  assert.notEqual(stored.token_hash, token);
  assert.equal(
    (
      await (
        await auth.onRequestGet(context(env, "/api/auth", { cookie }))
      ).json()
    ).authenticated,
    true
  );
});

test("missing, malformed, forged and expired sessions cannot mutate articles", async () => {
  const env = environment();
  for (const cookie of [
    undefined,
    `${COOKIE_NAME}=malformed`,
    `${COOKIE_NAME}=${"a".repeat(64)}`,
  ]) {
    assert.equal(
      (
        await articles.onRequestPost(
          context(env, "/api/articles", {
            method: "POST",
            body: sample,
            cookie,
          })
        )
      ).status,
      401
    );
  }
  const cookie = await login(env);
  env.DB.db.exec("UPDATE admin_sessions SET expires_at = 0");
  assert.equal(
    (
      await articles.onRequestPost(
        context(env, "/api/articles", { method: "POST", body: sample, cookie })
      )
    ).status,
    401
  );
  assert.equal(
    (
      await articles.onRequestPost(
        context(env, "/api/articles", {
          method: "POST",
          body: sample,
          headers: { Authorization: `Bearer ${env.ADMIN_PASSWORD}` },
        })
      )
    ).status,
    401
  );
});

test("logout revokes the server session and expires its cookie", async () => {
  const env = environment();
  const cookie = await login(env);
  const response = await auth.onRequestDelete(
    context(env, "/api/auth", { method: "DELETE", cookie })
  );
  assert.equal(response.status, 200);
  assert.ok(response.headers.get("Set-Cookie").includes("Max-Age=0"));
  assert.equal(
    (
      await (
        await auth.onRequestGet(context(env, "/api/auth", { cookie }))
      ).json()
    ).authenticated,
    false
  );
});

test("same-origin policy applies to login, logout and CRUD", async () => {
  const env = environment();
  const cookie = await login(env);
  for (const origin of ["https://evil.example", "null", ""]) {
    assert.equal(
      (
        await auth.onRequestPost(
          context(env, "/api/auth", {
            method: "POST",
            body: { password: env.ADMIN_PASSWORD },
            origin,
          })
        )
      ).status,
      403
    );
    assert.equal(
      (
        await auth.onRequestDelete(
          context(env, "/api/auth", { method: "DELETE", cookie, origin })
        )
      ).status,
      403
    );
    assert.equal(
      (
        await articles.onRequestPost(
          context(env, "/api/articles", {
            method: "POST",
            cookie,
            body: sample,
            origin,
          })
        )
      ).status,
      403
    );
  }
  assert.equal(
    (
      await articles.onRequestPost(
        context(env, "/api/articles", {
          method: "POST",
          cookie,
          body: sample,
          headers: { "Sec-Fetch-Site": "cross-site" },
        })
      )
    ).status,
    403
  );
});

test("unconfigured auth and missing migration fail closed without exposing errors", async () => {
  const env = environment();
  const response = await auth.onRequestPost(
    context({ ...env, ADMIN_PASSWORD: "" }, "/api/auth", {
      method: "POST",
      body: { password: "" },
    })
  );
  assert.equal(response.status, 503);
  env.DB.db.exec("DROP TABLE admin_login_attempts");
  const missingTable = await auth.onRequestPost(
    context(env, "/api/auth", {
      method: "POST",
      body: { password: env.ADMIN_PASSWORD },
    })
  );
  assert.equal(missingTable.status, 503);
  assert.ok(!(await missingTable.text()).includes("admin_login_attempts"));
});

test("atomic SQLite UPSERT enforces the login limit across concurrent requests", async () => {
  const env = environment();
  const responses = await Promise.all(
    Array.from({ length: 20 }, () =>
      auth.onRequestPost(
        context(env, "/api/auth", {
          method: "POST",
          body: { password: "incorrect" },
        })
      )
    )
  );
  assert.equal(
    responses.filter(response => response.status === 401).length,
    LOGIN_LIMIT
  );
  assert.equal(
    responses.filter(response => response.status === 429).length,
    20 - LOGIN_LIMIT
  );
  assert.ok(
    responses
      .filter(response => response.status === 429)
      .every(response => response.headers.get("Retry-After") === "900")
  );
  assert.equal(
    env.DB.db.prepare("SELECT attempts FROM admin_login_attempts").get()
      .attempts,
    20
  );
  env.DB.db.exec("UPDATE admin_login_attempts SET window_start = 0");
  assert.equal(
    (
      await auth.onRequestPost(
        context(env, "/api/auth", {
          method: "POST",
          body: { password: "incorrect" },
        })
      )
    ).status,
    401
  );
});

test("empty article library is a real empty response; database failures are explicit", async () => {
  const env = environment();
  const response = await articles.onRequestGet(context(env, "/api/articles"));
  assert.deepEqual(await response.json(), { success: true, articles: [] });
  env.DB.db.exec("DROP TABLE articles");
  const failure = await articles.onRequestGet(context(env, "/api/articles"));
  assert.equal(failure.status, 503);
  assert.ok(!(await failure.text()).includes("no such table"));
});

test("article CRUD validates input, preserves Arabic, and parameterizes text", async () => {
  const env = environment();
  const cookie = await login(env);
  const record = { ...sample, content: "نص عربي '); DROP TABLE articles; --" };
  assert.equal(
    (
      await articles.onRequestPost(
        context(env, "/api/articles", { method: "POST", cookie, body: record })
      )
    ).status,
    201
  );
  assert.equal(
    (
      await articles.onRequestPost(
        context(env, "/api/articles", { method: "POST", cookie, body: record })
      )
    ).status,
    200
  );
  assert.equal(
    (
      await articles.onRequestPost(
        context(env, "/api/articles", {
          method: "POST",
          cookie,
          body: { ...record, title: "مختلف" },
        })
      )
    ).status,
    409
  );
  const found = await (
    await article.onRequestGet(context(env, "/api/articles/test-article"))
  ).json();
  assert.equal(found.article.content, record.content);
  assert.equal(found.article.year, 2026);
  assert.equal(
    (
      await article.onRequestPut(
        context(env, "/api/articles/test-article", {
          method: "PUT",
          cookie,
          body: { ...record, title: "تحديث" },
        })
      )
    ).status,
    200
  );
  assert.equal(
    (
      await (
        await article.onRequestGet(context(env, "/api/articles/test-article"))
      ).json()
    ).article.title,
    "تحديث"
  );
  for (const invalid of [
    { ...sample, date: "2026-02-30" },
    { ...sample, title: " " },
    { ...sample, content: 7 },
    { ...sample, id: "../other" },
  ]) {
    assert.equal(
      (
        await articles.onRequestPost(
          context(env, "/api/articles", {
            method: "POST",
            cookie,
            body: invalid,
          })
        )
      ).status,
      400
    );
  }
  assert.equal(
    (
      await article.onRequestDelete(
        context(env, "/api/articles/test-article", { method: "DELETE", cookie })
      )
    ).status,
    200
  );
  assert.equal(
    (
      await article.onRequestDelete(
        context(env, "/api/articles/test-article", { method: "DELETE", cookie })
      )
    ).status,
    404
  );
  assert.equal(
    (await article.onRequestGet(context(env, "/api/articles/test-article")))
      .status,
    404
  );
});

test("malformed and oversized bodies are rejected; sample seeding is disabled", async () => {
  const env = environment();
  const cookie = await login(env);
  assert.equal(
    (
      await articles.onRequestPost(
        context(env, "/api/articles", { method: "POST", cookie, body: "{bad" })
      )
    ).status,
    400
  );
  assert.equal(
    (
      await articles.onRequestPost(
        context(env, "/api/articles", {
          method: "POST",
          cookie,
          body: "a".repeat(262145),
        })
      )
    ).status,
    413
  );
  assert.equal(
    (
      await articles.onRequestPost(
        context(env, "/api/articles", {
          method: "POST",
          cookie,
          body: "{}",
          headers: { "Content-Type": "text/plain" },
        })
      )
    ).status,
    415
  );
  assert.equal(seed().status, 410);
});

test("additive migration preserves existing article data and can be reapplied", () => {
  const DB = database();
  DB.db
    .prepare(
      "INSERT INTO articles (id, title, content, date, category) VALUES (?, ?, ?, ?, ?)"
    )
    .run("existing", "قديم", "المحتوى", "2026-01-01", "رأي");
  const migration = readFileSync(
    new URL("../migrations/0001_admin_security.sql", import.meta.url),
    "utf8"
  );
  DB.db.exec(migration);
  DB.db.exec(migration);
  assert.equal(
    DB.db.prepare("SELECT title FROM articles WHERE id = ?").get("existing")
      .title,
    "قديم"
  );
});

test("failed login prunes stale throttle rows without requiring a successful session", async () => {
  const env = environment();
  const now = Math.floor(Date.now() / 1000);
  const insert = env.DB.db.prepare(
    "INSERT INTO admin_login_attempts (ip_hash, window_start, attempts) VALUES (?, ?, ?)"
  );
  insert.run("stale-ip", now - 86401, 4);
  insert.run("recent-ip", now - 900, 3);
  const response = await auth.onRequestPost(
    context(env, "/api/auth", {
      method: "POST",
      body: { password: "incorrect" },
    })
  );
  assert.equal(response.status, 401);
  assert.equal(
    env.DB.db.prepare("SELECT COUNT(*) AS total FROM admin_sessions").get()
      .total,
    0
  );
  assert.equal(
    env.DB.db
      .prepare("SELECT * FROM admin_login_attempts WHERE ip_hash = ?")
      .get("stale-ip"),
    undefined
  );
  assert.equal(
    env.DB.db
      .prepare("SELECT attempts FROM admin_login_attempts WHERE ip_hash = ?")
      .get("recent-ip").attempts,
    3
  );
});

test("simultaneous identical creates are idempotent and conflicting creates return409", async () => {
  const env = environment();
  const cookie = await login(env);
  const create = body =>
    articles.onRequestPost(
      context(env, "/api/articles", { method: "POST", cookie, body })
    );
  const responses = await Promise.all(
    Array.from({ length: 12 }, () => create(sample))
  );
  assert.equal(responses.filter(response => response.status === 201).length, 1);
  assert.equal(
    responses.filter(response => response.status === 200).length,
    11
  );
  assert.equal(
    env.DB.db.prepare("SELECT COUNT(*) AS total FROM articles").get().total,
    1
  );
  const differing = await Promise.all([
    create({ ...sample, id: "competing", title: "أول" }),
    create({ ...sample, id: "competing", title: "ثان" }),
  ]);
  assert.deepEqual(
    differing.map(response => response.status).sort(),
    [201, 409]
  );
  assert.equal(
    env.DB.db
      .prepare("SELECT COUNT(*) AS total FROM articles WHERE id = ?")
      .get("competing").total,
    1
  );
});
