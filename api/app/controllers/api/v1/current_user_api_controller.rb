class Api::V1::CurrentUserApiController < ApplicationController
  #  before_action :authenticate_api_user!
  
  def show
    @user = current_api_user
    render json: { data: @user }
  end

  def get_user_detail
    @user = current_api_user
    @role = @user.role.name
    @grade = @user.user_detail.grade.name
    @department = @user.user_detail.department.name
    user_detail = {
      user: @user,
      role: @role,
      grade: @grade,
      department: @department,
      
    }
    render json: user_detail
  end

  def get_groups
    @user = current_api_user
    @groups = @user.groups
    render json: @groups
  end

  def get_groups_place_allow_list
    @user = current_api_user
    @groups = @user.groups
    data = []
    set  = []
    for i in @groups
      @category  = i.group_category.name
      @place_list = i.group_category.place_allow_lists
      set_place = []
      for j in @place_list
        if j.enable == true then
          @place = j.place.name
          set_place << { place_id: j.place.id, place: @place}
        end
      end

      set = {
        group_id: i.id,
        category: @category,
        place_list: set_place
      }
      data << set
    end
    render json: data
  end

  def get_regist_info
    @user = current_api_user
    @groups = @user.groups
    regist_info = []
    for group in @groups
      group_category = group.group_category.name
      # 副代表情報を取得
      if !group.sub_rep.nil?
        sub_rep = group.sub_rep
      else
        sub_rep = {
          name: "-9999",
          grade_id: "-9999",
          student_id: "-9999",
        }
      end
      # 会場申請情報を取得
      if !group.place_order.nil?
        place_order = group.place_order
        first_place_order = Stage.find(group.place_order.first).name
        second_place_order = Stage.find(group.place_order.second).name
        third_place_order = Stage.find(group.place_order.third).name
      else
        first_place_order = "-9999"
        second_place_order = "-9999"
        third_place_order = "-9999"
      end
      # ステージ情報を取得
      if !group.stage_order.nil?
        stage_date = group.stage_order.fes_date.date
        first_stage_order = Stage&.find_by_id(group.stage_order&.stage_first)&.name
        second_stage_order = Stage&.find_by_id(group.stage_order&.stage_second)&.name
        stage_order = group.stage_order
      else
        first_stage_order = "-9999"
        second_stage_order = "-9999"
        stage_date = "-9999"
        stage_order = [] 
        stage_order = {
          use_time_interval: "-9999",
          prepare_time_interval: "-9999",
          cleanup_time_interval: "-9999",
          prepare_start_time: "-9999",
          performance_start_time: "-9999",
          performance_end_time: "-9999",
          cleanup_end_time: "-9999",
        }
      end
      # 電力申請情報を取得
      if !group.power_orders.nil?
        power_orders = group.power_orders
      else
        power_order = []
        power_order = {
          item: "-9999",
          power: "-9999",
          manufacturer: "-9999",
          model: "-9999",
          item_url: "-9999",
        }
        power_orders = [] 
        power_orders << {
          power_order: power_order,
        }
      end
      # 物品申請情報を取得
      if !group.rental_orders.nil?
        rental_orders = group.rental_orders
        for rental_order in rental_orders
          rental_orders_list = []
          rental_orders_list << {
            id: rental_order.id,
            rental_item_id: rental_order.rental_item_id,
            name: rental_order.rental_item.name,
            num: rental_order.num,
          }
        end
      else
        rental_orders_list = []
        rental_orders_list << {
          id: "-9999",
          rental_item_id: "-9999",
          name: "-9999",
          num: "-9999",
        }
      end
      # 従業員リストを取得
      if group.employees.length != 0
        employees = group.employees
      else
        employees = []
        employees << {
          name: "-9999",
          student_id: "-9999",
        } 
      end
      # 販売食品情報を取得
      if group.food_products.length != 0
        food_products = group.food_products
        purchase_lists_all = []
        # 販売食品ごとの購入品情報のリストを取得
        for food_product in food_products
          purchase_lists = food_product.purchase_lists
          if purchase_lists.length != 0
            # 購入品情報を取得
            for purchase_list in purchase_lists
              purchase_lists_all << {
                id: purchase_list.id,
                food_product: purchase_list.food_product.name,
                shop: purchase_list.shop.name,
                fes_date: purchase_list.fes_date.date,
                item: purchase_list.items,
                is_fresh: purchase_list.is_fresh,
              } 
            end
          # 販売食品情報はあるが，購入品情報が無い場合，欠損値のフラグを代入
          else
            purchase_lists_all << {
              id: "-9999",
              food_product: "-9999",
              shop: "-9999",
              fes_date: "-9999",
              item: "-9999",
              is_fresh: "-9999",
            }
          end
        end
      # 販売食品が無い場合，販売食品と購入品に欠損値のフラグを代入
      else
        food_products = []
        food_products << {
          name: "-9999",
          first_day_num: "-9999",
          second_day_num: "-9999",
          is_cooking: "-9999",
        }
        purchase_lists_all = []
        purchase_lists_all << {
          id: "-9999",
          food_product: "-9999",
          shop: "-9999",
          fes_date: "-9999",
          item: "-9999",
          is_fresh: "-9999",
        }
      end
      regist_info << {
        group: group,
        group_category: group_category, # 団体のIDからカテゴリー名を復号
        sub_rep: sub_rep,
        place_order: place_order,
        first_place_order: first_place_order,# 第一希望のIDからステージ名を復号
        second_place_order: second_place_order, # 第二希望ステージのIDからステージ名を復号
        third_place_order: third_place_order, # 第三希望ステージのIDからステージ名を復号
        stage_order: stage_order,
        first_stage_order: first_stage_order, # 第一希望ステージのIDからステージ名を復号
        second_stage_order: second_stage_order, # 第二希望ステージのIDからステージ名を復号
        stage_date: stage_date, # 日付のIDから日付を復号
        power_orders: power_orders,
        rental_orders: rental_orders_list,
        employees: employees,
        food_products: food_products,
        purchase_lists: purchase_lists_all
      }
    end
    render json: regist_info
  end

end
