---
name: gm3-verify
description: group-manager-2 の変更が Issue・PR の期待どおり動くか、既存Docker環境と必要に応じてPlaywrightで確認する。「動作確認して」「画面で確かめて」「実装できているか確認して」と依頼されたときは必ず使う。
---

`$ARGUMENTS` の動作を確認してください。コード変更やGitHub投稿はしません。確認に必要なテストデータはローカルDBへ作成してよいですが、作成・更新したデータと後始末の要否を記録してください。専用のDocker環境、fixture、mock、テストコードは、別途依頼されない限り作成しません。

現在のbranchにPRがあれば、PR本文、関連Issue、差分を読み、PRの動作確認項目と受け入れ条件を基準にします。PRがなければIssueと依頼から条件を整理します。各条件を API / user / admin_view / user_front / rental の確認へ対応づけてください。`CLAUDE.md` のDocker方針に従い、`docker compose ps` で既存環境を確認して必要なサービスだけを起動します。

変更に近い自動テスト、lint、型検査を先に実行し、失敗はbaseでも起きるか切り分けます。UIはPlaywrightで実際の対象URLを開き、通常操作、loading、empty、error、二重操作、権限違い、reloadを必要な範囲で確認し、consoleとnetworkも見ます。APIはフロントのrequest、認証・認可、DB反映まで追い、mockだけの成功を実環境の成功と扱いません。

PRの確認項目または受け入れ条件ごとに PASS / FAIL / 未確認を付け、他の人が同じ確認を行える操作手順、使用したテストデータ、期待値、実測、証拠、環境の前提を日本語で報告してください。PR本文やコメントへの反映は、ユーザーが明示した場合だけ行います。
