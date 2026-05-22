import "server-only";

import { getSupabaseServerConfig, readSupabaseServerConfig } from "./config";

export type SupabaseStorageUploadInput = {
  bucket: string;
  objectPath: string;
  body: BodyInit;
  contentType: string;
};

export type SupabaseStorageObjectRef = {
  bucket: string;
  objectPath: string;
};

export type SupabaseStorageSignedUpload = SupabaseStorageObjectRef & {
  signedUrl: string;
  publicUrl: string;
  token: string;
};

export function isSupabaseStorageUploadLimitError(error: unknown) {
  return error instanceof Error && /413|Payload too large|exceeded the maximum allowed size/i.test(error.message);
}

function encodeStorageObjectPath(objectPath: string) {
  return objectPath.split("/").map(encodeURIComponent).join("/");
}

function getPublicStorageObjectUrl(url: string, bucket: string, objectPath: string) {
  return `${url}/storage/v1/object/public/${encodeURIComponent(bucket)}/${encodeStorageObjectPath(objectPath)}`;
}

export function getSupabasePublicStorageObjectUrl(bucket: string, objectPath: string) {
  const config = getSupabaseServerConfig();

  return getPublicStorageObjectUrl(config.url, bucket, objectPath);
}

export async function createSupabaseStorageSignedUpload(
  input: SupabaseStorageObjectRef,
): Promise<SupabaseStorageSignedUpload> {
  const config = getSupabaseServerConfig();
  const response = await fetch(
    `${config.url}/storage/v1/object/upload/sign/${encodeURIComponent(input.bucket)}/${encodeStorageObjectPath(input.objectPath)}`,
    {
      method: "POST",
      cache: "no-store",
      headers: {
        apikey: config.serviceRoleKey,
        Authorization: `Bearer ${config.serviceRoleKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase storage signed upload failed: ${response.status} ${message}`);
  }

  const data = (await response.json()) as { url?: string };

  if (!data.url) {
    throw new Error("Supabase storage signed upload response did not include a URL.");
  }

  const signedUrl = data.url.startsWith("http")
    ? new URL(data.url)
    : new URL(`${config.url}/storage/v1${data.url.startsWith("/") ? "" : "/"}${data.url}`);
  const token = signedUrl.searchParams.get("token");

  if (!token) {
    throw new Error("Supabase storage signed upload response did not include a token.");
  }

  return {
    bucket: input.bucket,
    objectPath: input.objectPath,
    signedUrl: signedUrl.toString(),
    publicUrl: getPublicStorageObjectUrl(config.url, input.bucket, input.objectPath),
    token,
  };
}

export async function uploadSupabaseStorageObject(input: SupabaseStorageUploadInput) {
  const config = readSupabaseServerConfig();

  if (!config) {
    throw new Error("Supabase Storage environment variables are not configured.");
  }

  const response = await fetch(
    `${config.url}/storage/v1/object/${encodeURIComponent(input.bucket)}/${encodeStorageObjectPath(input.objectPath)}`,
    {
      method: "POST",
      cache: "no-store",
      headers: {
        apikey: config.serviceRoleKey,
        Authorization: `Bearer ${config.serviceRoleKey}`,
        "Content-Type": input.contentType,
        "x-upsert": "false",
      },
      body: input.body,
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase storage upload failed: ${response.status} ${message}`);
  }

  return getPublicStorageObjectUrl(config.url, input.bucket, input.objectPath);
}

export function parseSupabasePublicStorageUrl(assetUrl: string): SupabaseStorageObjectRef | null {
  const config = readSupabaseServerConfig();

  if (!config || !assetUrl.startsWith(config.url)) {
    return null;
  }

  try {
    const url = new URL(assetUrl);
    const publicObjectPrefix = "/storage/v1/object/public/";

    if (!url.pathname.startsWith(publicObjectPrefix)) {
      return null;
    }

    const [bucket, ...objectPathParts] = url.pathname.slice(publicObjectPrefix.length).split("/");
    const objectPath = objectPathParts.map(decodeURIComponent).join("/");

    if (!bucket || !objectPath) {
      return null;
    }

    return {
      bucket: decodeURIComponent(bucket),
      objectPath,
    };
  } catch {
    return null;
  }
}

export async function deleteSupabaseStorageObjects(objects: SupabaseStorageObjectRef[]) {
  const config = readSupabaseServerConfig();

  if (!config || objects.length === 0) {
    return;
  }

  const objectsByBucket = new Map<string, string[]>();

  for (const object of objects) {
    const paths = objectsByBucket.get(object.bucket) ?? [];
    paths.push(object.objectPath);
    objectsByBucket.set(object.bucket, paths);
  }

  for (const [bucket, objectPaths] of objectsByBucket) {
    for (let index = 0; index < objectPaths.length; index += 1000) {
      const prefixes = objectPaths.slice(index, index + 1000);
      const response = await fetch(`${config.url}/storage/v1/object/${encodeURIComponent(bucket)}`, {
        method: "DELETE",
        cache: "no-store",
        headers: {
          apikey: config.serviceRoleKey,
          Authorization: `Bearer ${config.serviceRoleKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prefixes }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(`Supabase storage delete failed: ${response.status} ${message}`);
      }
    }
  }
}
