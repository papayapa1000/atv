import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/session";
import { createSignedVideoUpload } from "@/lib/videos/uploads";
import { validateVideoUploadMetadata } from "@/lib/videos/validation";

type VideoUploadUrlRequest = {
  fileName?: unknown;
  contentType?: unknown;
  size?: unknown;
};

function readUploadRequest(value: VideoUploadUrlRequest) {
  return {
    name: typeof value.fileName === "string" ? value.fileName : "",
    type: typeof value.contentType === "string" ? value.contentType : "",
    size: typeof value.size === "number" && Number.isFinite(value.size) ? value.size : 0,
  };
}

export async function POST(request: Request) {
  await requireAdminSession();

  const uploadRequest = readUploadRequest((await request.json()) as VideoUploadUrlRequest);
  const fileError = validateVideoUploadMetadata(uploadRequest);

  if (!uploadRequest.name || fileError) {
    return NextResponse.json({ message: fileError || "동영상 파일 정보를 확인해 주세요." }, { status: 400 });
  }

  try {
    const upload = await createSignedVideoUpload(uploadRequest);

    return NextResponse.json({
      signedUrl: upload.signedUrl,
      publicUrl: upload.publicUrl,
      objectPath: upload.objectPath,
    });
  } catch {
    return NextResponse.json({ message: "동영상 업로드 URL을 생성하지 못했습니다." }, { status: 500 });
  }
}
