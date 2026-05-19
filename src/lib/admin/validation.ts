import { reservationStatuses, type ReservationStatus } from "@/lib/reservations/validation";

export type RawAdminReservationUpdate = {
  status?: FormDataEntryValue | string | null;
  adminNote?: FormDataEntryValue | string | null;
};

export type NormalizedAdminReservationUpdate = {
  status: ReservationStatus | "";
  adminNote: string;
};

type ValidAdminReservationUpdate = Omit<NormalizedAdminReservationUpdate, "status"> & {
  status: ReservationStatus;
};

export type AdminReservationValidationResult =
  | { ok: true; data: ValidAdminReservationUpdate; errors: Record<string, never> }
  | { ok: false; data: NormalizedAdminReservationUpdate; errors: Record<string, string> };

function fieldToString(value: FormDataEntryValue | string | null | undefined) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export function normalizeAdminReservationUpdate(input: RawAdminReservationUpdate): NormalizedAdminReservationUpdate {
  return {
    status: fieldToString(input.status) as ReservationStatus | "",
    adminNote: fieldToString(input.adminNote),
  };
}

export function validateAdminReservationUpdate(data: NormalizedAdminReservationUpdate): AdminReservationValidationResult {
  const errors: Record<string, string> = {};

  if (!reservationStatuses.includes(data.status as ReservationStatus)) {
    errors.status = "예약 상태를 선택해 주세요.";
  }

  if (data.adminNote.length > 1000) {
    errors.adminNote = "관리자 답글은 1,000자 이하로 입력해 주세요.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, data, errors };
  }

  return { ok: true, data: data as ValidAdminReservationUpdate, errors: {} };
}
