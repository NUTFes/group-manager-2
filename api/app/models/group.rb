# frozen_string_literal: true

class Group < ApplicationRecord
  ORDER_STATUS_CHECK_INCLUDES = [
    :user,
    :group_category,
    :fes_year,
    :sub_rep,
    :place_order,
    :stage_orders,
    :stage_common_option,
    :power_orders,
    :rental_orders,
    :employees,
    :public_relation,
    :venue_map,
    :announcement,
    :cooking_process_order,
    { food_products: :purchase_lists }
  ].freeze

  belongs_to :user
  belongs_to :fes_year
  belongs_to :group_category
  belongs_to :uses_place, class_name: 'StockerPlace', optional: true

  validates :uses_place, presence: true, if: -> { uses_place_id.present? }
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
  has_one :public_relation, dependent: :destroy
  has_one :venue_map, dependent: :destroy
  has_one :announcement, dependent: :destroy
  has_one :cooking_process_order, dependent: :destroy
  has_many :un_registered_groups, dependent: :destroy
  has_many :fire_equipment_orders, dependent: :destroy
  has_many :health_center_submission_statuses, dependent: :destroy

  scope :with_order_status_check_relations, -> { includes(*ORDER_STATUS_CHECK_INCLUDES) }

  ### group_category (参加団体カテゴリ)

  # 全てのgroupとそのgroup_categoryを取得する
  def self.with_group_categories
    @records = Group.preload(:group_category)
                    .map  do |group|
      {
        group: group,
        group_category: group.group_category
      }
    end
  end

  # 指定したIDのgroupとそのgroup_categoryを取得する
  def self.with_group_category(group_id)
    @record = Group.eager_load(:group_category).where(groups: { id: group_id })
                   .map  do |group|
      {
        group: group,
        group_category: group.group_category
      }
    end
  end

  ### group_category, fes_year (参加団体カテゴリ＋開催年)

  # 全てのgroupとそのgroup_categoryとfes_yearを取得する
  def self.with_group_categories_and_fes_years
    @records = Group.preload(:group_category, :fes_year)
                    .map  do |group|
      {
        group: group,
        group_category: group.group_category,
        fes_year: group.fes_year
      }
    end
  end

  # 全てのgroupとそれが持つorderを取得する
  def self.with_order_infos
    @record = Group.includes(
      :user, :group_category, :fes_year, :sub_rep, :place_order,
      :stage_orders, :stage_common_option, :power_orders, :rental_orders,
      :employees, { food_products: [:purchase_lists, :cooking_process_order] },
      :public_relation, :venue_map, :announcement, :cooking_process_order,
      :fire_equipment_orders
    ).all
                   .map  do |group|
      {
        group: group,
        user: group.user.nil? ? nil : group.user,
        group_category: group.group_category&.name,
        fes_year: group.fes_year&.year_num,
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
                             end,
                             cooking_process_order: food_product.cooking_process_order&.to_info_h
                           }
                         end
                       end,
        public_relation: group.public_relation&.to_info_h,
        venue_map: group.venue_map&.to_info_h,
        announcement: group.announcement&.to_info_h,
        cooking_process_order: group.cooking_process_order&.to_info_h,
        fire_equipment_orders: group.fire_equipment_orders.map { |o| { fire_equipment_order: o.to_info_h } }.presence
      }
    end
  end

  # 指定したIDのgroupとそれが持つorderを取得する
  def self.with_order_info(group_id)
    group = Group.includes(
      :user, :group_category, :fes_year, :sub_rep, :place_order,
      :stage_orders, :stage_common_option, :power_orders, :rental_orders,
      :employees, { food_products: [:purchase_lists, :cooking_process_order] },
      :public_relation, :venue_map, :announcement, :cooking_process_order,
      :fire_equipment_orders
    ).find(group_id)
    @record =
      {
        group: group,
        user: group.user.nil? ? nil : group.user,
        group_category: group.group_category&.name,
        fes_year: group.fes_year&.year_num,
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
                             end,
                             cooking_process_order: food_product.cooking_process_order&.to_info_h
                           }
                         end
                       end,
        public_relation: group.public_relation&.to_info_h,
        venue_map: group.venue_map&.to_info_h,
        announcement: group.announcement&.to_info_h,
        cooking_process_order: group.cooking_process_order&.to_info_h,
        fire_equipment_orders: group.fire_equipment_orders.map { |o| { fire_equipment_order: o.to_info_h } }.presence
      }
    return @record
  end

  # 指定したfes_yearに対応するgroupとそれが持つorderを取得する
  def self.with_order_info_narrow_down_by_fes_year(fes_year_id)
    @record = Group.includes(
      :user, :group_category, :fes_year, :sub_rep, :place_order,
      :stage_orders, :stage_common_option, :power_orders, :rental_orders,
      :employees, { food_products: [:purchase_lists, :cooking_process_order] },
      :public_relation, :venue_map, :announcement, :cooking_process_order,
      :fire_equipment_orders
    ).where(groups: { fes_year_id: fes_year_id })
                   .map do |group|
      {
        group: group,
        user: group.user.nil? ? nil : group.user,
        group_category: group.group_category&.name,
        fes_year: group.fes_year&.year_num,
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
                             end,
                             cooking_process_order: food_product.cooking_process_order&.to_info_h
                           }
                         end
                       end,
        public_relation: group.public_relation&.to_info_h,
        venue_map: group.venue_map&.to_info_h,
        announcement: group.announcement&.to_info_h,
        cooking_process_order: group.cooking_process_order&.to_info_h,
        fire_equipment_orders: group.fire_equipment_orders.map { |o| { fire_equipment_order: o.to_info_h } }.presence
      }
    end
  end

  # 検索ワードに対応するgroupとそれが持つorderを取得する
  def self.with_order_info_narrow_down_by_search_word(word)
    @record = Group.includes(
      :user, :group_category, :fes_year, :sub_rep, :place_order,
      :stage_orders, :stage_common_option, :power_orders, :rental_orders,
      :employees, { food_products: [:purchase_lists, :cooking_process_order] },
      :public_relation, :venue_map, :announcement, :cooking_process_order,
      :fire_equipment_orders
    ).where('name like ?', "%#{word}%")
                   .map do |group|
      {
        group: group,
        user: group.user.nil? ? nil : group.user,
        group_category: group.group_category&.name,
        fes_year: group.fes_year&.year_num,
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
                       end,
        public_relation: group.public_relation&.id,
        venue_map: group.venue_map&.id,
        announcement: group.announcement&.id,
        cooking_process_order: group.cooking_process_order&.id
      }
    end
  end

  # 指定したIDのgroupとそのgroup_categoryとfes_yearを取得する
  def self.with_group_category_and_fes_year(group_id)
    @record = Group.eager_load(:group_category).where(groups: { id: group_id })
                   .map  do |group|
      {
        group: group,
        group_category: group.group_category,
        fes_year: group.fes_year
      }
    end
  end

  ### 申請状況一覧

  def self.with_order_status_checks
    @record = Group.all
                   .map  do |group|
      {
        group: group,
        user: group.user&.id,
        group_category: group.group_category&.id,
        fes_year: group.fes_year&.id,
        sub_rep: group.sub_rep&.id,
        place_order: group.place_order&.id,
        stage_orders: group.stage_orders.none? ? nil : group.stage_orders[0].id,
        stage_common_option: group.stage_common_option&.id,
        power_orders: group.power_orders.none? ? nil : group.power_orders[0].id,
        rental_orders: group.rental_orders.none? ? nil : group.rental_orders[0].id,
        employees: group.employees.none? ? nil : group.employees[0].id,
        food_products: if group.food_products.empty?
                         nil
                       else
                         {
                           food_product: group.food_products.first&.id,
                           purchase_lists: group.food_products.first.nil? || group.food_products.first.purchase_lists.empty? ? nil : group.food_products.first.purchase_lists[0].id
                         }
                       end,
        public_relation: group.public_relation&.id,
        venue_map: group.venue_map&.id,
        announcement: group.announcement&.id,
        cooking_process_order: group.cooking_process_order&.id
      }
    end
  end

  def self.with_order_status_check(group_id)
    group = Group.find(group_id)
    @record =
      {
        group: group,
        user: group.user&.id,
        group_category: group.group_category&.id,
        fes_year: group.fes_year&.id,
        sub_rep: group.sub_rep&.id,
        place_order: group.place_order&.id,
        stage_orders: group.stage_orders.none? ? nil : group.stage_orders[0].id,
        stage_common_option: group.stage_common_option&.id,
        power_orders: group.power_orders.none? ? nil : group.power_orders[0].id,
        rental_orders: group.rental_orders.none? ? nil : group.rental_orders[0].id,
        employees: group.employees.none? ? nil : group.employees[0].id,
        food_products: if group.food_products.empty?
                         nil
                       else
                         {
                           food_product: group.food_products.first&.id,
                           purchase_lists: group.food_products.first.nil? || group.food_products.first.purchase_lists.empty? ? nil : group.food_products.first.purchase_lists[0].id
                         }
                       end,
        public_relation: group.public_relation&.id,
        venue_map: group.venue_map&.id,
        announcement: group.announcement&.id,
        cooking_process_order: group.cooking_process_order&.id
      }
    return @record
  end

  ### sub rep (副代表)

  # 全てのgroupとそのsub_repを取得する
  def self.with_sub_reps
    @records = Group.preload(:sub_rep)
                    .map  do |group|
      {
        group: group,
        sub_rep: group.sub_rep,
        sub_rep_info: group.sub_rep&.to_info_h
      }
    end
  end

  # 指定したIDのgroupとそのsub_repを取得する
  def self.with_sub_rep(group_id)
    @record = Group.eager_load(:sub_rep).where(groups: { id: group_id })
                   .map  do |group|
      {
        group: group,
        sub_rep: group.sub_rep,
        sub_rep_info: group.sub_rep&.to_info_h
      }
    end
  end

  ### place order (会場申請)

  # 全てのgroupとそのplace_orderを取得する
  def self.with_place_orders
    @records = Group.preload(:place_order)
                    .map  do |group|
      {
        group: group,
        place_order: group.place_order,
        place_order_name: group.place_order&.to_place_name_h
      }
    end
  end

  # 指定したIDのgroupとそのplace_orderを取得する
  def self.with_place_order(group_id)
    @record = Group.eager_load(:place_order)
                   .where(groups: { id: group_id })
                   .map do |group|
      {
        group: group,
        place_order: group.place_order,
        place_order_name: group.place_order&.to_place_name_h
      }
    end
  end

  ### stage order（ステージ申請）

  # 全てのgroupとそのstage_orderを取得する
  def self.with_stage_orders
    @records = Group.preload(:stage_orders)
                    .map  do |group|
      {
        group: group,
        stage_orders: if group.stage_orders.none?
                        nil
                      else
                        group.stage_orders.map do |stage_order|
                          {
                            stage_order: stage_order,
                            stage_order_info: stage_order&.to_info_h
                          }
                        end
                      end
      }
    end
  end

  # 指定したIDのgroupとそのstage_orderを取得する
  def self.with_stage_order(group_id)
    @record = Group.eager_load(:stage_orders)
                   .where(groups: { id: group_id })
                   .map do |group|
      {
        group: group,
        stage_orders: if group.stage_orders.none?
                        nil
                      else
                        group.stage_orders.map do |stage_order|
                          {
                            stage_order: stage_order,
                            stage_order_info: stage_order&.to_info_h
                          }
                        end
                      end
      }
    end
  end

  ### stage common option（ステージのオプション）

  # 全てのgroupとそのstage_common_optionを取得する
  def self.with_stage_common_options
    @records = Group.preload(:stage_common_option)
                    .map  do |group|
      {
        group: group,
        stage_common_option: group.stage_common_option
      }
    end
  end

  # 指定したIDのgroupとそのstage_common_optionを取得する
  def self.with_stage_common_option(group_id)
    @records = Group.eager_load(:stage_common_option)
                    .where(groups: { id: group_id })
                    .map  do |group|
      {
        group: group,
        stage_common_option: group.stage_common_option
      }
    end
  end

  ### power order（電力申請）

  # 全てのgroupとそのpower_orderを取得する
  def self.with_power_orders
    @records = Group.preload(:power_orders)
                    .map  do |group|
      {
        group: group,
        power_orders: group.power_orders.none? ? nil : group.power_orders
      }
    end
  end

  # 指定したIDのgroupとそのpower_orderを取得する
  def self.with_power_order(group_id)
    @record = Group.eager_load(:power_orders)
                   .where(groups: { id: group_id })
                   .map do |group|
      {
        group: group,
        power_orders: group.power_orders.none? ? nil : group.power_orders
      }
    end
  end

  ### rental order（物品申請）

  # 全てのgroupとそのrental_orderを取得する
  def self.with_rental_orders
    @records = Group.preload(:rental_orders)
                    .map  do |group|
      {
        group: group,
        rental_orders: if group.rental_orders.none?
                         nil
                       else
                         group.rental_orders.map do |rental_order|
                           {
                             rental_order: rental_order,
                             rental_item_name: rental_order.rental_item.name
                           }
                         end
                       end
      }
    end
  end

  # 指定したIDのgroupとそのrental_orderを取得する
  def self.with_rental_order(group_id)
    @record = Group.eager_load(:rental_orders)
                   .where(groups: { id: group_id })
                   .map do |group|
      {
        group: group,
        rental_orders: if group.rental_orders.none?
                         nil
                       else
                         group.rental_orders.map do |rental_order|
                           {
                             rental_order: rental_order,
                             rental_item_name: rental_order.rental_item.name
                           }
                         end
                       end
      }
    end
  end

  ### employee（従業員）

  # 全てのgroupとそのemployeeを取得する
  def self.with_employees
    @records = Group.preload(:employees)
                    .map  do |group|
      {
        group: group,
        employees: group.employees.none? ? nil : group.employees
      }
    end
  end

  # 指定したIDのgroupとそのemployeeを取得する
  def self.with_employee(group_id)
    @record = Group.eager_load(:employees)
                   .where(groups: { id: group_id })
                   .map do |group|
      {
        group: group,
        employees: group.employees.none? ? nil : group.employees
      }
    end
  end

  ### food_product（調理食品）

  # 全てのgroupとそのfood_productを取得する
  def self.with_food_products
    @records = Group.preload(:food_products)
                    .map  do |group|
      {
        group: group,
        food_products: group.food_products.none? ? nil : group.food_products
      }
    end
  end

  # 指定したIDのgroupとそのfood_productを取得する
  def self.with_food_product(group_id)
    @record = Group.eager_load(:food_products)
                   .where(groups: { id: group_id })
                   .map  do |group|
      {
        group: group,
        food_products: group.food_products.none? ? nil : group.food_products
      }
    end
  end

  ### public relation (PR画像・文)

  # 全てのgroupとそのpublic_relationを取得する
  def self.with_public_relations
    @records = Group.preload(:public_relation)
                    .map  do |group|
      {
        group: group,
        picture_name: group.public_relation&.picture_name,
        picture_path: group.public_relation&.picture_path,
        blurb: group.public_relation&.blurb,
        is_announcement_requested: group.public_relation&.is_announcement_requested,
        created_at: group.public_relation&.created_at,
        updated_at: group.public_relation&.updated_at
      }
    end
  end

  # 指定したIDのgroupとそのpublic_relationを取得する
  def self.with_public_relation(group_id)
    @record = Group.eager_load(:public_relation).where(groups: { id: group_id })
                   .map  do |group|
      {
        group: group,
        public_relation_id: group.public_relation&.id,
        picture_name: group.public_relation&.picture_name,
        picture_path: group.public_relation&.picture_path,
        blurb: group.public_relation&.blurb,
        is_announcement_requested: group.public_relation&.is_announcement_requested,
        created_at: group.public_relation&.created_at,
        updated_at: group.public_relation&.updated_at
      }
    end
  end

  # public_relationが存在しないgroupのみ取得する
  def self.have_no_public_relation(fes_year_id)
    @records = Group.eager_load(:public_relation).where(groups: { fes_year_id: fes_year_id }).select { |group| group.public_relation.nil? }
  end

  # 指定したfes_yearに対応するgroupとそのpublic_relationを取得する
  def self.with_public_relation_narrow_down_by_fes_year(fes_year_id)
    @record = Group.eager_load(:public_relation).where(groups: { fes_year_id: fes_year_id })
                   .map  do |group|
      {
        group: group,
        picture_name: group.public_relation&.picture_name,
        picture_path: group.public_relation&.picture_path,
        blurb: group.public_relation&.blurb,
        is_announcement_requested: group.public_relation&.is_announcement_requested,
        created_at: group.public_relation&.created_at,
        updated_at: group.public_relation&.updated_at
      }
    end
  end

  # 検索ワードに対応するgroupとそのpublic_relationを取得する
  def self.with_public_relation_narrow_down_by_search_word(word)
    @record = Group.eager_load(:public_relation).where('name like ?', "%#{word}%")
                   .map  do |group|
      {
        group: group,
        picture_name: group.public_relation&.picture_name,
        picture_path: group.public_relation&.picture_path,
        blurb: group.public_relation&.blurb,
        is_announcement_requested: group.public_relation&.is_announcement_requested,
        created_at: group.public_relation&.created_at,
        updated_at: group.public_relation&.updated_at
      }
    end
  end

  ### announcement (アナウンス文)

  # 全てのgroupとそのannouncementを取得する
  def self.with_announcements
    @records = Group.preload(:announcement)
                    .map  do |group|
      {
        group: group,
        announcement: group.announcement
      }
    end
  end

  # 指定したIDのgroupとそのannouncementを取得する
  def self.with_announcement(group_id)
    @record = Group.eager_load(:announcement).where(groups: { id: group_id })
                   .map  do |group|
      {
        group: group,
        announcement: group.announcement
      }
    end
  end

  # announcementが存在しないgroupのみ取得する
  def self.have_no_announcement(fes_year_id)
    @records = Group.eager_load(:announcement).where(groups: { fes_year_id: fes_year_id }).select { |group| group.announcement.nil? }
  end

  # 指定したfes_yearに対応するgroupとそのannouncementを取得する
  def self.with_announcement_narrow_down_by_fes_year(fes_year_id)
    @record = Group.eager_load(:announcement).where(groups: { fes_year_id: fes_year_id })
                   .map  do |group|
      {
        group: group,
        announcement: group.announcement
      }
    end
  end

  # 検索ワードに対応するgroupとそのannouncementを取得する
  def self.with_announcement_narrow_down_by_search_word(word)
    @record = Group.eager_load(:announcement).where('name like ?', "%#{word}%")
                   .map  do |group|
      {
        group: group,
        announcement: group.announcement
      }
    end
  end

  ### venue map (模擬店平面図)

  # 全てのgroupとそのvenue_mapを取得する
  def self.with_venue_maps
    @records = Group.preload(:venue_map)
                    .map  do |group|
      {
        group: group,
        venue_map: group.venue_map
      }
    end
  end

  # 指定したIDのgroupとそのvenue_mapを取得する
  def self.with_venue_map(group_id)
    @record = Group.eager_load(:venue_map).where(groups: { id: group_id })
                   .map  do |group|
      {
        group: group,
        venue_map: group.venue_map
      }
    end
  end

  # venue_mapが存在しないgroupのみ取得する
  def self.have_no_venue_map(fes_year_id)
    @records = Group.eager_load(:venue_map).where(groups: { fes_year_id: fes_year_id }).select { |group| group.venue_map.nil? }
  end

  # 指定したfes_yearに対応するgroupとそのvenue_mapを取得する
  def self.with_venue_map_narrow_down_by_fes_year(fes_year_id)
    @record = Group.eager_load(:venue_map).where(groups: { fes_year_id: fes_year_id })
                   .map  do |group|
      {
        group: group,
        venue_map: group.venue_map
      }
    end
  end

  # 検索ワードに対応するgroupとそのvenue_mapを取得する
  def self.with_venue_map_narrow_down_by_search_word(word)
    @record = Group.eager_load(:venue_map).where('name like ?', "%#{word}%")
                   .map  do |group|
      {
        group: group,
        venue_map: group.venue_map
      }
    end
  end

  # 割り当てられたステージを取得
  def stage
    return group_identification.nil? || group_identification.stage_number.nil? ? nil : group_identification.stage_number.stage.name
  end

  # 割り当てられた会場を取得
  def place
    return group_identification.nil? || group_identification.place_number.nil? ? nil : group_identification.place_number.place.name
  end

  # 識別番号取得
  def number
    return group_identification&.number
  end

  # 開催日取得
  def date
    return group_identification&.date
  end

  # 電力申請の総和を計算する
  def sum_power_orders
    sum = 0
    power_orders.each do |power_order|
      sum += power_order.power
    end
    return sum
  end

  # 購入品の個数を計算する
  def count_purchase_lists
    count = 0
    food_products.each do |food_product|
      count += food_product.purchase_lists.count
    end
    return count
  end

  # 物品の未配分を計算する
  def unallocated_rental_items
    unallocated_rental_items = rental_orders.preload(:rental_item).map do |rental_order|
      {
        item: rental_order.rental_item.name,
        num: rental_order.num - assign_rental_items.sum(&:num)
      }
    end
    return unallocated_rental_items
  end

  def is_food_sales
    # 食品販売グループかどうかを判定するメソッド
    return group_category_id == 1
  end
end
