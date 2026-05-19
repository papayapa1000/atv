import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("admin topbar follows the public site menu order and omits logout", () => {
  const source = readFileSync("src/components/admin/AdminTopbar.tsx", "utf8");

  assert.equal(source.includes("logoutAdminAction"), false);
  assert.equal(source.includes("SignOut"), false);
  assert.equal(source.includes("로그아웃"), false);
  assert.equal(source.includes('label: "공지사항"'), false);

  const reservationIndex = source.indexOf('label: "예약게시판"');
  const galleryIndex = source.indexOf('label: "갤러리"');
  const videosIndex = source.indexOf('label: "동영상"');
  const showcaseIndex = source.indexOf('label: "자랑하기"');
  const stayIndex = source.indexOf('label: "주변 숙박"');

  assert.equal(reservationIndex > -1, true);
  assert.equal(reservationIndex < galleryIndex, true);
  assert.equal(galleryIndex < videosIndex, true);
  assert.equal(videosIndex < showcaseIndex, true);
  assert.equal(showcaseIndex < stayIndex, true);
});
