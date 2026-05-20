import { readFile, stat } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

type StayUploadRouteContext = {
  params: Promise<{
    fileName: string;
  }>;
};

const contentTypeByExtension: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

function resolveStayUploadPath(fileName: string) {
  const safeFileName = path.basename(fileName);

  if (safeFileName !== fileName) {
    return null;
  }

  const extension = path.extname(safeFileName).toLowerCase();

  if (!contentTypeByExtension[extension]) {
    return null;
  }

  return path.join(process.cwd(), "public", "uploads", "stay", safeFileName);
}

async function handleStayUploadRequest(context: StayUploadRouteContext, includeBody: boolean) {
  const { fileName } = await context.params;
  const filePath = resolveStayUploadPath(fileName);

  if (!filePath) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const fileStat = await stat(filePath);
    const contentType = contentTypeByExtension[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";
    const headers = {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Length": String(fileStat.size),
      "Content-Type": contentType,
    };

    if (!includeBody) {
      return new Response(null, { headers });
    }

    const file = await readFile(filePath);

    return new Response(new Uint8Array(file), { headers });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

export async function GET(_request: Request, context: StayUploadRouteContext) {
  return handleStayUploadRequest(context, true);
}

export async function HEAD(_request: Request, context: StayUploadRouteContext) {
  return handleStayUploadRequest(context, false);
}
