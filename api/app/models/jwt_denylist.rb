# app/models/jwt_denylist.rb
class JwtDenylist < ApplicationRecord
  # ここで Denylist 戦略を include する
  include Devise::JWT::RevocationStrategies::Denylist

  # マイグレーションで作成したテーブル名が 'jwt_denylists' の場合は次を追記
  self.table_name = 'jwt_denylists'
end
