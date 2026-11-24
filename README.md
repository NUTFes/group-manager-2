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
Ruby 3.3.12 / Rails 7.2.3.2

### user（参加団体向け画面）
Next.js 15 / React 19 / TypeScript

### user_front（公開画面）
Nuxt 3

### admin_view（管理者画面）
Nuxt 2

### rental（貸出・返却記録画面）
Next.js 16 / React 19 / TypeScript。原則は Cloudflare Access で保護し、必要に応じて `RENTAL_PASSCODE` によるパスワード画面を使用します。

## セットアップ
[git cloneをしたら](https://github.com/NUTFes/group-manager-2/wiki/git-clone-%E3%82%92%E3%81%97%E3%81%9F%E3%82%89)

## 開発メモ
- [Playwright MCP を Docker で使う](docs/playwright_mcp_docker.md)
- [貸出・返却記録アプリ(rental/) 設計書](docs/rental/design.md)
