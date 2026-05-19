"use server";

import { redirect } from "next/navigation";
import { createReservationPost } from "@/lib/reservations/repository";
import { normalizeReservationForm, validateReservationForm } from "@/lib/reservations/validation";

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
      message: "?낅젰 ?댁슜???ㅼ떆 ?뺤씤??二쇱꽭??",
      errors: result.errors,
      values,
    };
  }

  try {
    await createReservationPost(result.data);
  } catch (error) {
    console.error("Reservation insert failed", error);

    return {
      message: "?덉빟 臾몄쓽 ???以?臾몄젣媛 諛쒖깮?덉뒿?덈떎. ?좎떆 ???ㅼ떆 ?쒕룄?섍굅???꾪솕濡?臾몄쓽??二쇱꽭??",
      errors: {},
      values,
    };
  }

  redirect("/reservation/board?created=1");
}
