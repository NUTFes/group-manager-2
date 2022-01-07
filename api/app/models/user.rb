# frozen_string_literal: true

class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :trackable, :validatable
  include DeviseTokenAuth::Concerns::User
  belongs_to :role
  has_one :user_detail, dependent: :destroy
  has_many :groups, dependent: :destroy
  has_many :memos

  ### user_detail (ユーザー詳細情報)
  #
  # 全てのuserとそのuser_detailを取得する
  def self.with_user_details
    @records = User.preload(:user_detail)
      .map{ 
        |user| 
        { 
          "user": user, 
          "user_detail": user.user_detail,
          "user_detail_info": user.user_detail.nil? ? nil : user.user_detail.to_info_h
        } 
      }
  end

  # 指定したIDのuserとそのuser_detailを取得する
  def self.with_user_detail(user_id)
    @record = User.eager_load(:user_detail).where(users: {id: user_id})
      .map{ 
        |user| 
        { 
          "user": user, 
          "user_detail": user.user_detail,
          "user_detail_info": user.user_detail.nil? ? nil : user.user_detail.to_info_h
        } 
      }
  end

end
