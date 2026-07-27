import assert from "node:assert/strict";
import test from "node:test";

import {
  canonicalUrl,
  clean,
  normalizeFeedItems,
  safeImage,
  safeUrl,
} from "../app/lib/feed.ts";

function item(overrides = {}) {
  return {
    id: "one",
    source: "youtube",
    label: "Video",
    title: "Title",
    description: "",
    url: "https://example.com/story",
    author: "Author",
    publishedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

test("deduplicates by canonical URL and source ID", () => {
  const result = normalizeFeedItems([
    item(),
    item({
      id: "two",
      url: "https://example.com/story/?utm_source=newsletter#section",
    }),
    item({
      id: "one",
      url: "https://example.com/another-story",
    }),
  ]);

  assert.equal(result.length, 1);
  assert.equal(result[0].url, "https://example.com/story");
});

test("sorts newest first and respects the result limit", () => {
  const result = normalizeFeedItems(
    [
      item({ id: "old", url: "https://example.com/old" }),
      item({
        id: "new",
        url: "https://example.com/new",
        publishedAt: "2026-02-01T00:00:00.000Z",
      }),
    ],
    1,
  );

  assert.deepEqual(result.map(({ id }) => id), ["new"]);
});

test("normalizes tracking parameters without removing useful query data", () => {
  assert.equal(
    canonicalUrl(
      "https://www.youtube.com/watch?v=abc&utm_medium=social#comments",
    ),
    "https://www.youtube.com/watch?v=abc",
  );
});

test("strips feed markup and only permits safe external URLs", () => {
  assert.equal(clean("<p>Hello &amp; <strong>world</strong></p>"), "Hello & world");
  assert.equal(
    safeUrl("javascript:alert(1)", "https://example.com/"),
    "https://example.com/",
  );
  assert.equal(
    safeImage("https://i.ytimg.com/vi/abc/hqdefault.jpg"),
    "https://i.ytimg.com/vi/abc/hqdefault.jpg",
  );
  assert.equal(safeImage("https://untrusted.example/image.jpg"), undefined);
});
