---
name: gm3-start-branch
description: group-manager-2 で Issue や作業用の branch を、最新の origin/gm3/develop から作成する。「ブランチを切って」「Issue に着手して」「作業を始めて」と依頼されたときは必ず使う。
---

`$ARGUMENTS` の作業branchを作成してください。branch作成を明示された場合だけ実行します。

`git status --short --branch` とworktreeを確認し、未commitの変更や未追跡ファイルを削除・退避しないでください。Issue番号があれば `gh issue view` で内容を読みます。`git fetch origin` の後、必ず最新の `origin/gm3/develop` から作成してください。

branch名は変更に応じて `feat`、`fix`、`chore` などを選び、通常は `<type>/<GitHub login>/<issue番号>-<短いkebab-case>` とします。Issueがなければ番号を省きます。既存branchへ上書きしません。

`git switch -c <branch> origin/gm3/develop` で作成し、現在branch、基点commit、Issueを日本語で報告してください。依頼されていないコード変更、commit、push、Issue更新は行いません。
