import assert from "node:assert/strict";
import test from "node:test";
import { analyze } from "../src/readtime.mjs";

test("short English text reads in a minute", () => {
  const { words, minutes } = analyze("A quick note about the release.");
  assert.equal(words, 6);
  assert.equal(minutes, 1);
});

test("longer English text scales by words per minute", () => {
  const text = Array.from({ length: 450 }, (_, i) => `word${i}`).join(" ");
  const { words, minutes } = analyze(text);
  assert.equal(words, 450);
  assert.equal(minutes, 3);
});

test("empty input reports zero", () => {
  assert.deepEqual(analyze("   "), { words: 0, minutes: 0 });
});

test("custom words-per-minute is respected", () => {
  assert.equal(analyze("one two three four", { wpm: 2 }).minutes, 2);
});
