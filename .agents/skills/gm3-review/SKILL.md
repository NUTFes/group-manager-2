---
name: gm3-review
description: Review a group-manager-2 PR, branch, or diff using nutmeg's evidence-based severity and scope rules. Automatically use when the user asks to review code in this repository, including short requests such as "レビューして", "PR を見て", or "差分を確認して", as well as initial and follow-up reviews.
---

# GM3 PR review

Perform a read-only review. Do not edit files, create commits, push, or post to GitHub.

Read these sources before judging the diff:

1. The applicable `AGENTS.md` files.
2. [AI コードレビュー運用ガイド](../../../docs/dev/ai-code-review.md).
3. The PR description and linked issue when available.
4. Existing code and tests around the changed paths.

## Choose the review mode and target

Infer the target from the user's invocation:

- Initial review with no target: compare `origin/gm3/develop...HEAD`.
- PR number or URL: inspect its base, head, description, linked issue, comments, and diff with read-only `gh` commands. Review the checked-out head when it matches; otherwise use read-only GitHub data and clearly state what could not be run locally.
- Explicit base, branch, commit, or diff range: use it as written.
- Follow-up review: inspect only `<previous-commit>...HEAD`, re-check the listed earlier findings, and report a new finding only when the follow-up changes introduced it.

Do not change branches or create a worktree unless the user explicitly asks.

## Isolate the review

When subagents are available, delegate the complete review to exactly one review subagent and wait for its result. Give it the target, review mode, paths to the applicable instructions and shared guide, PR purpose, earlier findings for follow-up review, and the read-only/no-posting constraints. Ask it to return the report in the format below. If subagents are unavailable, perform the same workflow directly.

The reviewer must inspect the whole relevant change, not divide findings across independent reviewers. A single reviewer avoids duplicate and inconsistent severity judgments.

## Review method

Establish the PR's purpose in one sentence before evaluating findings. Then inspect the diff in repository context and verify each candidate against all five gates in the shared guide:

1. Did this PR introduce the problem?
2. Can a real application or deployment path reach it?
3. Can it occur with actual or plausibly existing data?
4. Is the risk material for this system's scale and operation?
5. Does the judgment match established repository patterns?

Deeply check correctness, authorization and tenant isolation, API/client compatibility, regression, migration safety and data compatibility, UI states, and whether tests assert behavior rather than merely execute code. Treat PR claims and bot conclusions as unverified until supported by code, history, tests, or reproducible behavior.

Use `git show`, `git blame`, the base version, and nearby patterns to distinguish regression from existing debt. Run the smallest relevant checks when feasible. Tests are evidence, not permission to broaden the review into unrelated failures.

Only report an actionable finding when all of these are true:

- The reviewed change introduced it.
- A concrete input or sequence leads to observable incorrect behavior or meaningful risk.
- The evidence is specific enough to explain and, where practical, reproduce.
- A small fix fits this PR.

Do not report pre-existing issues, unreachable defensive hypotheticals, low-value concurrency hardening for unlikely operations, style preferences, unrelated lint, or CI failures that also occur on the base. Mention an out-of-scope systemic concern only under `Separate issue candidates`, and only when it is important enough that a human should preserve it.

Use `REQUEST_CHANGES` only for merge-blocking findings under the shared guide. Suggestions and separate-issue candidates do not block approval.

## Output

Write in Japanese. Lead with findings in descending severity. For every finding include:

- concise title without invented severity jargon
- `file:line`
- concrete input or sequence and resulting failure
- evidence, including why this PR introduced it
- the smallest repository-consistent fix

Then include:

1. `Suggestions` for non-blocking improvements, only when worth the author's time.
2. `Separate issue candidates`, omitted when empty.
3. `Verified areas` listing important perspectives checked with no finding.
4. `Unverified` listing tests or facts that could not be confirmed.
5. For follow-up review, each earlier finding as `RESOLVED`, `PARTIALLY`, or `NOT RESOLVED` with `file:line` and evidence.
6. A final line containing exactly `APPROVE` or `REQUEST_CHANGES`.

If there are no actionable findings, say so directly rather than inventing one. Never output ready-to-post GitHub comments as if they were already verified by a human.
