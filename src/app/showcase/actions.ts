"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createShowcasePost } from "@/lib/showcase/repository";
import { saveUploadedShowcaseImages } from "@/lib/showcase/uploads";
import { normalizeShowcasePostForm, validateShowcasePostForm } from "@/lib/showcase/validation";

export type ShowcaseActionState = {
  message: string;
  errors: Record<string, string>;
  values: Record<string, string>;
};

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function createShowcaseAction(
  _previousState: ShowcaseActionState,
  formData: FormData,
): Promise<ShowcaseActionState> {
  const values = {
    authorName: getFormValue(formData, "authorName"),
    title: getFormValue(formData, "title"),
    content: getFormValue(formData, "content"),
  };

  if (getFormValue(formData, "website")) {
    redirect("/showcase");
  }

  const normalized = normalizeShowcasePostForm({
    ...values,
    imageFiles: formData.getAll("imageFiles"),
  });
  const result = validateShowcasePostForm(normalized);

  if (!result.ok) {
    return {
      message: "입력 내용을 다시 확인해 주세요.",
      errors: result.errors,
      values,
    };
  }

  try {
    const { imageFiles, ...postData } = result.data;
    const imageUrls = imageFiles.length > 0 ? await saveUploadedShowcaseImages(imageFiles) : [];

    await createShowcasePost({
      ...postData,
      imageUrls,
    });

    revalidatePath("/showcase");
    revalidatePath("/admin/showcase");
  } catch {
    return {
      message: "게시글 저장 중 문제가 발생했습니다. Supabase 설정과 showcase_posts 테이블을 확인해 주세요.",
      errors: {},
      values,
    };
  }

  redirect("/showcase");
}
