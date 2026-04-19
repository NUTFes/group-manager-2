# Mergiraf 導入メモ

このリポジトリでは、`Mergiraf` を使って構文認識ベースのコンフリクト解消を行えるようにしています。

## 対象ファイル

ルートの `.gitattributes` で、以下のようなこのリポジトリで利用頻度の高い対応形式に `merge=mergiraf` を設定しています。

- Ruby: `*.rb`, `Gemfile`, `Rakefile`
- JavaScript / TypeScript: `*.js`, `*.jsx`, `*.mjs`, `*.ts`, `*.tsx`
- 宣言的フォーマット: `*.json`, `*.yml`, `*.yaml`, `*.toml`, `*.html`
- `Makefile`

`*.vue`、`*.erb`、`*.jbuilder` などは Mergiraf の公式サポート対象ではないため、通常の Git マージに任せます。

## ローカルセットアップ

1. `mergiraf` バイナリをインストールします。
   - 公式: <https://mergiraf.org/installation.html>
2. Git の conflict style を `diff3` にします。
3. Git merge driver として `mergiraf` を登録します。

```bash
git config --global merge.conflictStyle diff3
git config --global merge.mergiraf.name mergiraf
git config --global merge.mergiraf.driver 'mergiraf merge --git %O %A %B -s %S -x %X -y %Y -p %P -l %L'
```

このリポジトリでは `.gitattributes` をコミットしているため、グローバルの `attributes` ファイルに追加設定する必要はありません。

Git 2.44 以上が推奨です。

## 使い方

セットアップ後は、対応ファイルに対して次の操作で自動的に Mergiraf が使われます。

- `git merge`
- `git rebase`
- `git cherry-pick`
- `git revert`

Mergiraf が自動解決した場合は、必要に応じて `mergiraf review <merge-id>` で結果を確認してください。

## 手動でコンフリクトへ適用する

既にコンフリクトが発生している場合は、手動で再適用できます。

```bash
mergiraf solve path/to/file
git add path/to/file
```

その後、進行中の操作に応じて `git merge --continue`、`git rebase --continue`、`git cherry-pick --continue` などを実行してください。

一時的に無効化したい場合は、対象コマンドの前に `mergiraf=0` を付けてください。

```bash
mergiraf=0 git rebase origin/gm3/develop
```
