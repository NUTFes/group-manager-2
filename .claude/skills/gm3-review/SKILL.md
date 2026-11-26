---
name: gm3-review
description: group-manager-2 の PR・ブランチ・差分をレビューする。このリポジトリで「レビューして」「PR を見て」「差分を確認して」と頼まれたときは、短い依頼でも初回・再レビューを問わず使う。
context: fork
agent: gm3-reviewer
background: false
---

`$ARGUMENTS` を読み取り専用でレビューしてください。コードの変更、commit、push、branchの切り替え、worktreeの作成、refの更新、GitHubへの投稿は行いません。

最初に `.agents/skills/gm3-review/references/review-guidelines.md` を最後まで読み、選択した実行役にも同じ基準を適用します。

## レビュー実行役

Claudeでこのスキルを実行しているため、指定がなければCodexへレビューを依頼します。

- ユーザーが「Codexでレビュー」と指定した場合は、Codexへレビューを依頼します。
- ユーザーが「Claudeでレビュー」と指定した場合は、現在の `gm3-reviewer` がレビューします。
- 指定がなければCodexを選びます。

Codexを選んだ場合は、`command -v codex` と `codex login status` で利用可能か読み取り専用で確認します。利用可能で、対象が現在のcheckoutに対するbase差分・commit・未commit差分として安全に表せる場合は、対象に応じて `codex review --base`、`--commit`、`--uncommitted` のいずれかを使います。custom promptで `.agents/skills/gm3-review/references/review-guidelines.md` を読み、同じ基準と出力形式でレビューするよう明記してください。

Codex CLIがない、未認証、実行に失敗した、またはPR番号などの対象をbranch切り替えやref更新なしで安全に渡せない場合は、失敗理由を短く記録し、現在の `gm3-reviewer` にフォールバックします。CLIのinstallやloginは行いません。

相手側の結果は、対象としたdiff、参照したbase、実行できなかった確認が明示されていることを確かめてから報告します。追加の指摘を無理に作らず、GitHubへは投稿しません。
