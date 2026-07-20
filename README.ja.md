# ctide-public-demo

> [cressetide](https://github.com/kktu6507/cressetide)（`/ctide:vigil`）のライブデモ：実在する小さなツール、意図的に仕込んだバグ、台本なしの完全な 1 run。

[English](README.md) | [繁體中文](README.zh-TW.md)

## これは何か

cressetide の README にある「`/ctide:vigil` を最初から最後まで記録した一例」——それがこのリポジトリです。

ここには実在の小さなツール `readtime`（文章の読了時間を見積もる）があり、現実世界で頻出するバグをあえて仕込んだうえで、`/ctide:vigil` で修正しました。plan gate、実装、検証、2 名のレビュアー、arbiter の裁定——すべて起きたとおりに記録しています。

バグは仕込みです——デモには舞台が要りますから。しかし run そのものに台本はありません。レビュアーが何を見つけ、検証がどの exit code を返し、arbiter が何を裁定したか、[EVIDENCE.md](EVIDENCE.md) にはそのままが書いてあります。

## このデモの読み方

1. **まずバグを見る**：scaffold コミットの [src/readtime.mjs](src/readtime.mjs) は空白区切りで語数を数えます——英語は問題ありませんが、日本語や中国語の文章は空白がないため丸ごと 1 語と数えられます。次に [test/readtime.test.mjs](test/readtime.test.mjs) を見てください：ケースが全部英語なので、テストは全部グリーンです。グリーンはバグなしを意味しません。
2. **run の記録を読む**：[EVIDENCE.md](EVIDENCE.md) がタスク原文から sentinel 3 行まで、vigil の一巡を記録しています。
3. **diff を見比べる**：最後のコミットが vigil の生んだ修正＋テストです。scaffold コミットと見比べてください。

## ツールそのもの

`readtime` は依存ゼロの Node モジュール＋CLI です：

```bash
npm test                          # テストを実行
node src/readtime.mjs README.md   # この README の読了時間を見積もる
```

修正前に日本語や中国語の記事を食わせると、バグが目の前で再現します：長さに関係なく「Words: 1 · Reading time: ~1 min」と返ってきます。

## 正直な開示

- バグとテストの欠落は設計されたもの。vigil run はリハーサルなしで、記録は実際の出力そのものです。
- 今回の run：2026-07-20 実行、レビュアー 3 名の panel。第 1 巡は FIX REQUIRED（ミュータント生存ギャップを検出）、修復後に READY——全経過は [EVIDENCE.md](EVIDENCE.md) を参照。
- 実行日・モデル・コストは EVIDENCE.md の Live run ブロックに記載しています。
- ctide にテレメトリはありません——run が「数えられる」かどうかは、この種の記録があるかどうかで決まります。

## リンク

- メインリポジトリ：[cressetide](https://github.com/kktu6507/cressetide)
- このデモの設計ドキュメント（making-of）：[docs/superpowers/specs/2026-07-20-ctide-public-demo-design.md](docs/superpowers/specs/2026-07-20-ctide-public-demo-design.md)
