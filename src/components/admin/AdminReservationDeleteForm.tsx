"use client";

import type { FormEvent } from "react";
import { Trash } from "@phosphor-icons/react";

type AdminReservationDeleteFormProps = {
  id: string;
  action: (formData: FormData) => void | Promise<void>;
};

export function AdminReservationDeleteForm({ id, action }: AdminReservationDeleteFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm("정말 이 예약글을 삭제하시겠습니까?")) {
      event.preventDefault();
    }
  }

  return (
    <form action={action} onSubmit={handleSubmit} className="border border-sunset/25 bg-white p-3">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="spring inline-flex w-full items-center justify-center gap-2 border border-sunset/30 px-4 py-2.5 text-sm font-semibold text-sunset hover:-translate-y-0.5 hover:bg-sunset hover:text-white"
      >
        <Trash aria-hidden="true" className="h-4 w-4" weight="bold" />
        예약글 삭제
      </button>
    </form>
  );
}
