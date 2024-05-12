# User周りを整えていく

## Roleモデルを作る

`docker-compose run --rm admin_api rails g model Role name:string`

`docker-compose run --rm admin_api rails db:migrate`



## seed_fuのGemを入れる

`Gemfile`に追記する．

```diff
+ gem 'seed-fu'
```

`bundle install`を通すためにキャッシュなしでビルドする．

`docker-compose build --no-cache`



## 読み込むためのseed_fuファイルを作成

seed_fuファイルは`fixtures`というディレクトリに入れるみたいです．

`mkdir api/db/fixtures`

Roleモデルの初期データを入力する

今回は`role.rb`というファイル名にして`fixtures`の下に保存．

```ruby
Role.seed( :id,
  { id: 1, name: 'developer' },
  { id: 2, name: 'participant' },
  { id: 3, name: 'inventory_management' },
  { id: 4, name: 'venue_power' },
  { id: 5, name: 'sanitation_management' },
  { id: 6, name: 'staff' },
  { id: 7, name: 'user' },
)
```

ここでseed_fuファイルを読み込む．

`docker-compose run --rm api rails db:seed_fu`



## UserモデルとRoleモデルをつなげる

### 考え方

Roleモデルは3つしかないが，それらに属するUserはいっぱいいる．

例）

- 大場 role:developer （大場は開発者）
- 真下 role:developer （真下は開発者）
- 政木 role:manager （政木は総務の管理者）
- 参加団体 role:user （参加団体は一般ユーザー）

この中でも開発者は2人いる．つまり，開発者は多くのUserを持っている．



### UserとRoleのモデルを編集する

Roleは多くのユーザーを持つので

`api/app/models/role.rb`

```ruby
has_many :users
```



Userは必ずRoleに属するので

`api/app/models/user.rb`

```ruby
belongs_to :role
```



### 参照の仕方

例えばidが1のユーザーのロールを参照したければ

`User.find(1).role`でRoleのレコードが返ってくる．

`User.find(1).role.name`とするとそのRoleの名前（developerなど）が返ってくる．



## UserDetailモデルを作る

`docker-compose run --rm api rails g scaffold tel:string grade_id:intger grade_id:integer user:references`

`docker-compose run --rm api rails db:migrate`



## Departmentモデルを作る

`docker-compose run --rm api rails g model name:string`

`docker-compose run --rm api rails db:migrate`



## Gradeモデルを作る

`docker-compose run --rm api rails g model name:string`

`docker-compose run --rm api rails db:migrate`



## seed_fuを作る

`fixtures/department.rb`

```ruby
Department.seed( :id,
  { id: 1, name: '機械創造工学課程' },
  { id: 2, name: '電気電子情報工学課程' },
  { id: 3, name: '物質材料工学課程' },
  { id: 4, name: '環境社会基盤工学課程' },
  { id: 5, name: '生物機能工学課程' },
  { id: 6, name: '情報・経営システム工学課程' },
  { id: 7, name: '機械創造工学専攻' },
  { id: 8, name: '電気電子情報工学専攻' },
  { id: 9, name: '物質材料工学専攻' },
  { id: 10, name: '環境社会基盤工学専攻' },
  { id: 11, name: '生物機能工学専攻' },
  { id: 12, name: '情報・経営システム工学専攻' },
  { id: 13, name: '原子力システム安全工学専攻' },
  { id: 14, name: 'システム安全専攻' },
  { id: 15, name: '技術科学イノベーション専攻' },
  { id: 16, name: '情報・制御工学専攻' },
  { id: 17, name: '材料工学専攻' },
  { id: 18, name: 'エネルギー・環境工学専攻' },
  { id: 19, name: '生物統合工学専攻' },
  { id: 20, name: 'その他' },
)
```



`fixtures/grade.rb`

```ruby
Grade.seed( :id,
  { id: 1, name: 'B1[学部1年]' },
  { id: 2, name: 'B2[学部2年]' },
  { id: 3, name: 'B3[学部3年]' },
  { id: 4, name: 'B4[学部4年]' },
  { id: 5, name: 'M1[修士1年]' },
  { id: 6, name: 'M2[修士2年]' },
  { id: 7, name: 'D1[博士1年]' },
  { id: 8, name: 'D2[博士2年]' },
  { id: 9, name: 'D3[博士3年]' },
  { id: 10, name: 'GD1[イノベ1年]' },
  { id: 11, name: 'GD2[イノベ2年]' },
  { id: 12, name: 'GD3[イノベ3年]' },
  { id: 13, name: 'GD4[イノベ4年]' },
  { id: 14, name: 'GD4[イノベ5年]' },
  { id: 15, name: 'その他' },
)
```



## 紐づけ

`app/model/department.rb`

```ruby
class Department < ApplicationRecord
  has_many :user_details
end
```



`app/model/grade.rb`

```ruby
class Grade < ApplicationRecord
  has_many :user_details
end
```



`app/model/user_detail.rb`

```ruby
class UserDetail < ApplicationRecord
  belongs_to :user
  belongs_to :department
  belongs_to :grade
end
```



`app/model/user.rb`

```ruby
class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :trackable, :validatable
  include DeviseTokenAuth::Concerns::User
  belongs_to :role
  has_one :user_detail, dependent: :destroy
end
```



