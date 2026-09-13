#!/bin/bash
set -e

# APP_ENVはUserFrontUrlResolverが確定情報URLのドメイン解決に使う。
# 未知の値だと開発用URLへのフォールバックが発生しQRコードが壊れるため、
# 起動時に許容値かどうかを検証してfail-fastさせる。
app_env="${APP_ENV:-development}"
case "$app_env" in
  development|staging|production) ;;
  *)
    echo "Unsupported APP_ENV: $app_env" >&2
    exit 1
    ;;
esac

# Remove a potentially pre-existing server.pid for Rails.
rm -f /myapp/tmp/pids/server.pid

# Then exec the container's main process (what's set as CMD in the Dockerfile).
exec "$@"
