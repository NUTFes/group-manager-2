class Api::V1::OrderInfosApiController < ApplicationController

  def get_order_info_for_admin_view
    @groups = Group.with_order_info(params[:id])
    render json: fmt(ok, @groups)
  end

  # 絞り込み機能
  def get_refinement_order_infos
    fes_year_id = params[:fes_year_id].to_i
    # fes_yesrがALL
    if fes_year_id == 0
      @groups = Group.with_order_infos
      # fes_year_idが指定 
    elsif fes_year_id != 0
      @groups = Group.with_order_info_narrow_down_by_fes_year(fes_year_id)
    end

    if @groups.count == 0
      render json: fmt(not_found, [], "Not found groups")
    else 
      render json: fmt(ok, @groups)
    end
  end

  # あいまい検索機能
  def get_search_order_infos
    word = params[:word]
    @groups = Group.with_order_info_narrow_down_by_search_word(word)
    if @groups.count == 0
      render json: fmt(not_found, [], "Not found groups")
    else
      render json: fmt(ok, @groups)
    end
  end

end
