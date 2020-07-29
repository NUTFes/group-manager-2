# rails devise_token_auth

issue9



## やったこと

### GemfileにGemを追加

```ruby
gem 'devise'
gem 'devise_token_auth'
gem 'rack-cors'
```



### bundle install

`docker-compose run api bundle install`

`docker-compose down`

`docker-compose build`

`docker-compose up`



### 導入

`docker-compose run api rails g devise:install`

`docker-compose run api rails g devise_token_auth:install User auth`



### Trackableを追加する

`api/db/migrate/~_devise_token_auth_create_users.rb`

```ruby
## Trackable
t.integer  :sign_in_count, default: 0, null: false
t.datetime :current_sign_in_at
t.datetime :last_sign_in_at
t.string   :current_sign_in_ip
t.string   :last_sign_in_ip
```

独り言）後でユーザーのUser Infoの部分を変えなきゃなぁ．．．



### migrate

`docker-compose run api rails db:migrate`



### conrollerを作る

`docker-compose run api rails g controller api/auth/registrations`



### devise token authの設定を追加する

`config.change_headers_on_each_request = true`というコメントアウトを外し，`false`にする．

これはリクエストごとにトークンを更新するかというものを決めるものなのかな？



`config.token_lifespan = 2.weeks`というコメントアウトを外す．

これはトークンの有効期限を決めるもので，デフォルトでは2週間になっている．



