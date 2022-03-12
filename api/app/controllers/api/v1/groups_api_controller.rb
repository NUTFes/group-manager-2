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

  def get_groups_have_no_public_relation
    @current_fes_year = UserPageSetting.first.fes_year
    @groups = Group.have_no_public_relation(@current_fes_year.id)
    render json: fmt(ok, @groups)
  end

  # admin_pageのviewの形に整える
  def fit_group_index_for_admin_view(groups)
    groups.map{
      |group|
      {
        "group": group,
        "group_category": group.group_category,
        "fes_year": group.fes_year
      }
    }
  end

  #fes_yearによる絞り込み
  def get_groups_refinemented_by_current_fes_year
    @current_fes_year = UserPageSetting.first.fes_year
    @group = Group.where(fes_year_id: @current_fes_year.id)
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
      render json: fmt(ok, fit_group_index_for_admin_view(@groups))
    end
  end

  # あいまい検索機能
  def get_search_groups
    word = params[:word]
    @groups = Group.where("name like ?","%#{word}%")
    if @groups.count == 0
      render json: fmt(not_found, [], "Not found groups")
    else
      render json: fmt(ok, fit_group_index_for_admin_view(@groups))
    end
  end

end
