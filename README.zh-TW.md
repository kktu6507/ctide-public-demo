# ctide-public-demo

> [cressetide](https://github.com/kktu6507/cressetide)（`/ctide:vigil`）的實機示範：一個真實的小工具、一個種好的 bug、一次不排練的完整 run。

[English](README.md) | [日本語](README.ja.md)

## 這是什麼

cressetide 的 README 說它「記錄一次完整 `/ctide:vigil`」——就是這裡。

這個 repo 裡有一個真實的小工具 `readtime`（估文章的閱讀時間），我們刻意在裡面種了一個真實世界很常見的 bug，然後用 `/ctide:vigil` 修它：走 plan gate、實作、驗證、雙 reviewer、arbiter 裁決，全程照實記錄。

bug 是安排好的——示範場總得有個舞台。但 run 本身沒有腳本：reviewer 抓到什麼、驗證跑出什麼 exit code、arbiter 怎麼裁，[EVIDENCE.md](EVIDENCE.md) 就寫什麼。

## 怎麼讀這個 demo

1. **先看 bug**：scaffold commit 裡的 [src/readtime.mjs](src/readtime.mjs)——字數是用空白切的，英文沒事，中文整篇會被數成 1 個字。再看 [test/readtime.test.mjs](test/readtime.test.mjs)：測試全綠，因為案例全是英文。綠燈不代表沒有 bug。
2. **讀 run 實錄**：[EVIDENCE.md](EVIDENCE.md) 從任務原文到 sentinel 三行，完整記錄 vigil 怎麼把這個 bug 走完一輪。
3. **對比 diff**：最後一個 commit 就是 vigil 產出的修復＋測試，跟 scaffold commit 對照著看。

## 工具本身

`readtime` 是零依賴的 Node 模組＋CLI：

```bash
npm test                          # 跑測試
node src/readtime.mjs README.md   # 估這份 README 的閱讀時間
```

修復前拿一篇中文文章餵它，你會親眼看到 bug：不管文章多長，都回你「Words: 1 · Reading time: ~1 min」。

## 誠實揭露

- bug 與測試缺口是刻意設計的；vigil run 未經排練，記錄即實際輸出。
- 執行日期、模型與成本記在 EVIDENCE.md 的 Live run 區塊。
- ctide 沒有遙測——一次 run 算不算數，全看有沒有這種記錄。

## 相關連結

- 主 repo：[cressetide](https://github.com/kktu6507/cressetide)
- 這個 demo 的設計文件（making-of）：[docs/superpowers/specs/2026-07-20-ctide-public-demo-design.md](docs/superpowers/specs/2026-07-20-ctide-public-demo-design.md)
