import assert from "node:assert/strict";
import test from "node:test";
import { mergeLegacyAdminNoteReply } from "../src/lib/reservations/replies";

test("legacy admin notes keep a stable timestamp when reservation rows are updated", () => {
  const replies = mergeLegacyAdminNoteReply(
    {
      id: "reservation-1",
      createdAt: "2026-05-18T01:00:00.000Z",
      updatedAt: "2026-05-19T06:00:00.000Z",
      adminNote: "기존 관리자 답글",
    },
    [
      {
        id: "reply-1",
        createdAt: "2026-05-19T06:00:00.000Z",
        authorType: "admin",
        message: "새 관리자 답글",
      },
    ],
  );

  assert.deepEqual(
    replies.map((reply) => ({
      id: reply.id,
      createdAt: reply.createdAt,
      message: reply.message,
    })),
    [
      {
        id: "reservation-1-legacy-admin-note",
        createdAt: "2026-05-18T01:00:00.000Z",
        message: "기존 관리자 답글",
      },
      {
        id: "reply-1",
        createdAt: "2026-05-19T06:00:00.000Z",
        message: "새 관리자 답글",
      },
    ],
  );
});
