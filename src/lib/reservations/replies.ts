import type { ReservationReplyView } from "./public-types";

type LegacyAdminNoteSource = {
  id: string;
  createdAt: string;
  updatedAt?: string | null;
  adminNote: string;
};

export function sortReservationRepliesByCreatedAt(replies: ReservationReplyView[]) {
  return [...replies].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function mergeLegacyAdminNoteReply(source: LegacyAdminNoteSource, replies: ReservationReplyView[]) {
  const adminNote = source.adminNote.trim();

  if (!adminNote) {
    return sortReservationRepliesByCreatedAt(replies);
  }

  return sortReservationRepliesByCreatedAt([
    ...replies,
    {
      id: `${source.id}-legacy-admin-note`,
      // Legacy admin_note rows do not have their own created_at. Do not use updatedAt here;
      // saving a new admin reply updates the reservation row and would move old notes forward.
      createdAt: source.createdAt,
      authorType: "admin",
      message: adminNote,
    },
  ]);
}
