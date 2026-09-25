# frozen_string_literal: true

class Api::V1::StageCommonOptionsApiController < Api::V1::StaffController
  def get_stage_common_option_index_for_admin_view
    @stage_common_options = StageCommonOption.with_groups
    render json: fmt(ok, @stage_common_options)
  end

  def get_stage_common_option_show_for_admin_view
    @stage_common_option = StageCommonOption.with_group(params[:id])
    render json: fmt(ok, @stage_common_option)
  end

  # admin_pageのviewの形に整える
  def fit_stage_common_option_index_for_admin_view(stage_common_options)
    stage_common_options.map do |stage_common_option|
      {
        stage_common_option: stage_common_option,
        group: stage_common_option.group.nil? ? nil : stage_common_option.group
      }
    end
  end

  # 絞り込み機能
  def get_refinement_stage_common_options
    fes_year_id = params[:fes_year_id].to_i
    own_equipment = params[:own_equipment].to_i
    bgm = params[:bgm].to_i
    camera_permission = params[:camera_permission].to_i
    loud_sound = params[:loud_sound].to_i

    # 0: 指定なし(ALL) 1: true 2:false
    option_list = [nil, true, false]
    @stage_common_options = StageCommonOption.all

    # own_equipment,  bgm, camera_permission, loud_soundで絞り込み
    @stage_common_options = @stage_common_options.where('(own_equipment = ?)', option_list[own_equipment]) if own_equipment != 0
    @stage_common_options = @stage_common_options.where('(bgm = ?)', option_list[bgm]) if bgm != 0
    @stage_common_options = @stage_common_options.where('(camera_permission = ?)', option_list[camera_permission]) if camera_permission != 0
    @stage_common_options = @stage_common_options.where('(loud_sound = ?)', option_list[loud_sound]) if loud_sound != 0
    @stage_common_options = @stage_common_options.preload(:group).select { |stage_common_option| stage_common_option.group.fes_year_id == fes_year_id } if fes_year_id != 0

    if @stage_common_options.none?
      render json: fmt(not_found, [], 'Not found stage_common_options')
    else
      render json: fmt(ok, fit_stage_common_option_index_for_admin_view(@stage_common_options))
    end
  end

  # あいまい検索
  def get_search_stage_common_options
    word = params[:word]
    @stage_common_options = StageCommonOption.preload(:group).select { |stage_common_option| stage_common_option.group.name.include?(word) }
    if @stage_common_options.none?
      render json: fmt(not_found, [], 'Not found stage_common_options')
    else
      render json: fmt(ok, fit_stage_common_option_index_for_admin_view(@stage_common_options))
    end
  end

  # admin_view: staff/managerが任意団体のステージオプション申請を作成・編集・削除するためのエンドポイント
  # (共有の StageCommonOptionsController は current_api_user.groups にスコープされるため専用に用意する)
  def create_stage_common_option_for_admin_view
    @stage_common_option = StageCommonOption.new(stage_common_option_params)
    if @stage_common_option.save
      render json: fmt(created, @stage_common_option)
    else
      render_validation_errors(@stage_common_option)
    end
  end

  def update_stage_common_option_for_admin_view
    @stage_common_option = StageCommonOption.find_by(id: params[:id])
    return render json: fmt(not_found, [], 'Not Found'), status: :not_found unless @stage_common_option

    if @stage_common_option.update(stage_common_option_params)
      render json: fmt(ok, @stage_common_option, "Updated stage_common_option id = #{params[:id]}")
    else
      render_validation_errors(@stage_common_option)
    end
  end

  def delete_stage_common_option_for_admin_view
    @stage_common_option = StageCommonOption.find_by(id: params[:id])
    return render json: fmt(not_found, [], 'Not Found'), status: :not_found unless @stage_common_option

    @stage_common_option.destroy
    render json: fmt(ok, [], "Deleted stage_common_option = #{params[:id]}")
  end

  private

  def stage_common_option_params
    params.permit(:group_id, :own_equipment, :bgm, :camera_permission, :loud_sound)
  end
end
