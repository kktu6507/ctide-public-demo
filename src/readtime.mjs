#!/usr/bin/env node
// readtime — estimate the reading time of a text.
// Zero dependencies; Node 18+.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function analyze(text, { wpm = 200 } = {}) {
  const words = countWords(text);
  const minutes = words === 0 ? 0 : Math.max(1, Math.ceil(words / wpm));
  return { words, minutes };
}

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const file = process.argv[2];
  const text = file ? fs.readFileSync(file, "utf8") : fs.readFileSync(0, "utf8");
  const { words, minutes } = analyze(text);
  console.log(`Words: ${words} · Reading time: ~${minutes} min`);
}
