"use server";

import { revalidatePath } from "next/cache";
import { verifyPasswordHash } from "@/lib/admin/crypto";
import {
  createReservationReply,
  getReservationDetail,
  listReservationReplies,
  toCustomerReservationDetail,
} from "@/lib/reservations/repository";
import { mergeLegacyAdminNoteReply } from "@/lib/reservations/replies";
import { normalizeReservationReply, validateReservationReply } from "@/lib/reservations/reply-validation";
import type { ReservationDetailActionState } from "@/lib/reservations/public-types";

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function lockedState(id: string, message: string): ReservationDetailActionState {
  return {
    status: "locked",
    id,
    message,
  };
}

async function loadUnlockedReservation(
  id: string,
  password: string,
  message = "",
  replyError = false,
): Promise<ReservationDetailActionState> {
  const post = await getReservationDetail(id);

  if (!post) {
    return lockedState(id, "예약글을 찾을 수 없습니다.");
  }

  const isValid = await verifyPasswordHash(password, post.passwordHash);

  if (!isValid) {
    return lockedState(id, "비밀번호가 올바르지 않습니다.");
  }

  const replies = mergeLegacyAdminNoteReply(post, await listReservationReplies(id));

  return {
    status: "unlocked",
    id,
    password,
    post: toCustomerReservationDetail(post),
    replies,
    message,
    replyError,
  };
}

export async function submitReservationDetailAction(
  _previousState: ReservationDetailActionState,
  formData: FormData,
): Promise<ReservationDetailActionState> {
  const id = getFormValue(formData, "id");
  const password = getFormValue(formData, "password");
  const intent = getFormValue(formData, "intent");

  if (!id) {
    return lockedState("", "예약글을 찾을 수 없습니다.");
  }

  if (!password) {
    return lockedState(id, "비밀번호를 입력해 주세요.");
  }

  if (intent !== "reply") {
    return loadUnlockedReservation(id, password);
  }

  const unlockedState = await loadUnlockedReservation(id, password);

  if (unlockedState.status === "locked") {
    return unlockedState;
  }

  const normalized = normalizeReservationReply({
    message: formData.get("message"),
  });
  const result = validateReservationReply(normalized);

  if (!result.ok) {
    return {
      ...unlockedState,
      message: result.errors.message ?? "답글 내용을 입력해 주세요.",
      replyError: true,
    };
  }

  await createReservationReply({
    reservationId: id,
    authorType: "customer",
    message: result.data.message,
  });

  revalidatePath(`/reservation/board/${id}`);

  return loadUnlockedReservation(id, password, "답글이 등록되었습니다.");
}
