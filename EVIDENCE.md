# EVIDENCE — one unscripted `/ctide:vigil` run

This file records the complete vigil run that fixed the seeded CJK bug in this repo. Everything below is the actual output of the run — real commands, real exit codes, real reviewer findings, including the round the panel failed the work. Nothing is rehearsed or rewritten.

- **Date:** 2026-07-20 · **Mode:** `/ctide:vigil --lite`
- **Orchestrator model:** Claude Fable 5 (`claude-fable-5`); reviewer/implementer subagents inherit; the arbiter agent runs on Opus per its agent definition.
- **Base:** commit `873c018` (the scaffold with the seeded bug) · **Deliverable:** the next commit (fix + tests + this file).

## The task (verbatim, user-voice bug report — no implementation hints)

> 我拿這個工具估中文文章的閱讀時間，不管貼多長的文章都說 1 分鐘，字數還顯示 1。英文文章是正常的。請修好，順便把測試補起來。

("I use this tool to estimate reading time for Chinese articles — no matter how long the article, it says 1 minute, and the word count shows 1. English articles are fine. Please fix it and backfill the tests.")

## Plan gate

Grounded root cause: `countWords` split on whitespace (`src/readtime.mjs:16` at base) — CJK text has no spaces, so a whole article became one token. The plan surfaced a **product ambiguity** the task deliberately left open, and vigil raised it as a gate question instead of guessing: *how should CJK words and reading rate be counted?* The user chose **dual-track**: CJK characters count 1 each at `cpm=300` chars/min (Han/Hiragana/Katakana script properties); non-CJK stays whitespace-split at `wpm=200`; `words = cjkChars + latinWords`; `minutes = single ceil over the combined raw total`, floor 1, `{0,0}` on empty.

Approved acceptance criteria (abridged): AC-1 Chinese ≥300 chars → true count + `ceil(/300)` with fail-first evidence · AC-2 English behavior unchanged, existing 4 tests byte-identical · AC-3 mixed text dual-track + single ceil · AC-4 CJK punctuation not counted · AC-5 Japanese fixed too · AC-6 `npm test` exit 0 · AC-7 CLI sane before/after.

Registered assumptions: Hangul excluded (Korean is space-delimited — already handled by the word track); `cpm=300` = conservative low end of common zh reading speeds (300–500); single combined ceil (per-track ceil rejected — it inflates short mixed texts). A fourth was registered during review — see below.

## Implementation (TDD, fail-first)

The implementer wrote the new tests first and ran them against the buggy code:

```text
tests 10 | pass 4 | fail 6        (exit 1 — all six new CJK tests red)
1 !== 400 · 2 !== 7 · 101 !== 250 · 1 !== 4 · 1 !== 11 · 1 !== 2
```

CLI on the same 100-char Chinese file, before → after:

```text
Words: 1 · Reading time: ~1 min      →      Words: 100 · Reading time: ~1 min
```

Then the fix (`src/readtime.mjs`): a `CJK_CHARS` regex on Unicode script properties (`\p{Script=Han}|Hiragana|Katakana`, `/gu`), dual-track counting, and one disclosed deviation — the design's literal wording ("remove CJK then keep `filter(Boolean)`") contradicted approved AC-4, so the token filter became `/[\p{L}\p{N}]/u` (a token with no letter or digit is not a word) and CJK chars are replaced with a **space** so `TypeScript與JavaScript` cannot fuse into one token. Post-fix: 10/10 green.

## Review round 1 — the panel caught what green tests missed

Three reviewers ran in parallel (intent, test, code). Highlights of what they found on a fully green suite:

- **test-reviewer (major):** the anti-fusing space was a **mutation survivor** — changing `replace(CJK_CHARS, " ")` to `""` broke `TypeScript與JavaScript` (3 → 2 words) while **all 10 tests stayed green**. The load-bearing mechanism had zero regression protection.
- **intent-reviewer:** rebuilt the pre-fix module from `git show` and reproduced all six fail-first deltas exactly (the evidence record is honest); ruled the implementer's deviation faithful (AC over prose); found the `\p{L}\p{N}` filter changes Latin-side behavior beyond the ACs (`"!!!"` went from `{1,1}` to `{0,0}` — minutes too) and was not yet a registered assumption.
- **code-reviewer:** probed astral Han (`𠀀𠀁` counts 2 code points, not 4 UTF-16 units), NFC/NFD kana (both count once), brute-forced the ceil boundaries over 600k rate combinations (0 violations), and confirmed the `/g` regex reuse is safe at current call sites.
- **Convergent documentation catch:** the run's own notes claimed "ー (U+30FC) is NOT counted" — three reviewers independently proved that claim **false** (see Known edges below). A false claim about your own code is exactly the kind of thing this workflow exists to catch, and it did — in its own paperwork.

