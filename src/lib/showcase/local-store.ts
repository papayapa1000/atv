import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { CreateShowcasePostInput, ShowcasePost } from "./repository";

const dataFilePath = path.join(process.cwd(), "data", "showcase-posts.json");

async function readLocalPosts(): Promise<ShowcasePost[]> {
  try {
    const raw = await readFile(dataFilePath, "utf8");
    const posts = JSON.parse(raw) as Array<ShowcasePost & { imageUrl?: string | null }>;

    if (!Array.isArray(posts)) {
      return [];
    }

    return posts.map((post) => ({
      ...post,
      imageUrls: post.imageUrls ?? (post.imageUrl ? [post.imageUrl] : []),
    }));
  } catch {
    return [];
  }
}

async function writeLocalPosts(posts: ShowcasePost[]) {
  await mkdir(path.dirname(dataFilePath), { recursive: true });
  await writeFile(dataFilePath, JSON.stringify(posts, null, 2), "utf8");
}

export async function listLocalShowcasePosts(limit = 100, offset = 0) {
  const posts = await readLocalPosts();

  return posts
    .filter((post) => post.isPublished)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(offset, offset + limit);
}

export async function countLocalShowcasePosts() {
  const posts = await readLocalPosts();

  return posts.filter((post) => post.isPublished).length;
}

export async function getLocalShowcasePost(id: string) {
  const posts = await readLocalPosts();

  return posts.find((post) => post.id === id && post.isPublished) ?? null;
}

export async function createLocalShowcasePost(input: CreateShowcasePostInput) {
  const posts = await readLocalPosts();
  const post: ShowcasePost = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    authorName: input.authorName,
    title: input.title,
    content: input.content,
    linkUrl: input.linkUrl || null,
    imageUrls: input.imageUrls,
    isPublished: true,
    sortOrder: 0,
  };

  await writeLocalPosts([post, ...posts]);

  return { id: post.id };
}

export async function deleteLocalShowcasePost(id: string) {
  const posts = await readLocalPosts();
  await writeLocalPosts(posts.filter((post) => post.id !== id));
}
