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
          headers: { "If-Match": '"1"' },
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
        context(env, "/api/articles/test-article", {
          method: "DELETE",
          cookie,
          headers: { "If-Match": '"2"' },
        })
      )
    ).status,
    200
  );
  assert.equal(
    (
      await article.onRequestDelete(
        context(env, "/api/articles/test-article", {
          method: "DELETE",
          cookie,
          headers: { "If-Match": '"2"' },
        })
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
  for (const response of responses) {
    assert.deepEqual(await response.json(), {
      success: true,
      id: sample.id,
      revision: 1,
    });
  }
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

test("created articles expose a server-controlled revision through public reads", async () => {
  const env = environment();
  const cookie = await login(env);
  const created = await articles.onRequestPost(
    context(env, "/api/articles", {
      method: "POST",
      cookie,
      body: { ...sample, revision: 99 },
    })
  );
  assert.equal(created.status, 201);
  assert.deepEqual(await created.json(), {
    success: true,
    id: sample.id,
    revision: 1,
  });
  const found = await article.onRequestGet(
    context(env, `/api/articles/${sample.id}`)
  );
  assert.equal(found.headers.get("ETag"), '"1"');
  assert.equal((await found.json()).article.revision, 1);
  const list = await articles.onRequestGet(context(env, "/api/articles"));
  assert.equal((await list.json()).articles[0].revision, 1);
});

test("concurrent edits of the same revision cannot silently overwrite each other", async () => {
  const env = environment();
  const cookie = await login(env);
  await articles.onRequestPost(
    context(env, "/api/articles", { method: "POST", cookie, body: sample })
  );
  const edits = [
    { ...sample, title: "عنوان المحرر الأول" },
    { ...sample, content: "محتوى المحرر الثاني" },
  ];
  const responses = await Promise.all(
    edits.map(body =>
      article.onRequestPut(
        context(env, `/api/articles/${sample.id}`, {
          method: "PUT",
          cookie,
          body,
          headers: { "If-Match": '"1"' },
        })
      )
    )
  );
  assert.deepEqual(
    responses.map(response => response.status).sort(),
    [200, 409]
  );
  const winner = responses.findIndex(response => response.status === 200);
  const conflict = responses[1 - winner];
  assert.equal((await conflict.json()).currentRevision, 2);
  assert.equal(responses[winner].headers.get("ETag"), '"2"');
  assert.equal((await responses[winner].json()).revision, 2);
  const saved = (
    await (
      await article.onRequestGet(context(env, `/api/articles/${sample.id}`))
    ).json()
  ).article;
  assert.equal(saved.title, edits[winner].title);
  assert.equal(saved.content, edits[winner].content);
  assert.equal(saved.revision, 2);

  const nextEdit = await article.onRequestPut(
    context(env, `/api/articles/${sample.id}`, {
      method: "PUT",
      cookie,
      body: { ...saved, title: "تحديث بعد مراجعة النسخة الأحدث" },
      headers: { "If-Match": '"2"' },
    })
  );
  assert.equal(nextEdit.status, 200);
  assert.equal((await nextEdit.json()).revision, 3);
});

test("stale deletion preserves a newer edit and deletion of the current revision succeeds", async () => {
  const env = environment();
  const cookie = await login(env);
  await articles.onRequestPost(
    context(env, "/api/articles", { method: "POST", cookie, body: sample })
  );
  await article.onRequestPut(
    context(env, `/api/articles/${sample.id}`, {
      method: "PUT",
      cookie,
      body: { ...sample, title: "تحديث يجب الحفاظ عليه" },
      headers: { "If-Match": '"1"' },
    })
  );
  const remove = revision =>
    article.onRequestDelete(
      context(env, `/api/articles/${sample.id}`, {
        method: "DELETE",
        cookie,
        headers: { "If-Match": `"${revision}"` },
      })
    );
  const stale = await remove(1);
  assert.equal(stale.status, 409);
  assert.equal((await stale.json()).currentRevision, 2);
  assert.equal(
    env.DB.db.prepare("SELECT title FROM articles WHERE id = ?").get(sample.id)
      .title,
    "تحديث يجب الحفاظ عليه"
  );
  assert.equal((await remove(2)).status, 200);
  assert.equal((await remove(2)).status, 404);
});

test("update and delete require a valid revision after authenticating the request", async () => {
  const env = environment();
  const cookie = await login(env);
  await articles.onRequestPost(
    context(env, "/api/articles", { method: "POST", cookie, body: sample })
  );
  for (const [method, handler] of [
    ["PUT", article.onRequestPut],
    ["DELETE", article.onRequestDelete],
  ]) {
    const request = (id, options = {}) =>
      handler(
        context(env, `/api/articles/${id}`, {
          method,
          cookie,
          ...(method === "PUT" ? { body: sample } : {}),
          ...options,
        })
      );
    assert.equal((await request(sample.id, { cookie: undefined })).status, 401);
    assert.equal((await request(sample.id)).status, 428);
    for (const invalid of [
      "1",
      '"0"',
      '"-1"',
      "*",
      'W/"1"',
      '"1", "2"',
      '"9007199254740991"',
    ]) {
      assert.equal(
        (await request(sample.id, { headers: { "If-Match": invalid } })).status,
        400
      );
    }
    assert.equal(
      (await request("missing", { headers: { "If-Match": '"1"' } })).status,
      404
    );
  }
  const saved = env.DB.db
    .prepare("SELECT title, revision FROM articles WHERE id = ?")
    .get(sample.id);
  assert.equal(saved.title, sample.title);
  assert.equal(saved.revision, 1);
});

test("revision migration preserves existing articles and initializes old and new rows at one", () => {
  const db = new DatabaseSync(":memory:");
  db.exec(`CREATE TABLE articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL,
    date TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'رأي',
    newspaper TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`);
  db.prepare(
    "INSERT INTO articles (id, title, excerpt, content, date, category, newspaper, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(
    sample.id,
    sample.title,
    sample.excerpt,
    sample.content,
    sample.date,
    sample.category,
    sample.newspaper,
    "2026-01-01 00:00:00",
    "2026-11-01 12:00:00"
  );
  const before = db.prepare("SELECT * FROM articles").get();
  db.exec(
    readFileSync(
      new URL("../migrations/0002_article_revision.sql", import.meta.url),
      "utf8"
    )
  );
  assert.deepEqual(
    { ...db.prepare("SELECT * FROM articles WHERE id = ?").get(sample.id) },
    { ...before, revision: 1 }
  );
  db.prepare(
    "INSERT INTO articles (id, title, content, date) VALUES (?, ?, ?, ?)"
  ).run("new", "جديد", "نص", "2026-11-10");
  assert.equal(
    db.prepare("SELECT revision FROM articles WHERE id = 'new'").get().revision,
    1
  );
  assert.throws(() =>
    db.prepare("UPDATE articles SET revision = 0 WHERE id = ?").run(sample.id)
  );
  db.close();
});
