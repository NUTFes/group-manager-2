# `rails db:migrate`が通らない場合

## 原因

たぶん，中途半端にデータベースのテーブルを作ってしまっている．



## 解決法

コンソールに入って直接テーブルを削除

`docker-compose run api rails c`

もし`:users`テーブルを消すのであれば

`ActiveRecord::Migration.drop_table(:users)`というコマンドを叩く．



再度`docker-compose run api rails db:migrate`



## ちなみに

もし`migrate`を戻したければ，`docker-compose run rails db:rollback`

最初に戻したければ，`docker-compose run rails db:migrate VERSION=0`