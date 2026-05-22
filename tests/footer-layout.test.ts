import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { businessInfo, phoneNumber } from "../src/lib/site-data";

test("site footer uses a unified black background with white text", () => {
  const source = readFileSync("src/components/home/Footer.tsx", "utf8");

  assert.equal(source.includes("depth-surface"), false);
  assert.equal(source.includes("bg-surface"), false);
  assert.equal(source.includes("text-foreground"), false);
  assert.equal(source.includes('className="border-t border-white/10 bg-black px-5 py-4 text-white lg:px-8"'), true);
  assert.equal(source.includes("text-white/70"), true);
  assert.equal(source.includes("text-white/50"), true);
});

test("site footer keeps business details in a compact desktop layout", () => {
  const source = readFileSync("src/components/home/Footer.tsx", "utf8");

  assert.equal(source.includes("py-10"), false);
  assert.equal(source.includes("gap-8"), false);
  assert.equal(source.includes("mt-8"), false);
  assert.equal(source.includes("md:flex-row"), true);
  assert.equal(source.includes("md:items-end"), true);
  assert.equal(source.includes("leading-5"), true);
});

test("site footer orders public business details and omits removed fields", () => {
  const source = readFileSync("src/components/home/Footer.tsx", "utf8");
  const representativeIndex = source.indexOf('["대표", businessInfo.representative]');
  const registrationIndex = source.indexOf('["사업자등록번호", businessInfo.registrationNumber]');
  const phoneIndex = source.indexOf('["대표전화", phoneNumber]');
  const addressIndex = source.indexOf('["주소", businessInfo.address]');

  assert.equal(representativeIndex > -1, true);
  assert.equal(registrationIndex > representativeIndex, true);
  assert.equal(phoneIndex > registrationIndex, true);
  assert.equal(addressIndex > phoneIndex, true);
  assert.equal(source.includes("우편번호"), false);
  assert.equal(source.includes("예약계좌"), false);
  assert.equal(source.includes("depositAccounts"), false);
});

test("site footer renders official business and reservation details from shared data", () => {
  const source = readFileSync("src/components/home/Footer.tsx", "utf8");

  assert.equal(source.includes("businessInfo"), true);
  assert.equal(source.includes("phoneNumber"), true);
  assert.equal(source.includes("대표전화"), true);
  assert.equal(source.includes("사업자등록번호"), true);
  assert.equal(source.includes("주소"), true);
});

test("site data contains official business and reservation contact details", () => {
  assert.deepEqual(businessInfo, {
    name: "제천수상레저(주)",
    representative: "박병익",
    registrationNumber: "304-81-22695",
    postalCode: "27211",
    address: "충청북도 제천시 금성면 청풍호로 1482",
  });
  assert.equal(phoneNumber, "010-4634-5020");
});
