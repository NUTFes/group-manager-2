class Api::V1::CookingProcessOrdersApiController < ApplicationController

  def get_cooking_process_order_for_admin_view
    @groups = Group.with_cooking_process_order(params[:id])
    render json: fmt(ok, @groups)
  end

  # 絞り込み機能
  def get_refinement_cooking_process_orders
    fes_year_id = params[:fes_year_id].to_i
    # 両方ともALL
    if fes_year_id == 0
      @groups = Group.with_cooking_process_orders
      # fes_year_idだけ指定
    elsif fes_year_id != 0
      @groups = Group.with_cooking_process_order_narrow_down_by_fes_year(fes_year_id)
    end

    if @groups.count == 0
      render json: fmt(not_found, [], "Not found groups")
    else
      render json: fmt(ok, @groups)
    end
  end

  # あいまい検索機能
  def get_search_cooking_process_orders
    word = params[:word]
    @groups = Group.with_cooking_process_order_narrow_down_by_search_word(word)
    if @groups.count == 0
      render json: fmt(not_found, [], "Not found groups")
    else
      render json: fmt(ok, @groups)
    end
  end
end
