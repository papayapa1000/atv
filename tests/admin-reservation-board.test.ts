import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("admin reservation list fetches and renders all reservation replies", () => {
  const repositorySource = readFileSync("src/lib/admin/repository.ts", "utf8");
  const pageSource = readFileSync("src/app/admin/reservations/page.tsx", "utf8");

  assert.equal(repositorySource.includes("reservation_replies(id,created_at,author_type,message)"), true);
  assert.equal(repositorySource.includes("mergeLegacyAdminNoteReply"), true);
  assert.equal(pageSource.includes("item.replies.length > 0"), true);
  assert.equal(pageSource.includes("item.replies.map"), true);
});

test("admin reply submissions append admin replies instead of overwriting admin notes", () => {
  const actionSource = readFileSync("src/app/admin/actions.ts", "utf8");
  const repositorySource = readFileSync("src/lib/admin/repository.ts", "utf8");

  assert.equal(actionSource.includes("createReservationReply"), true);
  assert.equal(actionSource.includes('authorType: "admin"'), true);
  assert.equal(actionSource.includes("revalidatePath(`/reservation/board/${id}`)"), true);
  assert.equal(actionSource.includes("adminNote: result.data.adminNote"), false);
  assert.equal(repositorySource.includes("admin_note: input.adminNote"), false);
});

test("admin reservation posts can be deleted from the reservation management page", () => {
  const actionSource = readFileSync("src/app/admin/actions.ts", "utf8");
  const repositorySource = readFileSync("src/lib/admin/repository.ts", "utf8");
  const pageSource = readFileSync("src/app/admin/reservations/page.tsx", "utf8");
  const deleteFormSource = readFileSync("src/components/admin/AdminReservationDeleteForm.tsx", "utf8");

  assert.equal(actionSource.includes("deleteAdminReservationAction"), true);
  assert.equal(actionSource.includes("deleteReservationPost"), true);
  assert.equal(actionSource.includes('redirect("/admin/reservations?deleted=1")'), true);
  assert.equal(repositorySource.includes("export async function deleteReservationPost"), true);
  assert.equal(pageSource.includes("AdminReservationDeleteForm"), true);
  assert.equal(deleteFormSource.includes('"use client"'), true);
  assert.equal(deleteFormSource.includes("AdminDeleteConfirmButton"), true);
  assert.equal(deleteFormSource.includes("window.confirm"), false);
  assert.equal(deleteFormSource.includes("정말 이 예약글을 삭제하시겠습니까?"), true);
  assert.equal(deleteFormSource.includes("예약글 삭제"), true);
  assert.equal(deleteFormSource.includes("예약글 삭제"), true);
});

test("reservation comments render as a single chronological stream", () => {
  const adminPageSource = readFileSync("src/app/admin/reservations/page.tsx", "utf8");
  const detailActionSource = readFileSync("src/app/reservation/board/[id]/actions.ts", "utf8");
  const detailClientSource = readFileSync("src/components/reservation/ReservationDetailClient.tsx", "utf8");

  assert.equal(adminPageSource.includes("(item.adminNote ? 1 : 0) + item.replies.length"), false);
  assert.equal(adminPageSource.includes("defaultValue={item.adminNote}"), false);
  assert.equal(adminPageSource.includes('placeholder="새 관리자 답글을 입력하세요."'), true);
  assert.equal(detailActionSource.includes("mergeLegacyAdminNoteReply"), true);
  assert.equal(detailClientSource.includes("post.adminNote ?"), false);
});

test("admin reservation comments use distinct customer and admin colors", () => {
  const pageSource = readFileSync("src/app/admin/reservations/page.tsx", "utf8");
  const replyToneBlock = pageSource.slice(pageSource.indexOf("function replyToneClass"), pageSource.indexOf("export default"));

  assert.equal(pageSource.includes("function replyToneClass"), true);
  assert.equal(pageSource.includes("border-lake bg-white"), true);
  assert.equal(pageSource.includes("border-sun bg-white"), true);
  assert.equal(replyToneBlock.includes("bg-lake/8"), false);
  assert.equal(replyToneBlock.includes("bg-sun/12"), false);
  assert.equal(pageSource.includes("const tone = replyToneClass(reply.authorType)"), true);
});

test("admin reservation cards use a compact management layout", () => {
  const pageSource = readFileSync("src/app/admin/reservations/page.tsx", "utf8");

  assert.equal(pageSource.includes("mt-8 grid gap-3"), true);
  assert.equal(pageSource.includes("border border-foreground/12 bg-surface p-4"), true);
  assert.equal(pageSource.includes("shadow-[0_12px_20px_-16px_rgba(107,114,128,0.65)]"), true);
  assert.equal(pageSource.includes("xl:grid-cols-[minmax(0,1fr)_20rem]"), true);
  assert.equal(pageSource.includes("xl:items-start"), true);
  assert.equal(pageSource.includes("self-start"), true);
  assert.equal(pageSource.includes("rows={4}"), true);
});

test("admin reservation message body is visually emphasized", () => {
  const pageSource = readFileSync("src/app/admin/reservations/page.tsx", "utf8");

  assert.equal(pageSource.includes("border border-foreground/10 bg-surface-muted/52 p-3"), false);
  assert.equal(
    pageSource.includes(
      "border border-lake/16 border-l-4 border-l-lake bg-white p-4 shadow-[0_14px_26px_-22px_rgba(75,85,99,0.7)]",
    ),
    true,
  );
  assert.equal(pageSource.includes("mb-2 text-xs font-bold uppercase tracking-[0.08em] text-lake"), true);
  assert.equal(pageSource.includes("whitespace-pre-line text-sm font-semibold leading-7 text-foreground"), true);
});

test("admin reservation status badges match public board colors", () => {
  const pageSource = readFileSync("src/app/admin/reservations/page.tsx", "utf8");

  assert.equal(pageSource.includes('return "border-gray-300 bg-gray-100 text-gray-700";'), true);
  assert.equal(pageSource.includes('return "border-sun bg-sun text-white";'), true);
  assert.equal(pageSource.includes('return "border-sun/30 bg-sun/24 text-deep";'), false);
  assert.equal(pageSource.includes('return "border-sunset/24 bg-sunset/12 text-sunset";'), false);
});

test("admin reservation status select uses soft colors by status", () => {
  const pageSource = readFileSync("src/app/admin/reservations/page.tsx", "utf8");

  assert.equal(pageSource.includes("function statusSelectClass"), true);
  assert.equal(pageSource.includes('return "border-lake/25 bg-lake/8 text-lake";'), true);
  assert.equal(pageSource.includes('return "border-sun/35 bg-sun/12 text-deep";'), true);
  assert.equal(pageSource.includes('return "border-gray-300 bg-gray-50 text-gray-700";'), true);
  assert.equal(pageSource.includes("${statusSelectClass(item.status)}"), true);
});

test("admin reservation header does not show the status summary strip", () => {
  const pageSource = readFileSync("src/app/admin/reservations/page.tsx", "utf8");

  assert.equal(pageSource.includes("grid grid-cols-3 border border-foreground/12 bg-surface text-center text-sm font-semibold"), false);
  assert.equal(pageSource.includes('<div key={status} className="border-r border-foreground/10 px-4 py-3 last:border-r-0">'), false);
  assert.equal(pageSource.includes("statusSelectClass(item.status)"), true);
});
