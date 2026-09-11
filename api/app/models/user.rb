# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  include DeviseTokenAuth::Concerns::User

  belongs_to :role
  has_one :user_detail, dependent: :destroy
  has_many :groups, dependent: :destroy
  has_many :memos, dependent: :destroy

  # sub_repがない場合はnilが入ったsub_repみたいなのを返す
  NO_SUB_REP = {
    id: nil,
    name: nil,
    department_id: nil,
    grade_id: nil,
    tel: nil,
    email: nil,
    created_at: nil,
    updated_at: nil,
    student_id: nil
  }.freeze

  def self.with_sub_reps
    @record = Group.preload(:user, :sub_rep)
                   .map  do |group|
      {
        user: group.user,
        group: group,
        sub_rep: group.sub_rep.nil? ? NO_SUB_REP : group.sub_rep
      }
    end
  end

  def self.with_sub_rep(group_id)
    group = Group.find(group_id)
    return {
      user: group.user,
      group: group,
      sub_rep: group.sub_rep.nil? ? NO_SUB_REP : group.sub_rep
    }
  end

  ### user_detail (ユーザー詳細情報)
  #
  # 全てのuserとそのuser_detailを取得する
  def self.with_user_details
    @records = User.preload(:role)
                   .map  do |user|
      {
        user: user,
        role: user.role
        # "user_detail": user.user_detail,
        # "user_detail_info": user.user_detail.nil? ? nil : user.user_detail.to_info_h
      }
    end
  end

  # 指定したIDのuserとそのuser_detailを取得する
  def self.with_user_detail(user_id)
    user = User.find(user_id)
    return {
      user: user,
      role: user.role,
      user_detail: user.user_detail,
      user_detail_info: user.user_detail&.to_info_h
    }
  end

  def with_user_detail
    return {
      user: self,
      user_detail: user_detail&.to_info_h
    }
  end

  ### ユーザーが登録している情報の全てを取得する
  def with_regist_info
    @groups = groups
    @record = @groups.map do |group|
      {
        group: group,
        group_category: group.group_category&.name,
        sub_rep: group.sub_rep&.to_info_h,
        place_order: group.place_order&.to_place_name_h,
        stage_orders: if group.stage_orders.none?
                        nil
                      else
                        group.stage_orders.map do |stage_order|
                          {
                            stage_order: stage_order.to_info_h
                          }
                        end
                      end,
        stage_common_option: group.stage_common_option&.to_info_h,
        power_orders: if group.power_orders.none?
                        nil
                      else
                        group.power_orders.map do |power_order|
                          {
                            power_order: power_order.to_info_h
                          }
                        end
                      end,
        rental_orders: if group.rental_orders.none?
                         nil
                       else
                         group.rental_orders.map do |rental_order|
                           {
                             rental_item: rental_order.to_rental_item_info_h
                           }
                         end
                       end,
        employees: if group.employees.none?
                     nil
                   else
                     group.employees.map do |employee|
                       {
                         employee: employee.to_info_h
                       }
                     end
                   end,
        food_products: if group.food_products.none?
                         nil
                       else
                         group.food_products.map do |food_product|
                           {
                             food_product: food_product.to_info_h,
                             purchase_lists: food_product.purchase_lists.map do |purchase_list|
                               {
                                 purchase_list: purchase_list.to_info_h
                               }
                             end
                           }
                         end
                       end
      }
    end
    return @record
  end
end
