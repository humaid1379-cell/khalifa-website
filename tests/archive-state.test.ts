import test from "node:test";
import assert from "node:assert/strict";
import {
  archiveHref,
  parseArchiveState,
} from "../client/src/lib/archiveState.ts";

test("archive links round-trip Arabic filters and preserve the requested page", () => {
  const state = {
    query: "رأي & اقتصاد ",
    category: "مجتمع",
    year: "2026",
    page: 3,
  };
  const href = archiveHref(state);
  assert.equal(href.startsWith("/archive?"), true);
  assert.deepEqual(parseArchiveState(href.slice(href.indexOf("?"))), state);
  assert.equal(archiveHref({ ...state, page: 1 }).includes("page="), false);
});

test("invalid and unsafe page numbers cannot create negative or unbounded indexes", () => {
  for (const page of [
    "0",
    "-1",
    "2.5",
    "1e4",
    "Infinity",
    "10000000",
    "01",
    "99999999999999999999999",
  ])
    assert.equal(parseArchiveState(`?page=${page}`).page, 1);
  assert.equal(parseArchiveState("?page=12").page, 12);
  assert.equal(parseArchiveState("?page=9999999").page, 9999999);
  assert.equal(parseArchiveState("?year=202").year, "");
});

test("filter reset removes pagination and unrelated tracking state", () => {
  const state = parseArchiveState(
    "?q=hello&category=culture&year=2026&page=4&utm_source=test"
  );
  assert.equal(
    archiveHref({ ...state, query: "", category: "", year: "", page: 1 }),
    "/archive"
  );
});
