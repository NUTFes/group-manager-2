---
name: gm3-verify
description: group-manager-2 の変更が Issue・PR の期待どおり動くか、既存Docker環境と必要に応じてPlaywrightで確認する。「動作確認して」「画面で確かめて」「実装できているか確認して」と依頼されたときは必ず使う。
---

`$ARGUMENTS` の動作を確認してください。コード変更やGitHub投稿はせず、ローカルデータを変える操作が必要なら対象と戻し方を先に明確にします。

Issue、PR、差分から目的と受け入れ条件を列挙し、API / user / admin_view / user_front / rental の対象を決めます。`CLAUDE.md` のDocker方針に従い、`docker compose ps` で既存環境を確認して必要なサービスだけを起動します。

変更に近い自動テスト、lint、型検査を先に実行し、失敗はbaseでも起きるか切り分けます。UIはPlaywrightで実際の対象URLを開き、通常操作、loading、empty、error、二重操作、権限違い、reloadを必要な範囲で確認し、consoleとnetworkも見ます。APIはフロントのrequest、認証・認可、DB反映まで追い、mockだけの成功を実環境の成功と扱いません。

条件ごとに PASS / FAIL / 未確認、操作、期待値、実測、証拠、環境・データの前提を日本語で報告してください。
