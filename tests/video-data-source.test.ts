import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("public video pages are driven by video_posts data, not fallback samples", () => {
  const repositorySource = readFileSync("src/lib/videos/repository.ts", "utf8");
  const listVideoPostsPageSource = repositorySource.slice(
    repositorySource.indexOf("export async function listVideoPostsPage"),
    repositorySource.indexOf("export async function getVideoPost"),
  );
  const getVideoPostSource = repositorySource.slice(
    repositorySource.indexOf("export async function getVideoPost"),
    repositorySource.indexOf("export async function listAdminVideoPosts"),
  );

  assert.equal(repositorySource.includes("fallbackVideoPosts"), false);
  assert.equal(listVideoPostsPageSource.includes("fallbackVideoPage"), false);
  assert.equal(getVideoPostSource.includes("fallbackById"), false);
});
