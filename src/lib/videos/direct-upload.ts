import { validateVideoUploadMetadata } from "./validation";

type SignedVideoUploadResponse = {
  signedUrl?: string;
  publicUrl?: string;
  objectPath?: string;
  message?: string;
};

export type DirectVideoUploadResult = {
  publicUrl: string;
  objectPath: string;
};

async function readJsonResponse(response: Response) {
  try {
    return (await response.json()) as SignedVideoUploadResponse;
  } catch {
    return {};
  }
}

export async function uploadVideoFileDirectly(file: File): Promise<DirectVideoUploadResult> {
  const fileError = validateVideoUploadMetadata(file);

  if (fileError) {
    throw new Error(fileError);
  }

  const signResponse = await fetch("/admin/videos/upload-url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type,
      size: file.size,
    }),
  });
  const signData = await readJsonResponse(signResponse);

  if (!signResponse.ok || !signData.signedUrl || !signData.publicUrl || !signData.objectPath) {
    throw new Error(signData.message || "동영상 업로드 URL을 생성하지 못했습니다.");
  }

  const uploadBody = new FormData();
  uploadBody.append("cacheControl", "3600");
  uploadBody.append("", file);

  const uploadResponse = await fetch(signData.signedUrl, {
    method: "PUT",
    body: uploadBody,
  });

  if (!uploadResponse.ok) {
    const message = await uploadResponse.text();

    throw new Error(
      uploadResponse.status === 413
        ? "영상 파일이 현재 Supabase Storage 업로드 제한을 초과했습니다. 250MB 이하 파일로 압축한 뒤 등록해 주세요."
        : message || "동영상 파일 업로드에 실패했습니다.",
    );
  }

  return {
    publicUrl: signData.publicUrl,
    objectPath: signData.objectPath,
  };
}
