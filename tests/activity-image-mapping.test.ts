import assert from "node:assert/strict";
import { existsSync, statSync, readFileSync } from "node:fs";
import test from "node:test";

const publicImageMappings = [
  "activity-water-ski.webp",
  "activity-wakeboard.webp",
  "activity-flyfish-1.webp",
  "activity-banana-boat.webp",
  "activity-bandwagon.webp",
  "activity-peanut-boat.webp",
  "activity-big-marble.webp",
  "activity-giant-marble.webp",
  "activity-g-ral.webp",
  "activity-hexagon.webp",
] as const;

function objectContaining(source: string, marker: string) {
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, `Could not find marker: ${marker}`);

  const end = source.indexOf("\n  },\n  {", start);
  assert.notEqual(end, -1, `Could not find object end after marker: ${marker}`);

  return source.slice(start, end);
}

test("matched activity images are available as public assets", () => {
  for (const fileName of publicImageMappings) {
    const path = `public/images/${fileName}`;

    assert.equal(existsSync(path), true, `${path} should exist`);
    assert.equal(statSync(path).size > 0, true, `${path} should not be empty`);
  }
});

test("activities page uses item-specific images for matched ride names", () => {
  const source = readFileSync("src/app/activities/page.tsx", "utf8");

  assert.match(objectContaining(source, 'id: "water-ski"'), /image: "\/images\/activity-water-ski\.webp"/);
  assert.match(objectContaining(source, 'id: "wakeboard"'), /image: "\/images\/activity-wakeboard\.webp"/);
  assert.match(objectContaining(source, 'id: "flyfish"'), /image: "\/images\/activity-flyfish-1\.webp"/);
  assert.match(objectContaining(source, 'id: "banana-boat"'), /image: "\/images\/activity-banana-boat\.webp"/);
  assert.match(objectContaining(source, 'id: "bandwagon"'), /image: "\/images\/activity-bandwagon\.webp"/);
  assert.match(objectContaining(source, 'id: "peanut-boat"'), /image: "\/images\/activity-peanut-boat\.webp"/);
  assert.match(objectContaining(source, 'id: "big-marble"'), /image: "\/images\/activity-big-marble\.webp"/);
  assert.match(objectContaining(source, 'id: "giant-marble"'), /image: "\/images\/activity-giant-marble\.webp"/);
  assert.match(objectContaining(source, 'id: "g-ral"'), /image: "\/images\/activity-g-ral\.webp"/);
  assert.match(objectContaining(source, 'id: "hexagon"'), /image: "\/images\/activity-hexagon\.webp"/);
});

test("home quick info and program data mirror the matched activity images", () => {
  const quickInfoSource = readFileSync("src/components/home/QuickInfo.tsx", "utf8");
  const siteDataSource = readFileSync("src/lib/site-data.ts", "utf8");

  assert.match(quickInfoSource, /image: "\/images\/activity-wakeboard\.webp"[\s\S]{0,300}href: "\/activities#wakeboard"/);
  assert.match(quickInfoSource, /image: "\/images\/activity-peanut-boat\.webp"[\s\S]{0,300}href: "\/activities#peanut-boat"/);
  assert.match(quickInfoSource, /image: "\/images\/activity-giant-marble\.webp"[\s\S]{0,300}href: "\/activities#giant-marble"/);
  assert.match(quickInfoSource, /image: "\/images\/activity-g-ral\.webp"[\s\S]{0,300}href: "\/activities#g-ral"/);
  assert.match(quickInfoSource, /image: "\/images\/activity-hexagon\.webp"[\s\S]{0,300}href: "\/activities#hexagon"/);

  assert.match(siteDataSource, /eyebrow: "Wakeboarding"[\s\S]{0,300}image: "\/images\/activity-wakeboard\.webp"/);
  assert.match(siteDataSource, /eyebrow: "Peanut Boat"[\s\S]{0,300}image: "\/images\/activity-peanut-boat\.webp"/);
  assert.match(siteDataSource, /eyebrow: "Giant Marble"[\s\S]{0,300}image: "\/images\/activity-giant-marble\.webp"/);
  assert.match(siteDataSource, /eyebrow: "Thrill Ride"[\s\S]{0,300}image: "\/images\/activity-g-ral\.webp"/);
  assert.match(siteDataSource, /eyebrow: "Hexagon"[\s\S]{0,300}image: "\/images\/activity-hexagon\.webp"/);
});
