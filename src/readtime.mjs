#!/usr/bin/env node
// readtime — estimate the reading time of a text.
// Zero dependencies; Node 18+.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// CJK text has no word spaces, so it is read per character, not per whitespace token.
const CJK_CHARS = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu;

export function analyze(text, { wpm = 200, cpm = 300 } = {}) {
  const cjkChars = (text.match(CJK_CHARS) || []).length;
  const latinWords = countLatinWords(text.replace(CJK_CHARS, " "));
  const words = cjkChars + latinWords;
  const minutes = words === 0 ? 0 : Math.max(1, Math.ceil(cjkChars / cpm + latinWords / wpm));
  return { words, minutes };
}

function countLatinWords(text) {
  // A token with no letter or digit (e.g. leftover CJK punctuation) is not a word.
  return text.trim().split(/\s+/).filter((word) => /[\p{L}\p{N}]/u.test(word)).length;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const file = process.argv[2];
  const text = file ? fs.readFileSync(file, "utf8") : fs.readFileSync(0, "utf8");
  const { words, minutes } = analyze(text);
  console.log(`Words: ${words} · Reading time: ~${minutes} min`);
}
