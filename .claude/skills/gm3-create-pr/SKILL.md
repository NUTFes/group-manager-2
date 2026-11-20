---
name: gm3-create-pr
description: group-manager-2 の変更を確認して Draft Pull Request を作成・更新する。「PRを作って」「Draft PRを立てて」「PR本文を書いて」と依頼されたときは必ず使う。
---

`$ARGUMENTS` に従ってPRを作成または更新してください。明示された場合だけGitHubへ書き込み、mergeはしません。

現在branch、`origin/gm3/develop...HEAD` のcommitと差分、関連Issue、実行済み検証を確認します。未commitの変更はPRに含まれないため明記してください。未pushなら対象remoteを確認して同名branchを `origin` へpushし、force pushはしません。

作成時点の `.github/pull_request_template.md` を読み、その構造、順序、コメントの意図を保って実際の差分と検証結果を埋めてください。スキル内の記憶で項目を固定しません。未実施のテストを成功扱いにしません。baseは指定がなければ `gm3/develop`、通常はDraftかつ `@me` assigneeにします。同じheadのPRがあれば新規作成せず更新します。

作成後に `gh pr view` でbase、head、Draft、assignee、本文を確認し、URLと未確認事項を日本語で報告してください。review依頼、ready化、mergeは明示された場合だけ行います。
