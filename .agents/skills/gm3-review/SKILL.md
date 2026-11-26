---
name: gm3-review
description: group-manager-2 の PR・ブランチ・差分をレビューする。このリポジトリで「レビューして」「PR を見て」「差分を確認して」と頼まれたときは、短い依頼でも初回・再レビューを問わず使う。
---

# GM3 コードレビュー

コードの変更、commit、push、branchの切り替え、worktreeの作成、refの更新、GitHubへの投稿は行わない。

最初に [references/review-guidelines.md](references/review-guidelines.md) を最後まで読み、選択した実行役にも同じ基準を適用する。

## レビュー実行役

Codexでこのスキルを実行しているため、指定がなければClaudeへレビューを依頼する。

- ユーザーが「Codexでレビュー」と指定した場合は、Codex自身でレビューする。
- ユーザーが「Claudeでレビュー」と指定した場合は、Claudeへレビューを依頼する。
- 指定がなければClaudeを選ぶ。

Claudeを選んだ場合は、`command -v claude` と `claude auth status` で利用可能か読み取り専用で確認する。利用可能なら、非対話モードの `claude -p` を `--disable-slash-commands --permission-mode plan --permission-prompts none --no-session-persistence` 付きで実行する。相手側でこのスキルを再発火させず、`.agents/skills/gm3-review/references/review-guidelines.md` を読んで対象をレビューするようpromptへ明記する。Edit・Writeは与えず、必要なRead・Grep・Glob・Bashだけを使わせる。

Claude CLIがない、未認証、実行に失敗した、または対象を安全に渡せない場合は、失敗理由を短く記録してCodex自身のレビューへフォールバックする。CLIのinstallやloginは行わない。

Codex自身でレビューする場合は、利用できるなら一つのレビュー用subagentへ対象と共通基準を渡し、結果を待つ。利用できなければ直接レビューする。複数へ分割して重複した指摘を出さない。

相手側の結果は、対象としたdiff、参照したbase、実行できなかった確認が明示されていることを確かめてから報告する。追加の指摘を無理に作らず、GitHubへは投稿しない。
