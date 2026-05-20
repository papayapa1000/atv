"use client";

import { AdminDeleteConfirmButton } from "./AdminDeleteConfirmButton";

type AdminReservationDeleteFormProps = {
  id: string;
  action: (formData: FormData) => void | Promise<void>;
};

export function AdminReservationDeleteForm({ id, action }: AdminReservationDeleteFormProps) {
  return (
    <div className="border border-sunset/25 bg-white p-3">
      <AdminDeleteConfirmButton
        id={id}
        action={action}
        label="예약글 삭제"
        message="정말 이 예약글을 삭제하시겠습니까?"
        className="spring inline-flex w-full items-center justify-center gap-2 border border-sunset/30 px-4 py-2.5 text-sm font-semibold text-sunset hover:-translate-y-0.5 hover:bg-sunset hover:text-white"
      />
    </div>
  );
}
