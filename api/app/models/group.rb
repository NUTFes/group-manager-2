class Group < ApplicationRecord
    belongs_to :user
    belongs_to :fes_year
    belongs_to :group_category
    has_one :stage_common_option, dependent: :destroy
    has_many :power_orders, dependent: :destroy
    has_one :sub_rep, dependent: :destroy
    has_many :employees, dependent: :destroy
    has_one :place_order, dependent: :destroy
    has_many :stage_orders, dependent: :destroy
    has_many :food_products, dependent: :destroy
    has_many :rental_orders, dependent: :destroy
    has_many :assign_rental_items, dependent: :destroy
    has_one :group_identification, dependent: :destroy

    ### group_category (参加団体カテゴリ)
    
    # 全てのgroupとそのgroup_categoryを取得する
    def self.with_group_categories
      @records = Group.preload(:group_category)
        .map{ 
          |group| 
          { 
            "group": group, 
            "group_category": group.group_category 
          } 
        }
    end

    # 指定したIDのgroupとそのgroup_categoryを取得する
    def self.with_group_category(group_id)
      @record = Group.eager_load(:group_category).where(groups: {id: group_id})
        .map{ 
          |group| 
          { 
            "group": group, 
            "group_category": group.group_category 
          } 
        }
    end


    ### sub rep (副代表)
    
    # 全てのgroupとそのsub_repを取得する
    def self.with_sub_reps
      @records = Group.preload(:sub_rep)
        .map{ 
          |group| 
          { 
            "group": group, 
            "sub_rep": group.sub_rep,
            "sub_rep_info": group.sub_rep.nil? ? nil : group.sub_rep.to_info_h
          } 
        }
    end

    # 指定したIDのgroupとそのsub_repを取得する
    def self.with_sub_rep(group_id)
      @record = Group.eager_load(:sub_rep).where(groups: {id: group_id})
        .map{ 
          |group| 
          { 
            "group": group, 
            "sub_rep": group.sub_rep,
            "sub_rep_info": group.sub_rep.nil? ? nil : group.sub_rep.to_info_h
          } 
        }
    end


    ### place order (会場申請)

    # 全てのgroupとそのplace_orderを取得する
    def self.with_place_orders
      @records = Group.preload(:place_order)
        .map{ 
          |group| 
          { 
            "group": group, 
            "place_order": group.place_order,
            "place_order_name": group.place_order.nil? ? nil : group.place_order.to_place_name_h
          } 
        }
    end

    # 指定したIDのgroupとそのplace_orderを取得する
    def self.with_place_order(group_id)
      @record = Group.eager_load(:place_order)
        .where(groups: {id: group_id})
        .map{ 
          |group| 
          { 
            "group": group, 
            "place_order": group.place_order, 
            "place_order_name": group.place_order.nil? ? nil : group.place_order.to_place_name_h
          } 
        }
    end

    
    ### stage order（ステージ申請）
    
    # 全てのgroupとそのstage_orderを取得する
    def self.with_stage_orders
      @records = Group.preload(:stage_orders)
        .map{ 
          |group| 
          { 
            "group": group, 
            "stage_orders": group.stage_orders.count == 0 ? nil : group.stage_orders.map{
              |stage_order|
              {
                "stage_order": stage_order,
                "stage_order_info": stage_order.nil? ? nil : stage_order.to_info_h
              }
            }
          } 
        }
    end

    # 指定したIDのgroupとそのstage_orderを取得する
    def self.with_stage_order(group_id)
      @record = Group.eager_load(:stage_orders)
        .where(groups: {id: group_id})
        .map{ 
          |group| 
          { 
            "group": group, 
            "stage_orders": group.stage_orders.count == 0 ? nil : group.stage_orders.map{
              |stage_order|
              {
                "stage_order": stage_order,
                "stage_order_info": stage_order.nil? ? nil : stage_order.to_info_h
              }
            }
          } 
        }
    end


    ### stage common option（ステージのオプション）
    
    # 全てのgroupとそのstage_common_optionを取得する
    def self.with_stage_common_options
      @records = Group.preload(:stage_common_option)
        .map{
        |group|
        {
          "group": group,
          "stage_common_option": group.stage_common_option
        }
      }
    end

    # 指定したIDのgroupとそのstage_common_optionを取得する
    def self.with_stage_common_option(group_id)
      @records = Group.eager_load(:stage_common_option)
        .where(groups: {id: group_id})
        .map{
        |group|
        {
          "group": group,
          "stage_common_option": group.stage_common_option
        }
      }
    end


    ### power order（電力申請）
    
    # 全てのgroupとそのpower_orderを取得する
    def self.with_power_orders
      @records = Group.preload(:power_orders)
        .map{
        |group|
        {
          "group": group,
          "power_orders": group.power_orders.count == 0 ? nil : group.power_orders
        }
      }
    end

    # 指定したIDのgroupとそのpower_orderを取得する
    def self.with_power_order(group_id)
      @record = Group.eager_load(:power_orders)
        .where(groups: {id: group_id})
        .map{
        |group|
        {
          "group": group,
          "power_orders": group.power_orders.count == 0 ? nil : group.power_orders
        }
      }
    end


    ### rental order（物品申請）
    
    # 全てのgroupとそのrental_orderを取得する
    def self.with_rental_orders
      @records = Group.preload(:rental_orders)
        .map{
          |group|
          {
            "group": group,
            "rental_orders": group.rental_orders.count == 0 ? nil : group.rental_orders.map{
              |rental_order|
              {
                "rental_order": rental_order,
                "rental_item_name": rental_order.rental_item.name
              }
            }
          }
        }
    end

    # 指定したIDのgroupとそのrental_orderを取得する
    def self.with_rental_order(group_id)
      @record = Group.eager_load(:rental_orders)
        .where(groups: {id: group_id})
        .map{
        |group|
        {
          "group": group,
          "rental_orders": group.rental_orders.count == 0 ? nil : group.rental_orders.map{
            |rental_order|
            {
              "rental_order": rental_order,
              "rental_item_name": rental_order.rental_item.name
            }
          }
        }
      }
    end


    ### employee（従業員）
    
    # 全てのgroupとそのemployeeを取得する
    def self.with_employees
      @records = Group.preload(:employees)
        .map{
          |group|
          {
            "group": group,
            "employees": group.employees.count == 0 ? nil : group.employees
          }
        }
    end

    # 指定したIDのgroupとそのemployeeを取得する
    def self.with_employee(group_id)
      @record = Group.eager_load(:employees)
        .where(groups: {id: group_id})
        .map{
          |group|
          {
            "group": group,
            "employees": group.employees.count == 0 ? nil : group.employees
          }
        }
    end


    ### food_product（調理食品）

    # 全てのgroupとそのfood_productを取得する
    def self.with_food_products
      @records = Group.preload(:food_products)
        .map{
          |group|
          {
            "group": group,
            "food_products": group.food_products.count == 0 ? nil : group.food_products
          }
        }
    end

    # 指定したIDのgroupとそのfood_productを取得する
    def self.with_food_product(group_id)
      @record = Group.eager_load(:food_products)
        .where(groups: {id: group_id})
        .map{
          |group|
          {
            "group": group,
            "food_products": group.food_products.count == 0 ? nil : group.food_products
          }
        }
    end

    # 割り当てられたステージを取得
    def stage
      return self.group_identification.stage_number.stage
    end

    # 割り当てられた会場を取得
    def place
      return self.group_identification.place_number.place
    end

    # 識別番号取得
    def number
      return self.group_identification.number
    end

end
