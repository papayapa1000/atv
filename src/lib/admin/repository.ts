import "server-only";

import { supabaseRest } from "@/lib/supabase/rest";
import { mergeLegacyAdminNoteReply } from "@/lib/reservations/replies";
import { formatReservationTime, maskPhoneNumber, type ReservationStatus } from "@/lib/reservations/validation";
import type { SupabaseReservationRow } from "@/lib/reservations/repository";

type AdminUserRow = {
  id: string;
  username: string;
  password: string;
};

type AdminSessionRow = {
  id: string;
  token_hash: string;
  expires_at: string;
};

export type AdminReservationItem = {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  maskedPhone: string;
  peopleCount: number;
  reservationSummary: string;
  leisureType: string;
  depositorName: string;
  message: string;
  status: ReservationStatus;
  adminNote: string;
  replies: AdminReservationReply[];
};

export type AdminReservationReply = {
  id: string;
  createdAt: string;
  authorType: "customer" | "admin";
  message: string;
};

type AdminReservationReplyRow = {
  id: string;
  created_at: string;
  author_type: "customer" | "admin";
  message: string;
};

type AdminReservationRow = SupabaseReservationRow & {
  reservation_replies?: AdminReservationReplyRow[];
};

const reservationSelect =
  "id,created_at,updated_at,customer_name,phone,people_count,reservation_date,reservation_period,reservation_hour,leisure_type,depositor_name,message,status,admin_note,reservation_replies(id,created_at,author_type,message)";

function toAdminReservationItem(row: AdminReservationRow): AdminReservationItem {
  const replies = (row.reservation_replies ?? []).map((reply) => ({
    id: reply.id,
    createdAt: reply.created_at,
    authorType: reply.author_type,
    message: reply.message,
  }));

  return {
    id: row.id,
    createdAt: row.created_at,
    customerName: row.customer_name,
    phone: row.phone,
    maskedPhone: maskPhoneNumber(row.phone),
    peopleCount: row.people_count,
    reservationSummary: formatReservationTime(row.reservation_date, row.reservation_period, row.reservation_hour, row.people_count),
    leisureType: row.leisure_type ?? "예약 문의",
    depositorName: row.depositor_name ?? "",
    message: row.message ?? "",
    status: row.status,
    adminNote: row.admin_note ?? "",
    replies: mergeLegacyAdminNoteReply(
      {
        id: row.id,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        adminNote: row.admin_note ?? "",
      },
      replies,
    ),
  };
}

export async function findAdminUser() {
  const rows = await supabaseRest<AdminUserRow[]>("admin_users?select=id,username,password&limit=1");

  return rows[0] ?? null;
}

export async function createAdminSession(input: { adminUserId: string; tokenHash: string; expiresAt: string }) {
  await supabaseRest<AdminSessionRow[]>("admin_sessions?select=id", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      admin_user_id: input.adminUserId,
      token_hash: input.tokenHash,
      expires_at: input.expiresAt,
    }),
  });
}

export async function findValidAdminSession(tokenHash: string) {
  const rows = await supabaseRest<AdminSessionRow[]>(
    `admin_sessions?select=id,token_hash,expires_at&token_hash=eq.${encodeURIComponent(tokenHash)}&expires_at=gt.${encodeURIComponent(
      new Date().toISOString(),
    )}&limit=1`,
  );

  return rows[0] ?? null;
}

export async function deleteAdminSession(tokenHash: string) {
  await supabaseRest<null>(`admin_sessions?token_hash=eq.${encodeURIComponent(tokenHash)}`, {
    method: "DELETE",
  });
}

export async function listAdminReservations(limit = 100) {
  const safeLimit = Math.min(Math.max(limit, 1), 200);
  const rows = await supabaseRest<AdminReservationRow[]>(
    `reservation_posts?select=${reservationSelect}&order=created_at.desc&reservation_replies.order=created_at.asc&limit=${safeLimit}`,
  );

  return rows.map(toAdminReservationItem);
}

export async function updateReservationAdminFields(input: {
  id: string;
  status: ReservationStatus;
}) {
  await supabaseRest<SupabaseReservationRow[]>(`reservation_posts?id=eq.${encodeURIComponent(input.id)}&select=id`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      status: input.status,
    }),
  });
}

export async function deleteReservationPost(id: string) {
  await supabaseRest<null>(`reservation_posts?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
