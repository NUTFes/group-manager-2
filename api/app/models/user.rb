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

  ### ユーザーが登録している情報の全てを取得する
  def with_regist_info
    @groups = self.groups
    @record = @groups.map{
      |group|
      { 
        "group": group,
        "group_category": group.group_category.nil? ? nil : group.group_category.name,
        "sub_rep": group.sub_rep.nil? ? nil : group.sub_rep.to_info_h,
        "place_order": group.place_order.nil? ? nil : group.place_order.to_place_name_h,
        "stage_orders": group.stage_orders.count == 0 ? nil : group.stage_orders.map {
          |stage_order|
          { 
            "stage_order": stage_order.to_info_h
          }
        },
        "stage_common_option": group.stage_common_option.nil? ? nil : group.stage_common_option.to_info_h,
        "power_orders": group.power_orders.count == 0 ? nil : group.power_orders.map {
          |power_order|
          {
            "power_order": power_order.to_info_h
          }
        },
        "rental_orders": group.rental_orders.count == 0 ? nil : group.rental_orders.map{
          |rental_order|
          {
            "rental_item": rental_order.to_rental_item_info_h,
          }
        },
        "employees": group.employees.count == 0 ? nil : group.employees.map{
          |employee|
          {
            "employee": employee.to_info_h
          }
        },
        "food_products": group.food_products.count == 0 ? nil : group.food_products.map{
          |food_product|
          {
            "food_product": food_product.to_info_h,
            "purchase_lists": food_product.purchase_lists.map{
              |purchase_list|
              {
                "purchase_list": purchase_list.to_info_h
              }
            }
          }
        }
      }
    }
    return @record
  end

end
