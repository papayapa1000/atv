"use server";

import { redirect } from "next/navigation";
import { createReservationPost } from "@/lib/reservations/repository";
import { normalizeReservationForm, validateReservationForm } from "@/lib/reservations/validation";
import { sendReservationCreatedNotification } from "@/lib/notifications/reservation-email";

export type ReservationActionState = {
  message: string;
  errors: Record<string, string>;
  values: Record<string, string>;
};

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function createReservationAction(
  _previousState: ReservationActionState,
  formData: FormData,
): Promise<ReservationActionState> {
  const values = {
    customerName: getFormValue(formData, "customerName"),
    password: getFormValue(formData, "password"),
    phone: getFormValue(formData, "phone"),
    peopleCount: getFormValue(formData, "peopleCount"),
    reservationDate: getFormValue(formData, "reservationDate"),
    reservationPeriod: getFormValue(formData, "reservationPeriod"),
    reservationHour: getFormValue(formData, "reservationHour"),
    leisureType: getFormValue(formData, "leisureType"),
    depositorName: getFormValue(formData, "depositorName"),
    message: getFormValue(formData, "message"),
    website: getFormValue(formData, "website"),
  };

  const normalized = normalizeReservationForm(values);
  const result = validateReservationForm(normalized);

  if (!result.ok) {
    return {
      message: "입력 내용을 다시 확인해 주세요.",
      errors: result.errors,
      values,
    };
  }

  try {
    const created = await createReservationPost(result.data);

    try {
      await sendReservationCreatedNotification({
        reservation: result.data,
        reservationId: created?.id,
      });
    } catch (error) {
      console.error("Reservation notification email failed", error);
    }
  } catch (error) {
    console.error("Reservation insert failed", error);

    return {
      message: "예약 문의 저장 중 문제가 발생했습니다. 잠시 후 다시 시도하거나 전화로 문의해 주세요.",
      errors: {},
      values,
    };
  }

  redirect("/reservation/board?created=1");
}
