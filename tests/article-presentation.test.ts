import test from "node:test";
import assert from "node:assert/strict";
import {
  articleDate,
  articleHref,
  filterArticles,
  newestFirst,
  normalizeSearch,
  readingLabel,
  readingMinutes,
} from "../client/src/lib/articlePresentation.ts";

const articles = [
  {
    id: "old",
    title: "الإِقْتِصَاد",
    excerpt: "",
    content: "قراءة في أسواق المنطقة",
    date: "2024-12-31",
    year: 2024,
    category: "اقتصاد",
    newspaper: "الاتحاد",
  },
  {
    id: "new",
    title: "المجتمع",
    excerpt: "العمل والتعليم",
    content: "حوار عام",
    date: "2026-01-01",
    year: 2026,
    category: "مجتمع",
    newspaper: "",
  },
];

test("Arabic search ignores diacritics, tatweel, and alef variants", () => {
  assert.equal(normalizeSearch("  الإِقْتِصَــاد  "), "الاقتصاد");
  assert.equal(normalizeSearch("إلى"), normalizeSearch("الي"));
  assert.deepEqual(
    filterArticles(articles, "اقتصاد", "", "").map(a => a.id),
    ["old"]
  );
});

test("search combines category and year, and includes source and body", () => {
  assert.equal(filterArticles(articles, "الاتحاد", "اقتصاد", "2024").length, 1);
  assert.equal(filterArticles(articles, "اسواق", "اقتصاد", "2024").length, 1);
  assert.equal(filterArticles(articles, "", "مجتمع", "2024").length, 0);
  assert.equal(filterArticles(articles, "", "", "202").length, 0);
  assert.equal(filterArticles(articles, "", "", "").length, 2);
});

test("sorting is newest first without mutating input", () => {
  assert.deepEqual(
    newestFirst(articles).map(a => a.id),
    ["new", "old"]
  );
  assert.deepEqual(
    articles.map(a => a.id),
    ["old", "new"]
  );
});

test("date labels keep date-only values stable and reject impossible dates", () => {
  assert.equal(
    articleDate("2024-12-31"),
    new Date("2024-12-31T12:00:00Z").toLocaleDateString("ar-AE", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Dubai",
    })
  );
  assert.equal(articleDate("2025-02-30"), "");
  assert.equal(articleDate("bad-date"), "");
  assert.notEqual(articleDate("2024-02-29"), "");
});

test("reading estimate handles whitespace and rounds up", () => {
  assert.equal(readingMinutes(""), 1);
  assert.equal(readingMinutes("كلمة ".repeat(180)), 1);
  assert.equal(readingMinutes("كلمة ".repeat(181)), 2);
  assert.equal(readingLabel("كلمة"), "دقيقة واحدة للقراءة");
  assert.equal(readingLabel("كلمة ".repeat(181)), "دقيقتان للقراءة");
});

test("article links encode reserved path characters", () => {
  assert.equal(articleHref("one/two?x=1"), "/articles/one%2Ftwo%3Fx%3D1");
});
