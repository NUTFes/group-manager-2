class Api::V1::GroupsApiController < ApplicationController

  def get_group_index_for_admin_view
    @groups = Group.with_group_categories_and_fes_years
    render json: fmt(ok, @groups)
  end

  def get_group_for_admin_view
    @groups = Group.with_group_category_and_fes_year(params[:id])
    render json: fmt(ok, @groups)
  end

  def get_group_show_for_admin_view
    @groups = Group.with_order_info(params[:id])
    render json: fmt(ok, @groups)
  end

  def get_group_with_categories
    @groups = Group.with_group_categories
    render json: fmt(ok, @groups)
  end

  def get_group_with_category
    @group = Group.with_group_category(params[:id])
    render json: fmt(ok, @group)
  end

  def get_group_with_sub_reps
    @groups = Group.with_sub_reps
    render json: fmt(ok, @groups)
  end

  def get_group_with_sub_rep
    @group = Group.with_sub_rep(params[:id])
    render json: fmt(ok, @group)
  end

  def get_group_with_place_orders
    @groups = Group.with_place_orders
    render json: fmt(ok, @groups)
  end

  def get_group_with_place_order
    @group = Group.with_place_order(params[:id])
    render json: fmt(ok, @group)
  end

  def get_group_with_stage_orders
    @groups = Group.with_stage_orders
    render json: fmt(ok, @groups)
  end

  def get_group_with_stage_order
    @group = Group.with_stage_order(params[:id])
    render json: fmt(ok, @group)
  end

  def get_group_with_stage_common_options
    @groups = Group.with_stage_common_options
    render json: fmt(ok, @groups)
  end

  def get_group_with_stage_common_option
    @group = Group.with_stage_common_option(params[:id])
    render json: fmt(ok, @group)
  end

  def get_group_with_power_orders
    @groups = Group.with_power_orders
    render json: fmt(ok, @groups)
  end

  def get_group_with_power_order
    @group = Group.with_power_order(params[:id])
    render json: fmt(ok, @group)
  end

  def get_group_with_rental_orders
    @groups = Group.with_rental_orders
    render json: fmt(ok, @groups)
  end

  def get_group_with_rental_order
    @group = Group.with_rental_order(params[:id])
    render json: fmt(ok, @group)
  end

  def get_group_with_employees
    @groups = Group.with_employees
    render json: fmt(ok, @groups)
  end

  def get_group_with_employee
    @group = Group.with_employee(params[:id])
    render json: fmt(ok, @group)
  end

  def get_group_with_food_products
    @groups = Group.with_food_products
    render json: fmt(ok, @groups)
  end

  def get_group_with_food_product
    @group = Group.with_food_product(params[:id])
    render json: fmt(ok, @group)
  end

  # 絞り込み機能
  def get_refinement_groups
    fes_year_id = params[:fes_year_id].to_i
    group_category_id = params[:group_category_id].to_i
    # 両方ともALL
    if fes_year_id == 0 && group_category_id == 0
      @groups = Group.all
      # fes_year_idだけ指定 
    elsif fes_year_id != 0 && group_category_id == 0
      @groups = Group.where(fes_year_id: fes_year_id)
      # group_category_idだけ指定 
    elsif fes_year_id == 0 && group_category_id != 0
      @groups = Group.where(group_category_id: group_category_id)
      # 両方とも指定
    else
      @groups = Group.where(fes_year_id: fes_year_id).where(group_category_id: group_category_id)
    end

    if @groups.count == 0
      render json: fmt(not_found, [], "Not found groups")
    else 
      render json: fmt(ok, @groups)
    end
  end

  # あいまい検索機能
  def get_search_groups
    word = params[:word]
    @groups = Group.where("name like ?","%#{word}%")
    if @groups.count == 0
      render json: fmt(not_found, [], "Not found groups")
    else
      render json: fmt(ok, @groups)
    end
  end

  def get_group_name
    # 参加団体の名前を取得する
    groups = Group.all
    group_list = []
    for group in groups
      group_list << {
        id: group.id,
        name: group.name
      }
    end
    render json: group_list
  end

  def get_group_from_project_name
    # 企画名から参加団体の情報を取得する
    group = Group.find(params[:id])
    user = group.user.name
    group_category = group.group_category.name
    fes_year = group.fes_year.year_num
    group_details = {
      group: group,
      user: user,
      group_category: group_category,
      fes_year: fes_year
    }
    render json: group_details
  end

  def get_groups
    groups = Group.all
    group_list = []
    for group in groups
      fes_year = group.fes_year.year_num
      group_list << {
        group: group,
        fes_year: fes_year
      }
    end
    render json: group_list
  end

  def get_group
    group = Group.find(params[:id])
    user = group.user.name
    fes_year = group.fes_year.year_num
    if group.group_category.id == 3
      place_first = '未登録'
      place_second = '未登録'
      place_third = '未登録'
    else
      place_first = Place.find(group.place_order.first).name
      place_second = Place.find(group.place_order.second).name
      place_third = Place.find(group.place_order.third).name
    end
    stage_orders_lists = []
    for stage_order in group.stage_orders
      is_sunny = stage_order.is_sunny
      stage_first = Stage.find(stage_order.stage_first).name
      stage_second = Stage.find(stage_order.stage_second).name
      fes_date = FesDate.find(stage_order.fes_date_id).date
      stage_orders_lists << {
        is_sunny: is_sunny,
        stage_first: stage_first,
        stage_second: stage_second,
        fes_date: fes_date,
      }
    end
    # if group.stage_orders == nil
    #   stage_first = '未登録'
    #   stage_second = '未登録'
    #   fes_date = '未登録'
    # else
    #   stage_first = Stage.find(group.stage_order.stage_first).name
    #   stage_second = Stage.find(group.stage_order.stage_second).name
    #   fes_date = FesDate.find(group.stage_order.fes_date_id).date
    # end
    rental_order_lists = []
    for rental_order in group.rental_orders
      rental_id = rental_order.rental_item.id
      rental_item = rental_order.rental_item.name
      rental_num = rental_order.num
      rental_order_lists << {
        rental_id: rental_id,
        rental_item: rental_item,
        rental_num: rental_num
      }
    end
    purchase_list = []
    for food_product in group.food_products
      purchase_lists = food_product.purchase_lists
      purchase_list << {
        purchase_lists: purchase_lists
      }
    end
    group_list = []
    group_list = {
      group: group,
      user: user,
      fes_year: fes_year,
      place_first: place_first,
      place_second: place_second,
      place_third: place_third,
      stage_orders_lists: stage_orders_lists,
      purchase_list: purchase_list,
      rental_order_lists: rental_order_lists,
    }
    render json: group_list
  end

  def get_group_detail
    group = Group.find(params[:id])
    sub_rep = group.sub_rep
    employees = group.employees
    stage_common_option = group.stage_common_option
    power_orders = group.power_orders
    place_order = group.place_order
    stage_orders = group.stage_orders
    food_products = group.food_products
    group_details = []
    group_details = {
      group: group,
      sub_rep: sub_rep,
      employees: employees,
      stage_common_option: stage_common_option,
      power_orders: power_orders,
      place_order: place_order,
      stage_orders: stage_orders,
      food_products: food_products,
    }
    render json: group_details 
  end

end
