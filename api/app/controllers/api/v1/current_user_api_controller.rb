class Api::V1::CurrentUserApiController < ApplicationController
  # before_action :authenticate_api_user!
  
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
    #@user = User.find(1)
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
      sub_rep = group.sub_rep
      place_order = group.place_order
      first_place_order = Stage.find(group.place_order.first).name
      second_place_order = Stage.find(group.place_order.second).name
      third_place_order = Stage.find(group.place_order.third).name
      stage_date = group.stage_order.fes_date.date
      first_stage_order = Stage.find(group.stage_order.stage_first).name
      second_stage_order = Stage.find(group.stage_order.stage_second).name
      stage_order = group.stage_order
      power_orders = group.power_orders
      rental_orders = group.rental_orders
      rental_orders_list = []
      for rental_order in rental_orders
        rental_orders_list << {
          id: rental_order.id,
          rental_item_id: rental_order.rental_item_id,
          name: rental_order.rental_item.name,
          num: rental_order.num
        }
      end
      employees = group.employees
      food_products = group.food_products
      purchase_lists_all = []
      for food_product in food_products
        purchase_lists = food_product.purchase_lists
        for purchase_list in purchase_lists
          purchase_lists_all << {
            id: purchase_list.id,
            food_product: purchase_list.food_product.name,
            shop: purchase_list.shop.name,
            fes_date: purchase_list.fes_date,
            item: purchase_list.items,
            is_fresh: purchase_list.is_fresh,
          } 
        end
      end  
      regist_info << {
        group: group,
        group_category: group_category,
        sub_rep: sub_rep,
        place_order: place_order,
        first_place_order: first_place_order, 
        second_place_order: second_place_order,
        third_place_order: third_place_order,
        stage_date: stage_date,
        stage_order: stage_order,
        first_stage_order: first_stage_order,
        second_stage_order: second_stage_order,
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
