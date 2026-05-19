export type RawReservationReply = {
  message?: FormDataEntryValue | string | null;
};

export type NormalizedReservationReply = {
  message: string;
};

export type ReservationReplyValidationResult =
  | { ok: true; data: NormalizedReservationReply; errors: Record<string, never> }
  | { ok: false; data: NormalizedReservationReply; errors: Record<string, string> };

function fieldToString(value: FormDataEntryValue | string | null | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeReservationReply(input: RawReservationReply): NormalizedReservationReply {
  return {
    message: fieldToString(input.message),
  };
}

export function validateReservationReply(data: NormalizedReservationReply): ReservationReplyValidationResult {
  const errors: Record<string, string> = {};

  if (!data.message) {
    errors.message = "답글 내용을 입력해 주세요.";
  }

  if (data.message.length > 1000) {
    errors.message = "답글 내용은 1,000자 이하로 입력해 주세요.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, data, errors };
  }

  return { ok: true, data, errors: {} };
}
