class Api::V1::RepresentativesApiController < ApplicationController

  # sub_repがない場合はnilが入ったsub_repみたいなのを返す
  @@no_sub_rep = {
      id: nil,
      name: nil,
      department_id: nil,
      grade_id: nil,
      tel: nil,
      email: nil,
      created_at: nil,
      updated_at: nil,
      student_id: nil
    }

  def fit_representatives_index_for_admin_view(groups)
    groups.map{
      |group|
      {
        "user": group.user,
        "group": group,
        "sub_rep": group.sub_rep.nil? ? @@no_sub_rep : group.sub_rep
      }
    }
  end

  # 絞り込み機能
  def get_refinement_represantatives
    fes_year_id = params[:fes_year_id].to_i
    # 指定なし
    if fes_year_id == 0
      @groups = Group.all
      #fes_year_id指定
    else
      @groups = Group.where(fes_year_id: fes_year_id)
    end

    if @groups.count == 0
      render json: fmt(not_found, [], "Not found representatives")
    else 
      render json: fmt(ok, fit_representatives_index_for_admin_view(@groups))
    end
  end

  # あいまい検索の対象かどうか
  def is_search_condition(group, word)
    # 副代表が存在しない場合
    if group.sub_rep.nil?
      return group.name.include?(word) || group.user.name.include?(word)
    # 副代表が存在する場合
    else
      return group.name.include?(word) || group.user.name.include?(word) || group.sub_rep.name.include?(word)
    end
  end

  # あいまい検索機能
  def get_search_representatives
    word = params[:word]
    @groups = Group.all.map{ |group| group if is_search_condition(group, word) }.compact
    if @groups.count == 0
      render json: fmt(not_found, [], "Not found representatives")
    else
      render json: fmt(ok, fit_representatives_index_for_admin_view(@groups))
    end
  end
end
