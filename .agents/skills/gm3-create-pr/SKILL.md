---
name: gm3-create-pr
description: group-manager-2 の変更を確認して Draft Pull Request を作成・更新する。「PRを作って」「Draft PRを立てて」「PR本文を書いて」と依頼されたときに使う。
---

# GM3 PR 作成

PR 作成または更新を明示された場合だけ GitHub へ書き込む。merge は行わない。

1. 現在branch、`origin/gm3/develop...HEAD` のcommitと差分、関連Issue、実行済み検証を確認する。未commitの変更はPRへ含まれないため明記する。
2. branchが未pushなら、対象とremoteを確認してから同名branchを `origin` へpushする。別branchへのforce pushはしない。
3. `.github/pull_request_template.md` に沿って、対応Issue、概要、実装詳細、画面スクリーンショット、テスト項目、備考を実際の内容で埋める。未実施のテストを成功扱いにせず、UI変更にはbefore/afterを添えるか未添付理由を書く。
4. baseは、別指定がなければ `gm3/develop`。通常は `--draft` と `--assignee @me` を使う。すでに同じheadのPRがあれば新規作成せず更新する。
5. `gh pr view` でbase、head、Draft、assignee、本文を確認し、URLと未確認事項を報告する。review依頼、ready化、mergeは明示された場合だけ行う。
