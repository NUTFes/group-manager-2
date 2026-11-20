---
name: gm3-write-tests
description: group-manager-2 の変更や不具合に対するテストコードを追加・修正する。「テストを書いて」「回帰テストを追加して」「テストケースを実装して」と依頼されたときは必ず使う。テスト計画だけの依頼では使わない。
---

`$ARGUMENTS` のテストコードを作成してください。Issue、差分、再現手順から守る挙動を特定し、内部実装ではなく入力・操作と観測可能な結果を検証します。

近い既存テスト、fixture、helper、mockを読み、同じ層と書き方を選びます。APIは `api/test` のRails testを使い、変更に応じて正常系、認証・認可、validation、対象なし・複数件、途中失敗を選んでください。fixtureを順序や固定件数へ依存させません。

userは `user/e2e`、adminは `admin_view/nuxt-project/e2e` のPlaywrightパターンに合わせます。mockのUIテストと実API・DBのreal flowを混同しません。rentalに既存frameworkがなければ、テストのためだけに導入せず相談します。

`CLAUDE.md` のDocker方針に従い、対象ファイルから関連範囲へ広げて実行します。可能なら修正前に失敗し修正後に通ることを確かめます。追加ケース、検出する回帰、実行結果、未検証範囲を日本語で報告し、production codeは依頼に含まれる場合だけ変更します。
