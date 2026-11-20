---
name: gm3-write-tests
description: group-manager-2 の変更や不具合に対するテストコードを追加・修正する。「テストを書いて」「回帰テストを追加して」「テストケースを実装して」と依頼されたときに使う。テスト計画だけの依頼では使わない。
---

# GM3 テストコード作成

1. Issue、差分、再現手順から守るべき挙動と回帰を特定する。実装の内部構造ではなく、入力・操作と観測可能な結果を検証する。
2. 近い既存テスト、fixture、helper、mockの使い方を読み、同じ層と書き方を選ぶ。新しいtest frameworkや大きな共通化を安易に追加しない。
3. APIは `api/test` のRails testで正常系、認証・認可、validation、対象データなし・複数件、途中失敗を変更に応じて選ぶ。fixtureはテスト間の順序や固定件数へ依存させない。
4. userの画面フローは既存の `user/e2e`、adminは `admin_view/nuxt-project/e2e` のPlaywrightパターンに合わせる。mockはUI単体、実API・DB連携はreal flowとして目的を分ける。rentalには既存frameworkがなければ、テスト追加のためだけに導入せず相談する。
5. `AGENTS.md` のDocker方針に従い、まず対象ファイル、次に必要な関連範囲を実行する。追加テストが修正前に失敗し修正後に通ることを、可能なら履歴や一時差分で確かめる。
6. 追加したケース、検出する回帰、実行結果、未検証範囲を日本語で報告する。production codeの修正は依頼に含まれる場合だけ行う。
