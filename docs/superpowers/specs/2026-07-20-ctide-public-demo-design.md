# ctide-public-demo 設計文件

日期：2026-07-20 · 狀態：已核准的設計，供實作依循 · 本文件是 demo 的 making-of 透明度紀錄

## 這個 repo 要做什麼

[cressetide](https://github.com/kktu6507/cressetide) 三語 README 第 89 行承諾了一個 live demo：「記錄一次完整 `/ctide:vigil`」。這個 repo 就是那個 demo——一個真實的小專案、一個真實的 bug、一次不排練的 vigil 實跑，以及照實記錄的產出。

核心原則：**記錄即實際輸出**。ctide 的文化是無遙測、憑記錄、絕不虛構 run 結果；這個 demo 是那個文化的門面。bug 是刻意種的（示範場需要一個舞台），但 vigil run 本身沒有腳本——reviewer 抓到什麼、arbiter 裁什麼，記錄就寫什麼。

## 被示範的工具：`readtime`

零依賴 Node 模組＋CLI：輸入文章文字，回報字數與預估閱讀時間。

**API**（`src/readtime.mjs`）：

```js
export function analyze(text, { wpm = 200 } = {})
// → { words: number, minutes: number }
// minutes：words 為 0 時回 0，否則 Math.max(1, Math.ceil(words / wpm))
```

CLI：`node src/readtime.mjs <file>`（或 stdin）→ `Words: X · Reading time: ~Y min`。

**種的 bug**：字數用 `text.trim().split(/\s+/).filter(Boolean).length` 計算——以空白切詞。英文文章估得準；中文（及日文等 CJK）文章整篇沒有空白，被數成 1 個「字」，閱讀時間永遠 1 分鐘。這是真實世界的經典 bug，對本 demo 的三語受眾有直接共鳴。

**種的測試缺口**（`test/readtime.test.mjs`，node:test）：既有測試全是英文案例（短文 1 分鐘、長文多分鐘、空字串歸零）——全綠，但對 CJK 全瞎。「測試綠 ≠ 沒有 bug」正是 vigil 要示範的第一課。

**給 vigil 的任務措辭**（使用者口吻的 bug report，刻意不含實作指示）：

> 「我拿這個工具估中文文章的閱讀時間，不管貼多長的文章都說 1 分鐘，字數還顯示 1。英文文章是正常的。請修好，順便把測試補起來。」

刻意保留的模糊點（讓 plan gate 的 requirement-understanding 自然運作，不預先鋪答案）：混排文字怎麼數、CJK 的閱讀速率是否與英文同一個 `wpm`。這些應該由 vigil 的規劃階段自己浮現與處理；demo 不預設它的結論。

## Repo 結構

```text
ctide-public-demo/
  README.md            ← 英文（自 zh-TW 翻譯）
  README.zh-TW.md      ← 源頭語言
  README.ja.md         ← 日文（自 zh-TW 翻譯）
  EVIDENCE.md          ← run 實錄（英文＋ctide 機器 token；Phase C 產出）
  package.json         ← private、type: module、scripts.test = "node --test"
  .gitignore           ← node_modules/、.ctide/
  src/readtime.mjs
  test/readtime.test.mjs
  docs/superpowers/specs/…this file…
```

## Git 歷史即敘事

1. **Commit 1**：本設計文件（making-of 透明）
2. **Commit 2「scaffold」**：工具＋種好的 bug＋英文-only 測試（綠）＋三語 README＋package.json/.gitignore
3. **Commit 3「the vigil run」**：`/ctide:vigil --lite` 實跑產出的修復＋新測試＋`EVIDENCE.md`

讀者在 GitHub 對比 commit 2→3 就是 before/after；`EVIDENCE.md` 是主角。

## EVIDENCE.md 結構（Phase C 依實跑內容填寫）

依 ctide `final-report.md` 規格：

- The task（任務原文）
- Plan gate：批准的 acceptance criteria
- Implementation：改了什麼（指向 diff）
- Verification：實際指令與真實 exit code（含 fail-first 證據）
- Review findings：intent-reviewer / test-reviewer 實際回報
- Arbiter verdict＋完整 final report，三行 sentinel 原文照錄
- `### Live run` 區塊（ctide 的標準實錄格式，含日期、model、成本）

## 三語 README 要求

- zh-TW 為源頭，en/ja 為譯文；語氣照主 repo：口語、有呼吸感、低 AI 味。
- 內容：這是什麼（cressetide 的 live demo）→ 怎麼讀（三步：看 commit 2 的 bug、讀 EVIDENCE.md、對比 commit 3 的 diff）→ 工具簡介與在地重現方式（`npm test`、CLI 試跑）→ 誠實揭露（bug 是種的、run 是真的、日期與 model）→ 連回主 repo。
- 三份 `##` 節數一致（比照主 repo 的結構同步慣例）。

## 執行順序

- **Phase A（scaffold）**：建上述檔案，commit 1＋2。工具與測試直接建檔（舞台佈置，不需 vigil）。
- **Phase B（the run）**：在本 repo 內以上述任務措辭啟動 `/ctide:vigil --lite`，走完整 plan gate → implementer → verification → intent/test reviewers → arbiter。vigil 的 plan gate 就是本階段的 implementation plan，不另疊計畫文件。`READY` 才進入 Phase C。
- **Phase C（收錄）**：EVIDENCE.md 落檔、README 補上實跑摘要與日期、commit 3、push origin main。

## 明確不做

- 不裝任何 npm 依賴（`Intl.Segmenter` 等 Node 內建即足；實際修法由 run 決定）
- 不設 CI（demo 聚焦 vigil 本身；`npm test` 本地可重現）
- 不放 cressetide 內部 repo 的任何 run 記錄
- 不排練、不改寫 run 輸出；reviewer 沒抓到的就誠實留白

## 成功標準

1. 每個 commit 點上 `npm test` 皆綠（commit 2 綠-但-瞎；commit 3 含 CJK 案例，EVIDENCE 記錄 fail-first→pass 證據）
2. vigil run 完整走過 gate→panel→arbiter，以 `READY` 收束；sentinel 三行原文入 EVIDENCE
3. 三語 README 同步、zh-TW 為源頭
4. push 成功後，cressetide 主 repo 的 link-check 404 消解
