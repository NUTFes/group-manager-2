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
    has_one :public_relation
    has_one :venue_map
    has_one :announcement

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


    ### group_category, fes_year (参加団体カテゴリ＋開催年)

    # 全てのgroupとそのgroup_categoryとfes_yearを取得する
    def self.with_group_categories_and_fes_years
      @records = Group.preload(:group_category, :fes_year)
        .map{
          |group|
          {
            "group": group,
            "group_category": group.group_category,
            "fes_year": group.fes_year
          }
        }
    end

    ### order_info (申請情報)

    # 全てのgroupとそれが持つorderを取得する
    def self.with_order_infos
      @record = Group.all
        .map{
          |group|
          {
            "group": group,
            "user": group.user.nil? ? nil: group.user,
            "group_category": group.group_category.nil? ? nil : group.group_category.name,
            "fes_year": group.fes_year.nil? ? nil : group.fes_year.year_num,
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
    end


    # 指定したIDのgroupとそれが持つorderを取得する
    def self.with_order_info(group_id)
      group = Group.find(group_id)
      @record =
        {
          "group": group,
          "user": group.user.nil? ? nil: group.user,
          "group_category": group.group_category.nil? ? nil : group.group_category.name,
          "fes_year": group.fes_year.nil? ? nil : group.fes_year.year_num,
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
      return @record
    end

    # 指定したfes_yearに対応するgroupとそれが持つorderを取得する
    def self.with_order_info_narrow_down_by_fes_year(fes_year_id)
      @record = Group.where(groups: {fes_year_id: fes_year_id})
        .map{
          |group|
          {
            "group": group,
            "user": group.user.nil? ? nil: group.user,
            "group_category": group.group_category.nil? ? nil : group.group_category.name,
            "fes_year": group.fes_year.nil? ? nil : group.fes_year.year_num,
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
    end

    # 検索ワードに対応するgroupとそれが持つorderを取得する
    def self.with_order_info_narrow_down_by_search_word(word)
      @record = Group.where("name like ?","%#{word}%")
        .map{
          |group|
          {

            "group": group,
            "user": group.user.nil? ? nil: group.user,
            "group_category": group.group_category.nil? ? nil : group.group_category.name,
            "fes_year": group.fes_year.nil? ? nil : group.fes_year.year_num,
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
    end

    # 指定したIDのgroupとそのgroup_categoryとfes_yearを取得する
    def self.with_group_category_and_fes_year(group_id)
      @record = Group.eager_load(:group_category).where(groups: {id: group_id})
        .map{
          |group|
          {
            "group": group,
            "group_category": group.group_category,
            "fes_year": group.fes_year
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

    ### public relation (PR画像・文)

    # 全てのgroupとそのpublic_relationを取得する
    def self.with_public_relations
      @records = Group.preload(:public_relation)
        .map{
          |group|
          {
            "group": group,
            "picture_name": group.public_relation.nil? ? nil : group.public_relation.picture_name,
            "picture_path": group.public_relation.nil? ? nil : group.public_relation.picture_path,
            "blurb": group.public_relation.nil? ? nil : group.public_relation.blurb,
            "created_at": group.public_relation.nil? ? nil : group.public_relation.created_at,
            "updated_at": group.public_relation.nil? ? nil : group.public_relation.updated_at,
          }
        }
    end

    # 指定したIDのgroupとそのpublic_relationを取得する
    def self.with_public_relation(group_id)
      @record = Group.eager_load(:public_relation).where(groups: {id: group_id})
        .map{
          |group|
          {
            "group": group,
            "picture_name": group.public_relation.nil? ? nil : group.public_relation.picture_name,
            "picture_path": group.public_relation.nil? ? nil : group.public_relation.picture_path,
            "blurb": group.public_relation.nil? ? nil : group.public_relation.blurb,
            "created_at": group.public_relation.nil? ? nil : group.public_relation.created_at,
            "updated_at": group.public_relation.nil? ? nil : group.public_relation.updated_at,
          }
        }
    end

    # public_relationが存在しないgroupのみ取得する
    def self.have_no_public_relation(fes_year_id)
      @records = Group.eager_load(:public_relation).where(groups: {fes_year_id: fes_year_id}).filter_map { |group| group if group.public_relation.nil? }
    end

    # 指定したfes_yearに対応するgroupとそのpublic_relationを取得する
    def self.with_public_relation_narrow_down_by_fes_year(fes_year_id)
      @record = Group.eager_load(:public_relation).where(groups: {fes_year_id: fes_year_id})
        .map{
          |group|
          {
            "group": group,
            "picture_name": group.public_relation.nil? ? nil : group.public_relation.picture_name,
            "picture_path": group.public_relation.nil? ? nil : group.public_relation.picture_path,
            "blurb": group.public_relation.nil? ? nil : group.public_relation.blurb,
            "created_at": group.public_relation.nil? ? nil : group.public_relation.created_at,
            "updated_at": group.public_relation.nil? ? nil : group.public_relation.updated_at,
          }
        }
    end

    # 検索ワードに対応するgroupとそのpublic_relationを取得する
    def self.with_public_relation_narrow_down_by_search_word(word)
      @record = Group.eager_load(:public_relation).where("name like ?","%#{word}%")
        .map{
          |group|
          {
            "group": group,
            "picture_name": group.public_relation.nil? ? nil : group.public_relation.picture_name,
            "picture_path": group.public_relation.nil? ? nil : group.public_relation.picture_path,
            "blurb": group.public_relation.nil? ? nil : group.public_relation.blurb,
            "created_at": group.public_relation.nil? ? nil : group.public_relation.created_at,
            "updated_at": group.public_relation.nil? ? nil : group.public_relation.updated_at,
          }
        }
    end

    # 割り当てられたステージを取得
    def stage
      return self.group_identification.nil? || self.group_identification.stage_number.nil? ? nil : self.group_identification.stage_number.stage.name
    end

    # 割り当てられた会場を取得
    def place
      return self.group_identification.nil? || self.group_identification.place_number.nil? ? nil : self.group_identification.place_number.place.name
    end

    # 識別番号取得
    def number
      return self.group_identification.nil? ? nil : self.group_identification.number
    end

    # 開催日取得
    def date
      return self.group_identification.nil? ? nil : self.group_identification.date
    end

    # 電力申請の総和を計算する
    def sum_power_orders
      sum = 0
      self.power_orders.each do |power_order|
        sum += power_order.power
      end
      return sum
    end

    # 購入食品の個数を計算する
    def count_purchase_lists
      count = 0
      self.food_products.each do |food_product|
        count += food_product.purchase_lists.count
      end
      return count
    end

    # 物品の未配分を計算する
    def unallocated_rental_items
      unallocated_rental_items = self.rental_orders.preload(:rental_item).map{
        |rental_order|
        {
          "item": rental_order.rental_item.name,
          "num": rental_order.num - self.assign_rental_items.map{ |assign_rental_item| assign_rental_item.num }.sum
        }
      }
      return unallocated_rental_items
    end

end
