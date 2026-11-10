import test from "node:test";
import assert from "node:assert/strict";
import { pageMetadata } from "../functions/_lib/seo.js";
import {
  getPageMetadata,
  normalizedRoute,
  SITE_ORIGIN,
} from "../client/src/lib/routeMetadata.ts";

test("metadata follows the routes Wouter actually accepts", () => {
  assert.equal(getPageMetadata("/Admin/").robots, "noindex,nofollow");
  assert.equal(
    getPageMetadata("/Archive/").canonical,
    `${SITE_ORIGIN}/archive`
  );
  assert.equal(getPageMetadata("/PODCAST").title, "البودكاست | خارج النص");
  assert.equal(getPageMetadata("/unavailable").robots, "noindex,follow");
  assert.equal(
    normalizedRoute("/ARTICLES/CaseSensitiveID/"),
    "/articles/CaseSensitiveID"
  );
});

test("archive canonical keeps real pagination and excludes search and tracking", () => {
  const metadata = getPageMetadata(
    "/archive",
    "?q=اقتصاد&category=رأي&year=2026&page=3&utm_source=test"
  );
  assert.equal(metadata.canonical, `${SITE_ORIGIN}/archive?page=3`);
  assert.equal(metadata.robots, "noindex,follow");
  assert.equal(
    getPageMetadata("/archive", "?page=3&utm_source=test").robots,
    "index,follow"
  );
  assert.equal(
    getPageMetadata("/archive", "?page=-1").canonical,
    `${SITE_ORIGIN}/archive`
  );
  assert.equal(
    getPageMetadata("/archive", "?year=invalid").robots,
    "noindex,follow"
  );
  assert.equal(getPageMetadata("/archive", "?q=+").robots, "index,follow");
  assert.equal(
    getPageMetadata("/archive", "?page=10000000").canonical,
    `${SITE_ORIGIN}/archive`
  );
});

const article = {
  id: "first",
  revision: 1,
  title: "عنوان المقال",
  excerpt: "",
  content: "كلمة ".repeat(50),
  date: "2026-11-10",
  year: 2026,
  category: "رأي",
  updated_at: "2026-11-10 08:00:00",
};

test("reader metadata is route-specific and stale responses cannot overwrite another article", () => {
  const metadata = getPageMetadata("/articles/first", "", {
    id: "first",
    status: "ready",
    article,
  });
  assert.equal(metadata.title, "عنوان المقال | خارج النص");
  assert.equal(metadata.description, article.content.slice(0, 160));
  assert.equal(metadata.type, "article");
  assert.equal(metadata.articleSchema?.headline, article.title);
  assert.equal(metadata.articleSchema?.dateModified, "2026-11-10T08:00:00Z");
  assert.equal(
    getPageMetadata("/articles/second", "", {
      id: "first",
      status: "ready",
      article,
    }).articleSchema,
    undefined
  );
  assert.equal(
    getPageMetadata("/archive", "", { id: "first", status: "ready", article })
      .articleSchema,
    undefined
  );
});

test("missing and failed readers update all metadata through the same state", () => {
  const missing = getPageMetadata("/articles/missing", "", {
    id: "missing",
    status: "missing",
  });
  assert.equal(missing.title, "المقال غير موجود | خارج النص");
  assert.equal(missing.robots, "noindex,follow");
  assert.equal(missing.articleSchema, undefined);
  const failed = getPageMetadata("/articles/failed", "", {
    id: "failed",
    status: "error",
  });
  assert.equal(failed.title, "تعذّر تحميل المقال | خارج النص");
  assert.equal(failed.robots, "noindex,follow");
});

test("final client metadata agrees with initial edge metadata", () => {
  const cases = [
    { path: "/", search: "" },
    { path: "/Archive/", search: "?q=رأي&page=2" },
    { path: "/archive", search: "?year=invalid&page=10000000" },
    { path: "/Admin/", search: "" },
    { path: "/unknown", search: "" },
    {
      path: "/articles/first",
      search: "",
      reader: { id: "first", status: "ready" as const, article },
    },
    {
      path: "/articles/missing",
      search: "",
      reader: { id: "missing", status: "missing" as const },
    },
    {
      path: "/articles/failed",
      search: "",
      reader: { id: "failed", status: "error" as const },
    },
  ];
  for (const { path, search, reader } of cases) {
    const client = getPageMetadata(path, search, reader);
    const edge = pageMetadata(
      new URL(`${SITE_ORIGIN}${path}${search}`),
      reader?.article || null,
      reader?.status === "error"
    );
    for (const key of [
      "title",
      "description",
      "canonical",
      "robots",
      "type",
    ] as const)
      assert.equal(client[key], edge[key], `${path}${search}: ${key}`);
    assert.deepEqual(
      client.articleSchema || null,
      edge.schema,
      `${path}: schema`
    );
  }
});
