import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";

export const dynamic = "force-dynamic";

type VideoUploadRouteContext = {
  params: Promise<{
    fileName: string;
  }>;
};

const contentTypeByExtension: Record<string, string> = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".m4v": "video/x-m4v",
};

function resolveVideoUploadPath(fileName: string) {
  const safeFileName = path.basename(fileName);

  if (safeFileName !== fileName) {
    return null;
  }

  const extension = path.extname(safeFileName).toLowerCase();

  if (!contentTypeByExtension[extension]) {
    return null;
  }

  return path.join(process.cwd(), "public", "uploads", "videos", safeFileName);
}

function parseRange(rangeHeader: string | null, size: number) {
  if (!rangeHeader) {
    return null;
  }

  const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader);

  if (!match) {
    return null;
  }

  const [, rawStart, rawEnd] = match;
  const suffixLength = rawStart ? null : Number(rawEnd);
  const start = rawStart ? Number(rawStart) : Math.max(size - (suffixLength || 0), 0);
  const end = rawEnd && rawStart ? Number(rawEnd) : size - 1;

  if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end < start || start >= size) {
    return "invalid" as const;
  }

  return {
    start,
    end: Math.min(end, size - 1),
  };
}

async function handleVideoUploadRequest(request: Request, context: VideoUploadRouteContext, includeBody: boolean) {
  const { fileName } = await context.params;
  const filePath = resolveVideoUploadPath(fileName);

  if (!filePath) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const fileStat = await stat(filePath);
    const contentType = contentTypeByExtension[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";
    const range = parseRange(request.headers.get("range"), fileStat.size);
    const baseHeaders = {
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": contentType,
    };

    if (range === "invalid") {
      return new Response(null, {
        status: 416,
        headers: {
          ...baseHeaders,
          "Content-Range": `bytes */${fileStat.size}`,
        },
      });
    }

    if (range) {
      const stream = includeBody ? (Readable.toWeb(createReadStream(filePath, range)) as unknown as BodyInit) : null;

      return new Response(stream, {
        status: 206,
        headers: {
          ...baseHeaders,
          "Content-Length": String(range.end - range.start + 1),
          "Content-Range": `bytes ${range.start}-${range.end}/${fileStat.size}`,
        },
      });
    }

    const stream = includeBody ? (Readable.toWeb(createReadStream(filePath)) as unknown as BodyInit) : null;

    return new Response(stream, {
      headers: {
        ...baseHeaders,
        "Content-Length": String(fileStat.size),
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

export async function GET(request: Request, context: VideoUploadRouteContext) {
  return handleVideoUploadRequest(request, context, true);
}

export async function HEAD(request: Request, context: VideoUploadRouteContext) {
  return handleVideoUploadRequest(request, context, false);
}
