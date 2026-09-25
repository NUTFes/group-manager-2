# frozen_string_literal: true

class Api::V1::PublicRelationsApiController < Api::V1::StaffController
  def get_public_relation_for_admin_view
    @groups = Group.with_public_relation(params[:id])
    render json: fmt(ok, @groups)
  end

  # admin_viewのpublic_relation/indexの形に整える
  def fit_group_index_for_admin_view(groups)
    groups.map do |group|
      {
        group: group,
        group_category: group.group_category,
        fes_year: group.fes_year
      }
    end
  end

  # 絞り込み機能
  def get_refinement_public_relations
    fes_year_id = params[:fes_year_id].to_i
    # 両方ともALL
    if fes_year_id == 0
      @groups = Group.with_public_relations
      # fes_year_idだけ指定
    elsif fes_year_id != 0
      @groups = Group.with_public_relation_narrow_down_by_fes_year(fes_year_id)
    end

    if @groups.none?
      render json: fmt(not_found, [], 'Not found groups')
    else
      render json: fmt(ok, @groups)
    end
  end

  # あいまい検索機能
  def get_search_public_relations
    word = params[:word]
    @groups = Group.with_public_relation_narrow_down_by_search_word(word)
    if @groups.none?
      render json: fmt(not_found, [], 'Not found groups')
    else
      render json: fmt(ok, @groups)
    end
  end

  # admin_view: staff/managerが任意団体のPR文・画像を作成・編集・削除するためのエンドポイント
  # (共有の PublicRelationsController は current_api_user.groups にスコープされるため専用に用意する)
  def create_public_relation_for_admin_view
    @public_relation = PublicRelation.new(public_relation_params)
    if @public_relation.save
      render json: fmt(created, @public_relation)
    else
      render_validation_errors(@public_relation)
    end
  end

  def update_public_relation_for_admin_view
    @public_relation = PublicRelation.find_by(id: params[:id])
    return render json: fmt(not_found, [], 'Not Found'), status: :not_found unless @public_relation

    old_picture_path = @public_relation.picture_path
    old_imgur_deletehash = @public_relation.imgur_deletehash

    unless @public_relation.update(public_relation_params)
      render_validation_errors(@public_relation)
      return
    end

    ImgurImageDeleter.call_if_replaced(old_picture_path, old_imgur_deletehash, @public_relation.picture_path)
    render json: fmt(ok, @public_relation, "Updated public_relation id = #{params[:id]}")
  end

  def delete_public_relation_for_admin_view
    @public_relation = PublicRelation.find_by(id: params[:id])
    return render json: fmt(not_found, [], 'Not Found'), status: :not_found unless @public_relation

    imgur_deletehash = @public_relation.imgur_deletehash
    @public_relation.destroy
    ImgurImageDeleter.call(imgur_deletehash) if @public_relation.destroyed?

    render json: fmt(ok, [], "Deleted public_relation = #{params[:id]}")
  end

  private

  def public_relation_params
    params.permit(
      :group_id,
      :picture_name,
      :picture_path,
      :imgur_deletehash,
      :blurb,
      :is_announcement_requested
    )
  end
end
