import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

type StayDummyPost = {
  id: string;
  title: string;
  price: string;
  content: string;
  imageUrls: string[];
  isPublished: boolean;
  sortOrder: number;
};

test("stay dummy data contains ten publishable posts", async () => {
  const raw = await readFile(path.join(process.cwd(), "data", "stay-posts.json"), "utf8");
  const posts = JSON.parse(raw) as StayDummyPost[];

  assert.equal(posts.length, 10);
  assert.deepEqual(
    posts.map((post) => post.sortOrder),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  );

  for (const post of posts) {
    assert.equal(post.isPublished, true);
    assert.ok(post.title.length >= 2);
    assert.ok(post.price.length >= 1);
    assert.ok(post.content.length >= 5);
    assert.ok(post.imageUrls.length >= 1);
    assert.ok(post.imageUrls.length <= 10);
    assert.ok(post.imageUrls.every((imageUrl) => imageUrl.startsWith("/images/")));
  }
});
