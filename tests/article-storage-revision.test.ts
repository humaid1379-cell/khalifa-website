import test from "node:test";
import assert from "node:assert/strict";
import {
  deleteArticle,
  updateArticle,
} from "../client/src/lib/articleStorage.ts";

test("update and delete send the revision originally reviewed by the editor", async () => {
  const originalFetch = globalThis.fetch;
  const calls: { url: string; options?: RequestInit }[] = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url: String(url), options });
    return new Response(JSON.stringify({ success: true, revision: 5 }), {
      status: 200,
    });
  };
  try {
    assert.equal(
      (await updateArticle("a/b", { title: "عنوان" }, 4)).success,
      true
    );
    assert.equal((await deleteArticle("a/b", 5)).success, true);
    assert.equal(calls[0].url, "/api/articles/a%2Fb");
    assert.equal(new Headers(calls[0].options?.headers).get("If-Match"), '"4"');
    assert.equal(new Headers(calls[1].options?.headers).get("If-Match"), '"5"');
    assert.equal(calls[0].options?.credentials, "same-origin");
    assert.equal(calls[1].options?.body, undefined);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("stale revisions return a conflict without retrying against the newer revision", async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return new Response(
      JSON.stringify({
        success: false,
        error: "تغيّرت النسخة",
        currentRevision: 8,
      }),
      { status: 409 }
    );
  };
  try {
    const result = await updateArticle(
      "first",
      { content: "مسودة محفوظة في المحرر" },
      7
    );
    assert.equal(result.success, false);
    assert.equal(result.status, 409);
    assert.equal(calls, 1);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("missing or invalid client revisions never issue an unconditional mutation", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new Error("Network must not be called");
  };
  try {
    assert.equal(
      (await updateArticle("first", { title: "عنوان" }, 0)).status,
      428
    );
    assert.equal((await deleteArticle("first", NaN)).status, 428);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
