---
name: gm3-implement
description: group-manager-2 の Issue・仕様・依頼に沿ってコードを実装する。「実装して」「修正して」「機能を追加して」と依頼されたときは必ず使う。調査やレビューだけの依頼では使わない。
---

`$ARGUMENTS` を実装してください。Issue、PR、依頼から目的、範囲、受け入れ条件を一文で整理します。曖昧さが結果を大きく変える場合だけ確認し、それ以外は既存実装から判断します。

`AGENTS.md` と `CLAUDE.md`、同種のcontroller/model/component/API client、テスト、履歴を読み、APIから各フロントまで影響範囲を追ってください。一般論より既存パターンを優先し、目的に必要な最小差分を実装します。無関係なrename、format、例外動作の変更、依存更新を混ぜず、認証・認可をフロントだけに任せません。

Docker環境は `CLAUDE.md` に従います。migrationは既存データとrollback、API変更は呼び出し元とOAS、UIはloading、empty、error、二重操作を確認します。変更に近いテスト、lint、型検査を実行します。

変更、設計判断、検証、未確認事項を日本語で報告してください。commit、push、Issue・PR操作は明示された場合だけ行います。
