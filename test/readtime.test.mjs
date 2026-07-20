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

test("Chinese text counts characters, not whitespace tokens", () => {
  const sentence = "今天天氣晴朗適合出門散步走路看書喝茶休息"; // 20 Han characters
  const { words, minutes } = analyze(sentence.repeat(20)); // 400 characters
  assert.equal(words, 400);
  assert.equal(minutes, 2); // ceil(400 / 300 cpm)
});

test("mixed Chinese and English counts both tracks", () => {
  const { words } = analyze("我用六個漢字 Node"); // 6 Han characters + 1 English word
  assert.equal(words, 7);
});

test("reading time is a single ceil over both tracks combined", () => {
  const zh = "字".repeat(150); // 150 / 300 cpm = 0.5 min
  const en = Array.from({ length: 100 }, (_, i) => `word${i}`).join(" "); // 100 / 200 wpm = 0.5 min
  const { words, minutes } = analyze(`${zh} ${en}`);
  assert.equal(words, 250);
  assert.equal(minutes, 1); // ceil(0.5 + 0.5), not per-track ceil + ceil
});

test("CJK punctuation is not counted", () => {
  assert.equal(analyze("你好，世界。").words, 4);
});

test("Japanese kanji and kana count per character", () => {
  const { words, minutes } = analyze("日本語のテキストを読む"); // 4 kanji + 3 hiragana + 4 katakana
  assert.equal(words, 11);
  assert.equal(minutes, 1);
});

test("custom chars-per-minute is respected", () => {
  assert.equal(analyze("春夏秋冬", { cpm: 2 }).minutes, 2);
});

test("a CJK char between Latin runs acts as a word boundary", () => {
  assert.equal(analyze("TypeScript與JavaScript").words, 3); // 1 Han + 2 Latin words, no space needed
});

test("punctuation-only input counts no words", () => {
  assert.deepEqual(analyze("* * *"), { words: 0, minutes: 0 });
});
