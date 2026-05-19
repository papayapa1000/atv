import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const roots = ["src", "tests", "data", "public"];
const textExtensions = new Set([".css", ".json", ".mjs", ".svg", ".ts", ".tsx"]);
const mojibakePattern = /[\u0080-\u009f\ufffd\uf900-\ufaff\u4e00-\u9fff\u2460-\u24ff]|\?[\uac00-\ud7a3]{2,}/u;

function listTextFiles(directory: string): string[] {
  const entries = readdirSync(directory);

  return entries.flatMap((entry) => {
    const filePath = path.join(directory, entry);
    const stats = statSync(filePath);

    if (stats.isDirectory()) {
      return listTextFiles(filePath);
    }

    return textExtensions.has(path.extname(filePath)) ? [filePath] : [];
  });
}

test("Korean source strings are not mojibake", () => {
  const findings = roots
    .flatMap(listTextFiles)
    .flatMap((filePath) =>
      readFileSync(filePath, "utf8")
        .split(/\r?\n/)
        .flatMap((line, index) => (mojibakePattern.test(line) ? [`${filePath}:${index + 1}`] : [])),
    );

  assert.deepEqual(findings, []);
});
