class Api::V1::StageOrdersApiController < ApplicationController

  def get_stage_order_index_for_admin_view
    @stage_orders = StageOrder.with_groups
    render json: fmt(ok, @stage_orders)
  end

  def get_stage_order_show_for_admin_view
    @stage_order = StageOrder.with_group(params[:id])
    render json: fmt(ok, @stage_order)
  end

  def fit_stage_order_index_for_admin_view(stage_orders)
    stage_orders.map{
      |stage_order|
      {
        "stage_order": stage_order,
        "stage_order_info": stage_order.to_info_h,
        "group": stage_order.group
      }
    }
  end

  #絞り込み機能
  def get_refinement_stage_orders
    fes_year_id = params[:fes_year_id].to_i
    days_num = params[:days_num].to_i
    stage_id = params[:stage_id].to_i
    is_sunny = params[:is_sunny].to_i
    # 晴れ希望 0: 指定なし(ALL) 1: はい 2: いいえ
    is_sunny_list = [nil, true, false]

    @stage_orders = StageOrder.all

    # fes_year_idで絞り込み
    if fes_year_id != 0
      @stage_orders = @stage_orders.joins(:group).where(groups: { fes_year_id: fes_year_id })
    end

    # days_numで絞り込み
    if days_num != 0
      @stage_orders = @stage_orders.joins(:fes_date).where(fes_dates: { days_num: days_num })
    end

    # stage_idで絞り込み
    if stage_id != 0
      @stage_orders = @stage_orders.where("(stage_first = ?) OR (stage_second = ?)", stage_id, stage_id)
    end

    # is_sunnyで絞り込み
    if is_sunny != 0
      @stage_orders = @stage_orders.where(is_sunny: is_sunny_list[is_sunny])
    end

    if @stage_orders.empty?
      render json: fmt(not_found, [], "Not found stage_orders")
    else
      render json: fmt(ok, fit_stage_order_index_for_admin_view(@stage_orders))
    end
  end


  #あいまい検索
  def get_search_stage_orders
    word = params[:word]
    @stage_orders = StageOrder.preload(:group).map{ |stage_order| stage_order if stage_order.group.name.include?(word) }.compact
    if @stage_orders.count == 0
      render json: fmt(not_found, [], "Not found stage_orders")
    else
      render json: fmt(ok, fit_stage_order_index_for_admin_view(@stage_orders))
    end
  end


end
