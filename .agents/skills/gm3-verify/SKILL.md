---
name: gm3-verify
description: group-manager-2 の変更が Issue・PR の期待どおり動くか、既存Docker環境と必要に応じてブラウザで確認する。「動作確認して」「画面で確かめて」「実装できているか確認して」と依頼されたときに使う。
---

# GM3 動作確認

コード変更やGitHub投稿を行わず、観測した事実を報告する。確認に必要なテストデータはローカルDBへ作成してよいが、作成・更新したデータと後始末の要否を記録する。専用のDocker環境、fixture、mock、テストコードは、別途依頼されない限り作成しない。

1. 現在のbranchにPRがあれば、PR本文、関連Issue、差分を読み、PRの動作確認項目と受け入れ条件を基準にする。PRがなければIssueと依頼から条件を整理する。各条件を API / user / admin_view / user_front / rental の確認へ対応づける。
2. `AGENTS.md` のDocker方針に従い、`docker compose ps` で既存環境を確認する。必要なサービスだけを起動し、起動済み環境とDBを再利用する。
3. 変更に近い自動テスト、lint、型検査を先に実行する。失敗したらbaseでも起きるかを切り分ける。
4. UIは対象URLをブラウザで開く。Docker版Playwright MCPを使う場合は `docs/playwright_mcp_docker.md` を読み、`localhost` ではなく同じポートの `host.docker.internal` へ接続する。通常操作だけでなく loading、empty、error、二重操作、権限違い、reloadを受け入れ条件に応じて確認し、画面表示だけでなくconsole errorとnetwork request/responseも見る。
5. APIは実際のフロントのrequest、認証・認可、DB反映まで追う。mockだけの成功を実環境の成功と扱わない。
6. PRの確認項目または受け入れ条件ごとに PASS / FAIL / 未確認を付け、他の人が同じ確認を行える操作手順、使用したテストデータ、期待値、実測、証拠、環境の前提を日本語で報告する。再現した問題は断定し、推測は分ける。PR本文やコメントへの反映は、ユーザーが明示した場合だけ行う。