**Arbiter verdict, round 1: FIX REQUIRED** — the shipped code was correct on every probed input, but an unpinned load-bearing behavior is a verification gap that withholds READY.

## Repair and re-verification

- **R1:** new test `analyze("TypeScript與JavaScript").words === 3` — the fused-topology pin. Mutant replay after the repair: **11 pass / 1 fail — the mutant is killed by this pin and only this pin** (`2 !== 3`).
- **O2:** new test `analyze("* * *")` → `{ words: 0, minutes: 0 }` — pins the Latin side of the deviation (kill-checked against a `filter(Boolean)` revert: `{3,1}` red).
- **O1:** the deviation registered as the contract's 4th assumption, with the minutes side effect stated precisely (a first draft said "previously `{1,1}`" universally; review caught that `"* * *"` previously gave `{3,1}` — the wording was corrected to enumerate).

Both targeted re-reviews returned clean; final suite: **12/12, exit 0**.

**Arbiter verdict, round 2: READY.**

## Verification (real exit codes)

| Check | Result |
|---|---|
| `npm test` — fail-first (new tests vs buggy code) | exit 1 · 4/10 (by design) |
| `npm test` — post-fix | exit 0 · 10/10 |
| `npm test` — post-repair (final) | exit 0 · **12/12** (re-run independently by orchestrator, both re-reviewers, and the arbiter) |
| Mutation replay (`" "`→`""` on the anti-fusing line) | exit 1 · exactly R1 red — mutant killed |
| CLI before/after on the same Chinese file | `Words: 1` → `Words: 100` (format string unchanged) |
| contract-check (deterministic scope/AC check) | exit 0 |

## Known edges (documented honestly)

- **ー (U+30FC) is Script=Common (gc=Lm): not matched by the CJK class, but matched by the `\p{L}` word filter — it counts on the wpm track and is adjacency-dependent (コーヒー → 4 words; スーー → 2 words). ・ (U+30FB, Po) is not counted.** Moving ー onto the CJK track (e.g. via `Script_Extensions`) would change approved behavior and is left as an explicit follow-up decision, not silently applied.
- Astral Han (`𠀀𠀁` → 2), halfwidth katakana (`ｶﾀｶﾅ` → 4), and digit tokens in CJK flow (`成長了 25%` → 4) behave correctly but are not yet pinned by tests — deferred with the arbiter's sanction.
- Hangul stays on the word track by registered assumption (Korean is space-delimited).

## What the run cost, honestly

One plan gate (with one product question), one implementer pass, three reviewers, one FIX REQUIRED round, one repair implementer pass, two targeted re-reviews, two arbiter rulings. Roughly **412k subagent tokens (observed)** plus the orchestrating thread. That is the price of "did what you asked, and confirmed it" on a 30-line module — scaled by `--lite`, and mostly spent on the parts that found real things.

### Live run — 2026-07-20 · ctide-public-demo (Node.js) · verified live task
- Task: Fix readtime's CJK word count (user-voice bug report: Chinese articles always "1 word / 1 minute"); backfill tests
- Intent given: symptom-only bug report, no implementation hints; product decision (dual-track rates) surfaced and resolved at the plan gate
- Reviewers: intent-reviewer, test-reviewer, code-reviewer (+ arbiter ×2) · Verdict: FIX REQUIRED → READY
- Verification: npm test fail-first (exit 1, 6 red) → post-fix 10/10 → final 12/12 exit 0; mutation replay killing the anti-fusing mutant; CLI before/after; contract-check exit 0
- Caught: mutation-survivor gap on the load-bearing anti-fusing space (major); false "ー not counted" claim in the run's own notes; unregistered Latin-side behavior change; imprecise `{1,1}` universal claim in the contract
- Missed: none known at finish — to confirm in follow-up use
- False alarms: none — every filed finding was independently confirmed
- Outcome after follow-up: to be confirmed once the change has lived in the codebase
- Cost: ~412k subagent tokens (observed) + main thread · Evidence: this repo's commit history (scaffold `873c018` → fix commit)

```text
ctide:verify=pass
ctide:delivery=shipped
ctide:panel=full
```
