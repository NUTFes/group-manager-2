---
name: gm3-create-issue
description: group-manager-2 の GitHub Issue を調査して作成する。「Issue にして」「課題を起票して」「あとで対応するIssueを作って」と依頼されたときに使う。
---

# GM3 Issue 作成

Issue 作成を明示された場合だけ GitHub へ書き込む。

1. 依頼、関連コード、既存Issueを確認し、同じ課題がすでにないか `gh issue list` / `gh issue view` で調べる。重複なら新規作成せず既存Issueを提示する。
2. 作成時点の `.github/ISSUE_TEMPLATE/` を読み、依頼に合う最新テンプレートを選ぶ。スキル内の記憶で項目を作らず、テンプレートの構造、順序、コメントの意図を保って具体的に埋める。placeholderは残さず、未確定事項を断定しない。
3. タイトルは実現する結果が分かる短い日本語にする。labelやmilestoneは根拠がある場合だけ付け、通常は `--assignee @me` で依頼者へ割り当てる。
4. `gh issue create` 後に `gh issue view` でタイトル、本文、assigneeを確認し、URLを報告する。branchやコード、PRは別途依頼されない限り作らない。
