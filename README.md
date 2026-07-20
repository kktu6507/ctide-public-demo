# ctide-public-demo

> Live demo of [cressetide](https://github.com/kktu6507/cressetide) (`/ctide:vigil`): a real little tool, a deliberately seeded bug, one unscripted end-to-end run.

[繁體中文](README.zh-TW.md) | [日本語](README.ja.md)

## What this is

cressetide's README says it "captures one `/ctide:vigil` end to end" — this is that capture.

This repo holds a real small tool, `readtime` (estimates how long a text takes to read). We seeded it with a bug that shows up constantly in the wild, then fixed it with `/ctide:vigil`: plan gate, implementation, verification, a two-reviewer panel, and an arbiter verdict — all recorded as it happened.

The bug was staged — a demo needs a stage. The run itself was not scripted: whatever the reviewers caught, whatever exit codes the checks returned, whatever the arbiter ruled, that is what [EVIDENCE.md](EVIDENCE.md) says.

## How to read this demo

1. **Look at the bug first**: in the scaffold commit, [src/readtime.mjs](src/readtime.mjs) counts words by splitting on whitespace — fine for English, but a Chinese article has no spaces and counts as one single "word". Then look at [test/readtime.test.mjs](test/readtime.test.mjs): every test is green, because every case is English. Green does not mean bug-free.
2. **Read the run record**: [EVIDENCE.md](EVIDENCE.md) captures the whole vigil pass, from the original task wording down to the three sentinel lines.
3. **Compare the diff**: the last commit is the fix and tests vigil produced — read it against the scaffold commit.

## The tool itself

`readtime` is a zero-dependency Node module + CLI:

```bash
npm test                          # run the tests
node src/readtime.mjs README.md   # estimate this README's reading time
```

Before the fix, feed it any Chinese article and you will see the bug with your own eyes: no matter the length, it answers "Words: 1 · Reading time: ~1 min".

## Honest disclosure

- The bug and the test gap were designed in; the vigil run was unrehearsed — the record is the actual output.
- Run date, model, and cost live in EVIDENCE.md's Live run block.
- ctide has no telemetry — a run only counts if a record like this one exists.

## Links

- Main repo: [cressetide](https://github.com/kktu6507/cressetide)
- This demo's design doc (making-of): [docs/superpowers/specs/2026-07-20-ctide-public-demo-design.md](docs/superpowers/specs/2026-07-20-ctide-public-demo-design.md)
