FROM nginx:1.15.8

# インクルード用のディレクトリ内を削除
RUN rm -f /etc/nginx/conf.d/*

# Nginxの設定ファイルをコンテナにコピー
ADD group-manager-api.conf /etc/nginx/conf.d/group-manager-api.conf
ADD group-manager.conf /etc/nginx/conf.d/group-manager.conf
ADD group-manager-admin.conf /etc/nginx/conf.d/group-manager-admin.conf
ADD default.conf /etc/nginx/conf.d/default.conf

# ビルド完了後にNginxを起動
CMD /usr/sbin/nginx -g 'daemon off;' -c /etc/nginx/nginx.conf
