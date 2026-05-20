import "server-only";

import { readSupabaseServerConfig } from "./config";

type SupabaseBucket = {
  id?: string;
  name?: string;
};

type SupabaseStorageListEntry = {
  name: string;
  id: string | null;
  metadata: {
    size?: number | string;
  } | null;
};

export type SupabaseStorageUsageBucket = {
  bucket: string;
  objectCount: number;
  usedBytes: number;
};

export type SupabaseStorageUsageSummary =
  | {
      ok: true;
      buckets: SupabaseStorageUsageBucket[];
      quotaBytes: number;
      usedBytes: number;
      availableBytes: number;
      usagePercent: number;
      quotaSource: string;
    }
  | {
      ok: false;
      message: string;
    };

const defaultStorageQuotaGb = 1;

function getStorageQuotaBytes() {
  const rawQuotaGb = process.env.SUPABASE_STORAGE_QUOTA_GB;
  const quotaGb = rawQuotaGb ? Number(rawQuotaGb) : defaultStorageQuotaGb;
  const safeQuotaGb = Number.isFinite(quotaGb) && quotaGb > 0 ? quotaGb : defaultStorageQuotaGb;

  return {
    quotaBytes: Math.round(safeQuotaGb * 1024 * 1024 * 1024),
    quotaSource: rawQuotaGb ? "SUPABASE_STORAGE_QUOTA_GB" : "Free plan 기본 1GB",
  };
}

function getManagedStorageBucketNames() {
  return [
    process.env.SUPABASE_GALLERY_IMAGES_BUCKET?.trim() || "gallery-images",
    process.env.SUPABASE_SHOWCASE_IMAGES_BUCKET?.trim() || "showcase-images",
    process.env.SUPABASE_STAY_IMAGES_BUCKET?.trim() || "stay-images",
    process.env.SUPABASE_VIDEO_FILES_BUCKET?.trim() || "video-files",
  ];
}

function readEntrySize(entry: SupabaseStorageListEntry) {
  const rawSize = entry.metadata?.size;
  const size = typeof rawSize === "string" ? Number(rawSize) : rawSize;

  return Number.isFinite(size) && size && size > 0 ? size : 0;
}

async function supabaseStorageFetch<T>(path: string, init: RequestInit = {}) {
  const config = readSupabaseServerConfig();

  if (!config) {
    throw new Error("Supabase Storage 환경변수가 설정되지 않았습니다.");
  }

  const response = await fetch(`${config.url}/storage/v1${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase Storage request failed: ${response.status} ${message}`);
  }

  return (await response.json()) as T;
}

async function listBucketNames() {
  const managedBucketNames = getManagedStorageBucketNames();

  try {
    const buckets = await supabaseStorageFetch<SupabaseBucket[]>("/bucket");
    const bucketNames = buckets.map((bucket) => bucket.id || bucket.name).filter((bucket): bucket is string => Boolean(bucket));

    return [...new Set([...managedBucketNames, ...bucketNames])];
  } catch {
    return managedBucketNames;
  }
}

function isMissingBucketError(error: unknown) {
  return error instanceof Error && /(^|\\s)(400|404)(\\s|$)|not found|does not exist|bucket/i.test(error.message);
}

async function listBucketUsage(bucket: string, prefix = "", visitedPrefixes = new Set<string>()): Promise<SupabaseStorageUsageBucket> {
  if (visitedPrefixes.has(`${bucket}:${prefix}`)) {
    return { bucket, objectCount: 0, usedBytes: 0 };
  }

  visitedPrefixes.add(`${bucket}:${prefix}`);

  let offset = 0;
  let objectCount = 0;
  let usedBytes = 0;

  while (true) {
    const entries = await supabaseStorageFetch<SupabaseStorageListEntry[]>(`/object/list/${encodeURIComponent(bucket)}`, {
      method: "POST",
      body: JSON.stringify({
        prefix,
        limit: 1000,
        offset,
        sortBy: {
          column: "name",
          order: "asc",
        },
      }),
    });

    for (const entry of entries) {
      const size = readEntrySize(entry);

      if (size > 0) {
        objectCount += 1;
        usedBytes += size;
      } else if (entry.name && !entry.id && !entry.metadata) {
        const childPrefix = prefix ? `${prefix}/${entry.name}` : entry.name;
        const childUsage = await listBucketUsage(bucket, childPrefix, visitedPrefixes);
        objectCount += childUsage.objectCount;
        usedBytes += childUsage.usedBytes;
      }
    }

    if (entries.length < 1000) {
      break;
    }

    offset += entries.length;
  }

  return { bucket, objectCount, usedBytes };
}

async function listBucketUsageOrEmpty(bucket: string) {
  try {
    return await listBucketUsage(bucket);
  } catch (error) {
    if (isMissingBucketError(error)) {
      return { bucket, objectCount: 0, usedBytes: 0 };
    }

    throw error;
  }
}

export function formatStorageBytes(bytes: number) {
  if (bytes >= 1024 * 1024 * 1024) {
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
  }

  if (bytes >= 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${bytes} B`;
}

export async function getSupabaseStorageUsageSummary(): Promise<SupabaseStorageUsageSummary> {
  const config = readSupabaseServerConfig();

  if (!config) {
    return {
      ok: false,
      message: "Supabase Storage 환경변수가 설정되지 않았습니다.",
    };
  }

  try {
    const bucketNames = await listBucketNames();
    const uniqueBucketNames = [...new Set(bucketNames)];
    const buckets = await Promise.all(uniqueBucketNames.map((bucket) => listBucketUsageOrEmpty(bucket)));
    const usedBytes = buckets.reduce((total, bucket) => total + bucket.usedBytes, 0);
    const { quotaBytes, quotaSource } = getStorageQuotaBytes();
    const availableBytes = Math.max(quotaBytes - usedBytes, 0);
    const usagePercent = quotaBytes > 0 ? Math.min((usedBytes / quotaBytes) * 100, 100) : 0;

    return {
      ok: true,
      buckets,
      quotaBytes,
      usedBytes,
      availableBytes,
      usagePercent,
      quotaSource,
    };
  } catch {
    return {
      ok: false,
      message: "스토리지 사용량을 확인하지 못했습니다.",
    };
  }
}
