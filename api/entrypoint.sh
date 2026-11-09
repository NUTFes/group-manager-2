#!/bin/bash
set -e

# APP_ENVはUserFrontUrlResolverが確定情報URLのドメイン解決に使う。
# 未設定・未知の値だと開発用URLへのフォールバックが発生しQRコードが
# 壊れるため、起動時に許容値かどうかを検証してfail-fastさせる。
# ローカル開発でもcompose.ymlのapiサービスでAPP_ENV=developmentを
# 明示的に設定しており、ここで暗黙のデフォルト値は使わない。
if [ -z "${APP_ENV:-}" ]; then
  echo "APP_ENV must be set" >&2
  exit 1
fi
case "$APP_ENV" in
  development|staging|production) ;;
  *)
    echo "Unsupported APP_ENV: $APP_ENV" >&2
    exit 1
    ;;
esac

# Remove a potentially pre-existing server.pid for Rails.
rm -f /myapp/tmp/pids/server.pid

# Then exec the container's main process (what's set as CMD in the Dockerfile).
exec "$@"
