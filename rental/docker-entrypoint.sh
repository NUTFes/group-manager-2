#!/bin/sh
set -e

# ホスト側チェックアウトの所有者が node ユーザー（uid 1000）でない場合でも書き込めるようにする。
# node_modules・.next・.pnpm-store は named volume で別マウントになっているため -xdev で対象から除外する。
find /app -xdev -exec chown node:node {} + || true

# execで置き換えることでnodeプロセスがPID1になり、SIGTERMなどを正しく受け取れるようにする
export HOME=/home/node
exec setpriv --reuid=node --regid=node --clear-groups -- "$@"
