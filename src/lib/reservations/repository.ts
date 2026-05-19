import "server-only";

import { createPasswordHash } from "@/lib/admin/crypto";
import { supabaseRest } from "@/lib/supabase/rest";
import {
  formatReservationTime,
  maskPhoneNumber,
  normalizeReservationBoardPage,
  type ReservationBoardPageMeta,
  type NormalizedReservationForm,
  type ReservationPeriod,
  type ReservationStatus,
} from "./validation";
import type { CustomerReservationDetail, ReservationBoardSummary, ReservationReplyView } from "./public-types";

export type SupabaseReservationRow = {
  id: string;
  created_at: string;
  updated_at?: string;
  customer_name: string;
  password_hash?: string;
  phone: string;
  people_count: number;
  reservation_date: string;
  reservation_period: ReservationPeriod;
  reservation_hour: number;
  leisure_type: string | null;
  depositor_name?: string | null;
  message?: string | null;
  status: ReservationStatus;
  admin_note?: string | null;
};

type SupabaseReservationReplyRow = {
  id: string;
  created_at: string;
  reservation_id: string;
  author_type: "customer" | "admin";
  message: string;
};

export type ReservationBoardItem = ReservationBoardSummary;

export type ReservationDetail = ReservationBoardItem & {
  updatedAt: string;
  phone: string;
  depositorName: string;
  message: string;
  adminNote: string;
  passwordHash: string;
};

export type ReservationReply = ReservationReplyView;

export type ReservationBoardPage = ReservationBoardPageMeta & {
  items: ReservationBoardItem[];
};

const boardSelect =
  "id,created_at,customer_name,phone,people_count,reservation_date,reservation_period,reservation_hour,leisure_type,status";
const detailSelect =
  "id,created_at,updated_at,customer_name,password_hash,phone,people_count,reservation_date,reservation_period,reservation_hour,leisure_type,depositor_name,message,status,admin_note";

function toBoardItem(row: SupabaseReservationRow): ReservationBoardItem {
  return {
    id: row.id,
    createdAt: row.created_at,
    customerName: row.customer_name,
    maskedPhone: maskPhoneNumber(row.phone),
    peopleCount: row.people_count,
    reservationDate: row.reservation_date,
    reservationPeriod: row.reservation_period,
    reservationHour: row.reservation_hour,
    reservationSummary: formatReservationTime(row.reservation_date, row.reservation_period, row.reservation_hour, row.people_count),
    leisureType: row.leisure_type ?? "예약 문의",
    status: row.status,
  };
}

function toReservationDetail(row: SupabaseReservationRow): ReservationDetail {
  return {
    ...toBoardItem(row),
    updatedAt: row.updated_at ?? row.created_at,
    phone: row.phone,
    depositorName: row.depositor_name ?? "",
    message: row.message ?? "",
    adminNote: row.admin_note ?? "",
    passwordHash: row.password_hash ?? "",
  };
}

export function toCustomerReservationDetail(post: ReservationDetail): CustomerReservationDetail {
  return {
    id: post.id,
    createdAt: post.createdAt,
    customerName: post.customerName,
    maskedPhone: post.maskedPhone,
    peopleCount: post.peopleCount,
    reservationDate: post.reservationDate,
    reservationPeriod: post.reservationPeriod,
    reservationHour: post.reservationHour,
    reservationSummary: post.reservationSummary,
    leisureType: post.leisureType,
    status: post.status,
    phone: post.phone,
    depositorName: post.depositorName,
    message: post.message,
    adminNote: post.adminNote,
  };
}

export async function createReservationPost(input: NormalizedReservationForm) {
  const passwordHash = await createPasswordHash(input.password);

  const [created] = await supabaseRest<SupabaseReservationRow[]>("reservation_posts?select=id", {
    method: "POST",
    headers: {
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      customer_name: input.customerName,
      password_hash: passwordHash,
      phone: input.phone,
      people_count: input.peopleCount,
      reservation_date: input.reservationDate,
      reservation_period: input.reservationPeriod,
      reservation_hour: input.reservationHour,
      leisure_type: input.leisureType || null,
      depositor_name: input.depositorName || null,
      message: input.message || null,
      status: "pending",
    }),
  });

  return created;
}

export async function countReservationPosts() {
  const rows = await supabaseRest<Array<{ id: string }>>("reservation_posts?select=id&limit=10000");

  return rows.length;
}

export async function listReservationPosts(limit = 10, offset = 0): Promise<ReservationBoardItem[]> {
  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const safeOffset = Math.max(offset, 0);
  const rows = await supabaseRest<SupabaseReservationRow[]>(
    `reservation_posts?select=${boardSelect}&order=created_at.desc&limit=${safeLimit}&offset=${safeOffset}`,
  );

  return rows.map(toBoardItem);
}

export async function listReservationPostsPage(rawPage?: string | number | null, pageSize = 10): Promise<ReservationBoardPage> {
  const totalCount = await countReservationPosts();
  const meta = normalizeReservationBoardPage(rawPage, totalCount, pageSize);
  const items = await listReservationPosts(meta.pageSize, meta.offset);

  return {
    ...meta,
    items,
  };
}

export async function getReservationBoardItem(id: string) {
  const rows = await supabaseRest<SupabaseReservationRow[]>(
    `reservation_posts?select=${boardSelect}&id=eq.${encodeURIComponent(id)}&limit=1`,
  );

  return rows[0] ? toBoardItem(rows[0]) : null;
}

export async function getReservationDetail(id: string) {
  const rows = await supabaseRest<SupabaseReservationRow[]>(
    `reservation_posts?select=${detailSelect}&id=eq.${encodeURIComponent(id)}&limit=1`,
  );

  return rows[0] ? toReservationDetail(rows[0]) : null;
}

export async function listReservationReplies(reservationId: string): Promise<ReservationReply[]> {
  const rows = await supabaseRest<SupabaseReservationReplyRow[]>(
    `reservation_replies?select=id,created_at,reservation_id,author_type,message&reservation_id=eq.${encodeURIComponent(
      reservationId,
    )}&order=created_at.asc`,
  );

  return rows.map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    authorType: row.author_type,
    message: row.message,
  }));
}

export async function createReservationReply(input: {
  reservationId: string;
  authorType: "customer" | "admin";
  message: string;
}) {
  await supabaseRest<SupabaseReservationReplyRow[]>("reservation_replies?select=id", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      reservation_id: input.reservationId,
      author_type: input.authorType,
      message: input.message,
    }),
  });
}
