---
name: gm3-create-issue
description: group-manager-2 の GitHub Issue を調査して作成する。「Issue にして」「課題を起票して」「あとで対応するIssueを作って」と依頼されたときは必ず使う。
---

`$ARGUMENTS` をIssueにしてください。Issue作成を明示された場合だけGitHubへ書き込みます。

関連コードと既存Issueを読み、`gh issue list` / `gh issue view` で重複を確認してください。重複なら新規作成せず既存Issueを提示します。

`.github/ISSUE_TEMPLATE/custom.md` に合わせて、開発目的、考えられる開発内容、検証可能なテスト項目、開発時間、備考を書きます。`aaa`などのplaceholderを残さず、未確定事項を断定しません。タイトルは実現する結果が分かる短い日本語にします。labelやmilestoneは根拠がある場合だけ付け、通常は `--assignee @me` で割り当てます。

作成後に `gh issue view` で内容とassigneeを確認し、URLを日本語で報告してください。branch、コード、PRは依頼されない限り作りません。
