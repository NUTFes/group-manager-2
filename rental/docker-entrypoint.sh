#!/bin/sh
set -e

# /app はホストのチェックアウトを bind mount したもの。ここを chown すると
# ホスト側のファイル所有者まで書き換わり、uid 1000 以外の開発者は自分の
# ソースツリーに書けなくなる（エディタの保存や git checkout が失敗する）。
# そのため /app は触らず、ホスト側の所有者をそのまま実行ユーザーにする。
APP_UID=$(stat -c '%u' /app)
APP_GID=$(stat -c '%g' /app)

# node_modules・.next・.pnpm-store は named volume で、イメージ内では node
# ユーザー所有で作られている。実行ユーザーに合わせて所有権を直す。
for dir in /app/node_modules /app/.next /app/.pnpm-store; do
  [ -d "$dir" ] && chown "$APP_UID:$APP_GID" "$dir"
done

# pnpm / next がキャッシュを書けるように HOME も実行ユーザー所有にする
export HOME=/home/node
chown "$APP_UID:$APP_GID" "$HOME"

# execで置き換えることでnodeプロセスがPID1になり、SIGTERMなどを正しく受け取れるようにする
exec setpriv --reuid="$APP_UID" --regid="$APP_GID" --clear-groups -- "$@"
