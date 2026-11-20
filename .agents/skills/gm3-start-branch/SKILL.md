---
name: gm3-start-branch
description: group-manager-2 で Issue や作業用の branch を、最新の origin/gm3/develop から作成する。「ブランチを切って」「Issue に着手して」「作業を始めて」と依頼されたときに使う。
---

# GM3 branch 作成

branch 作成を明示された場合だけ実行する。

1. `git status --short --branch` と worktree を確認する。未commitの変更や未追跡ファイルは削除・退避せず、切り替えで衝突する場合は止めて伝える。
2. Issue 番号があれば `gh issue view` で目的、種類、状態を読む。Issue がなければ依頼内容から短い名前を作る。
3. `git fetch origin` を実行し、`origin/gm3/develop` の最新commitを確認する。
4. `feat`、`fix`、`chore` など変更の種類を選ぶ。通常は `<type>/<GitHub login>/<issue番号>-<短いkebab-case>` とし、Issue がなければ番号を省く。既存branch名と衝突する場合は勝手に上書きしない。
5. `git switch -c <branch> origin/gm3/develop` で作成する。localの `gm3/develop` が古くても基点にしない。
6. 現在branch、基点commit、Issueを報告する。コード変更、commit、push、Issue更新は、同時に依頼されていなければ行わない。
