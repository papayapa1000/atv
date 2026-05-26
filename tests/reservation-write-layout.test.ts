import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("reservation write page does not show the redundant deposit instruction under the title", () => {
  const source = readFileSync("src/app/reservation/write/page.tsx", "utf8");

  assert.equal(
    source.includes(
      "예약금 50,000원 선입금 후 아래 양식에 맞춰 예약 문의를 남겨 주세요. 접수된 글은 예약게시판에서 확인할 수 있습니다.",
    ),
    false,
  );
});

test("reservation write page uses a compact form layout", () => {
  const pageSource = readFileSync("src/app/reservation/write/page.tsx", "utf8");
  const formSource = readFileSync("src/components/reservation/ReservationWriteForm.tsx", "utf8");

  assert.equal(pageSource.includes('className="px-5 py-10 lg:px-8 lg:py-14"'), true);
  assert.equal(pageSource.includes('className="mx-auto grid max-w-[1180px] gap-6"'), true);
  assert.equal(pageSource.includes("lg:grid-cols-[minmax(0,1fr)_20rem]"), true);
  assert.equal(pageSource.includes('className="border border-foreground/12 bg-surface p-4 sm:p-6 lg:p-7"'), true);
  assert.equal(pageSource.includes('className="mt-3 text-2xl font-bold leading-tight sm:text-4xl"'), true);
  assert.equal(pageSource.includes('className="mt-7"'), true);

  assert.equal(formSource.includes("const fieldControlClass ="), true);
  assert.equal(formSource.includes('"mt-1.5 w-full border border-foreground/14 bg-white px-3 py-2.5 text-sm'), true);
  assert.equal(formSource.includes('const fieldLabelClass = "text-xs font-bold text-foreground"'), true);
  assert.equal(formSource.includes('<form action={formAction} className="grid gap-4">'), true);
  assert.equal(formSource.includes("rows={5}"), true);
  assert.equal(formSource.includes("px-5 py-3 text-sm"), true);
});

test("reservation write page places the account guide horizontally above the form", () => {
  const pageSource = readFileSync("src/app/reservation/write/page.tsx", "utf8");
  const accountSource = readFileSync("src/components/reservation/DepositAccountGuide.tsx", "utf8");
  const accountGuideIndex = pageSource.indexOf('<DepositAccountGuide layout="horizontal" headingLevel="h2" wideFirstAccount showDepositAmount />');
  const formGridIndex = pageSource.indexOf('className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]"');
  const accountNumberLabelIndex = accountSource.indexOf('<dt className="font-bold text-foreground/58">계좌번호</dt>');
  const depositLabelIndex = accountSource.indexOf('<dt className="font-bold text-foreground/58">예약금</dt>');

  assert.equal(pageSource.includes('import { DepositAccountGuide } from "@/components/reservation/DepositAccountGuide";'), true);
  assert.equal(accountGuideIndex > -1, true);
  assert.equal(formGridIndex > -1, true);
  assert.equal(accountGuideIndex < formGridIndex, true);
  assert.equal(pageSource.includes('<DepositAccountGuide compact headingLevel="h2" />'), false);
  assert.equal(accountSource.includes('layout?: "stacked" | "horizontal";'), true);
  assert.equal(accountSource.includes("wideFirstAccount?: boolean;"), true);
  assert.equal(accountSource.includes("showDepositAmount?: boolean;"), true);
  assert.equal(accountSource.includes("lg:grid-cols-[minmax(16rem,0.75fr)_minmax(0,1.25fr)]"), true);
  assert.equal(accountSource.includes("lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"), true);
  assert.equal(accountSource.includes("lg:grid-cols-2"), true);
  assert.equal(accountSource.includes("grid h-full grid-rows-[auto_1fr_auto]"), true);
  assert.equal(accountSource.includes("grid min-h-10 grid-cols-[4.5rem_minmax(0,1fr)]"), true);
  assert.equal(accountSource.includes('isAtv ? "text-sm lg:pr-4" : "text-base"'), true);
  assert.equal(accountSource.includes("sm:whitespace-nowrap"), true);
  assert.equal(accountNumberLabelIndex > -1, true);
  assert.equal(depositLabelIndex > accountNumberLabelIndex, true);
  assert.equal(accountSource.includes('<dd className="numeric font-extrabold text-foreground">50,000원</dd>'), true);
  assert.equal(accountSource.includes("예약금액"), false);
});

test("reservation write form does not show the helper note strip", () => {
  const formSource = readFileSync("src/components/reservation/ReservationWriteForm.tsx", "utf8");

  assert.equal(formSource.includes("bg-surface-muted/62"), false);
  assert.equal(formSource.includes("예약자 성함은 국문으로 입력해 주세요."), false);
  assert.equal(formSource.includes("예약날짜는 다음 날 이후부터 접수됩니다."), false);
  assert.equal(formSource.includes("저장 후 예약 가능 여부를 확인해 연락드립니다."), false);
  assert.equal(formSource.includes("UserCircle"), false);
  assert.equal(formSource.includes("CalendarCheck"), false);
});

test("reservation write guide card uses a more prominent background", () => {
  const pageSource = readFileSync("src/app/reservation/write/page.tsx", "utf8");

  assert.equal(pageSource.includes("border border-lake/14 bg-surface-muted p-5 text-foreground sm:p-6"), false);
  assert.equal(
    pageSource.includes(
      "border border-lake bg-lake p-5 text-white shadow-[0_18px_34px_-24px_rgba(7,59,58,0.86)] sm:p-6",
    ),
    true,
  );
  assert.equal(pageSource.includes('className="h-5 w-5 text-white"'), true);
  assert.equal(pageSource.includes("text-xs leading-6 text-white/84"), true);
});

test("reservation write phone card uses a filled warm background", () => {
  const pageSource = readFileSync("src/app/reservation/write/page.tsx", "utf8");

  assert.equal(pageSource.includes("border border-foreground/12 bg-surface p-5 sm:p-6"), false);
  assert.equal(pageSource.includes("border border-sun/30 bg-sun/12 p-5 text-foreground"), false);
  assert.equal(
    pageSource.includes(
      "border border-sun bg-sun p-5 text-white shadow-[0_18px_34px_-24px_rgba(185,79,49,0.78)] sm:p-6",
    ),
    true,
  );
  assert.equal(pageSource.includes('className="text-sm font-bold text-white/82"'), true);
  assert.equal(pageSource.includes("text-xs leading-6 text-white/78"), true);
});
