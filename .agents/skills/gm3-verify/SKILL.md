---
name: gm3-verify
description: group-manager-2 の変更が Issue・PR の期待どおり動くか、既存Docker環境と必要に応じてブラウザで確認する。「動作確認して」「画面で確かめて」「実装できているか確認して」と依頼されたときに使う。
---

# GM3 動作確認

コード変更やGitHub投稿を行わず、観測した事実を報告する。ローカル環境のデータを変更する操作が必要な場合は、対象と戻し方を先に明確にする。

1. Issue、PR、差分から目的と受け入れ条件を列挙し、確認対象を API / user / admin_view / user_front / rental に分ける。
2. `AGENTS.md` のDocker方針に従い、`docker compose ps` で既存環境を確認する。必要なサービスだけを起動し、起動済み環境とDBを再利用する。
3. 変更に近い自動テスト、lint、型検査を先に実行する。失敗したらbaseでも起きるかを切り分ける。
4. UIは対象URLをブラウザで開き、通常操作だけでなく loading、empty、error、二重操作、権限違い、reloadを受け入れ条件に応じて確認する。画面表示だけでなくconsole errorとnetwork request/responseも見る。
5. APIは実際のフロントのrequest、認証・認可、DB反映まで追う。mockだけの成功を実環境の成功と扱わない。
6. 条件ごとに PASS / FAIL / 未確認、操作手順、期待値、実測、証拠、環境やデータの前提を日本語で報告する。再現した問題は断定し、推測は分ける。
