class Api::V1::StageCommonOptionsApiController < ApplicationController

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
    stage_common_options.map{
      |stage_common_option|
      {
        "stage_common_option": stage_common_option,
        "group": stage_common_option.group.nil? ? nil : stage_common_option.group,
      }
    }
  end

  #絞り込み機能
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
    if own_equipment != 0
      @stage_common_options = @stage_common_options.where("(own_equipment = ?)", option_list[own_equipment])
    end
    if bgm != 0
      @stage_common_options = @stage_common_options.where("(bgm = ?)", option_list[bgm])
    end
    if camera_permission != 0
      @stage_common_options = @stage_common_options.where("(camera_permission = ?)", option_list[camera_permission])
    end
    if loud_sound != 0
      @stage_common_options = @stage_common_options.where("(loud_sound = ?)", option_list[loud_sound])
    end
    if fes_year_id != 0
      @stage_common_options = @stage_common_options.preload(:group).map{ |stage_common_option| stage_common_option if stage_common_option.group.fes_year_id == fes_year_id }.compact
    end

    if @stage_common_options.count == 0
        render json: fmt(not_found, [], "Not found stage_common_options")
    else
        render json: fmt(ok, fit_stage_common_option_index_for_admin_view(@stage_common_options))
    end
  end

  #あいまい検索
  def get_search_stage_common_options
    word = params[:word]
    @stage_common_options = StageCommonOption.preload(:group).map{ |stage_common_option| stage_common_option if stage_common_option.group.name.include?(word) }.compact
    if @stage_common_options.count == 0
      render json: fmt(not_found, [], "Not found stage_common_options")
    else
      render json: fmt(ok, fit_stage_common_option_index_for_admin_view(@stage_common_options))
    end
  end

end
