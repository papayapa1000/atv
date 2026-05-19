import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { CreateStayPostInput, StayPost } from "./repository";

const dataFilePath = path.join(process.cwd(), "data", "stay-posts.json");

async function readLocalPosts(): Promise<StayPost[]> {
  try {
    const raw = await readFile(dataFilePath, "utf8");
    const posts = JSON.parse(raw) as StayPost[];

    if (!Array.isArray(posts)) {
      return [];
    }

    return posts.map((post) => ({
      ...post,
      imageUrls: Array.isArray(post.imageUrls) ? post.imageUrls : [],
    }));
  } catch {
    return [];
  }
}

async function writeLocalPosts(posts: StayPost[]) {
  await mkdir(path.dirname(dataFilePath), { recursive: true });
  await writeFile(dataFilePath, JSON.stringify(posts, null, 2), "utf8");
}

export async function listLocalStayPosts(limit = 100, offset = 0, includeUnpublished = false) {
  const posts = await readLocalPosts();

  return posts
    .filter((post) => includeUnpublished || post.isPublished)
    .sort((a, b) => {
      const sortDifference = a.sortOrder - b.sortOrder;

      if (sortDifference !== 0) {
        return sortDifference;
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(offset, offset + limit);
}

export async function countLocalStayPosts() {
  const posts = await readLocalPosts();

  return posts.filter((post) => post.isPublished).length;
}

export async function getLocalStayPost(id: string) {
  const posts = await readLocalPosts();

  return posts.find((post) => post.id === id && post.isPublished) ?? null;
}

export async function createLocalStayPost(input: CreateStayPostInput) {
  const posts = await readLocalPosts();
  const post: StayPost = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    title: input.title,
    price: input.price,
    content: input.content,
    imageUrls: input.imageUrls,
    isPublished: input.isPublished,
    sortOrder: 0,
  };

  await writeLocalPosts([post, ...posts]);

  return { id: post.id };
}
