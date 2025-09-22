# 参加団体管理アプリ ver 2.x
## ユーザー画面（参加団体向け）
[site](http://group-manager.nutfes.net/)

### Login
<img width="1680" alt="user_login" src="https://user-images.githubusercontent.com/90322124/179436796-b666a494-30f5-4352-b10a-2b1ff04a0b6c.png">

### Mypage
<img width="1680" alt="user_mypage" src="https://user-images.githubusercontent.com/90322124/179436320-deb2f525-eb77-4264-8f87-c6ee16b8c99f.png">

## 管理者画面(実行委員向け）
[site](http://group-manager-admin.nutfes.net/)
<img width="1680" alt="admin_page" src="https://user-images.githubusercontent.com/90322124/179436360-6125f5fb-29c1-4df4-9af4-de1993f0ff0b.png">

## 使用技術
![group-manager-jpeg 001](https://user-images.githubusercontent.com/33748835/117114823-45700b00-adc7-11eb-8bab-7442f38a7065.jpeg)

### api
ruby 2.7.1 <br> 
rails 6.1.3.1<br>

### view(ユーザー画面)
SPA<br>
node v12.14.1<br>
@vue/cli 4.4.4<br>

### admin_view(管理者画面）
SSR<br>
node v12.18.4<br>
nuxt.js<br>

## セットアップ
[git cloneをしたら](https://github.com/NUTFes/group-manager-2/wiki/git-clone-%E3%82%92%E3%81%97%E3%81%9F%E3%82%89)

## OpenAPI Generator
- `scripts/openapi-generator` で [openapi-generator-cli](https://github.com/OpenAPITools/openapi-generator) を Docker 経由で利用できます。
- 初回実行時は `docker` がイメージ `openapitools/openapi-generator-cli:v7.5.0` を取得します。
- 例: Rails サーバースタブを生成する場合
  ```bash
  scripts/openapi-generator generate \
    -i openapi/openapi.yml \
    -g ruby-on-rails \
    -o api/generated/server
  ```
- 生成物の出力先はマウント済みのリポジトリ内なら自由に指定できます。
- `make openapi-cli cmd="<コマンド>"` で CLI をそのまま呼び出せます（例: `cmd="version"`）。
- `make openapi-generate` では `openapi/openapi.yml` を元に Rails サーバースタブを `api/generated/server` へ生成します。
  - `spec`, `output`, `generator`, `extra` を渡すと動作を上書きできます。
