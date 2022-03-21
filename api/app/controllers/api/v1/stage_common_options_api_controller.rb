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

    option_list = [nil, true, false] # 0: 指定なし(ALL) 1: true 2:false
    
    if fes_year_id == 0 && own_equipment == 0 && bgm == 0 && camera_permission == 0 && loud_sound == 0
      @stage_common_options = StageCommonOption.all
    # fes_year_idのみで絞り込み 
    elsif fes_year_id != 0 && own_equipment == 0 && bgm == 0 && camera_permission == 0 && loud_sound == 0
      @stage_common_options = StageCommonOption.preload(:group).map{ |stage_common_option| stage_common_option if stage_common_option.group.fes_year_id == fes_year_id }.compact
    # own_equipmentのみで絞り込み
    elsif fes_year_id == 0 && own_equipment != 0 && bgm == 0 && camera_permission == 0 && loud_sound == 0
      @stage_common_options = StageCommonOption.where(own_equipment: option_list[own_equipment])
    # bgmのみで絞り込み
    elsif fes_year_id == 0 && own_equipment == 0 && bgm != 0 && camera_permission == 0 && loud_sound == 0
      @stage_common_options = StageCommonOption.where(bgm: option_list[bgm])
    # camera_permissionのみで絞り込み
    elsif fes_year_id == 0 && own_equipment == 0 && bgm == 0 && camera_permission != 0 && loud_sound == 0
      @stage_common_options = StageCommonOption.where(camera_permission: option_list[camera_permission])
    # loud_soundのみで絞り込み
    elsif fes_year_id == 0 && own_equipment == 0 && bgm == 0 && camera_permission == 0 && loud_sound != 0
      @stage_common_options = StageCommonOption.where(loud_sound: option_list[loud_sound])
    # fes_year_idとown_equimpmentで絞り込み
    elsif fes_year_id != 0 && own_equipment != 0 && bgm == 0 && camera_permission == 0 && loud_sound == 0
      @stage_common_options = StageCommonOption.where(loud_sound: option_list[loud_sound]).preload(:group).map{ |stage_common_option| stage_common_option if stage_common_option.group.fes_year_id = fes_year_id }.compact
    # fes_year_idとbgmで絞り込み
    elsif fes_year_id != 0 && own_equipment == 0 && bgm != 0 && camera_permission == 0 && loud_sound == 0
      @stage_common_options = StageCommonOption.where(bgm: option_list[bgm]).preload(:group).map{ |stage_common_option| stage_common_option if stage_common_option.group.fes_year_id = fes_year_id }.compact

    # fes_year_idとcamera_permissionで絞り込み
    elsif fes_year_id != 0 && own_equipment == 0 && bgm == 0 && camera_permission != 0 && loud_sound == 0
      @stage_common_options = StageCommonOption.where(camera_permission: option_list[camera_permission]).preload(:group).map{ |stage_common_option| stage_common_option if stage_common_option.group.fes_year_id = fes_year_id }.compact
    # fes_year_idとloud_soundで絞り込み
    elsif fes_year_id != 0 && own_equipment == 0 && bgm == 0 && camera_permission == 0 && loud_sound != 0
      @stage_common_options = StageCommonOption.where(loud_sound: option_list[loud_sound]).preload(:group).map{ |stage_common_option| stage_common_option if stage_common_option.group.fes_year_id = fes_year_id }.compact
    # own_equipmentとbgmで絞り込み
    elsif fes_year_id == 0 && own_equipment != 0 && bgm != 0 && camera_permission == 0 && loud_sound == 0
      @stage_common_options = StageCommonOption.where(own_equipment: option_list[own_equipment]).where(bgm: option_list[bgm])
    # own_equipmentとcamera_permissionで絞り込み
    elsif fes_year_id == 0 && own_equipment != 0 && bgm == 0 && camera_permission != 0 && loud_sound == 0
      @stage_common_options = StageCommonOption.where(own_equipment: option_list[own_equipment]).where(camera_permission: option_list[camera_permission])
    # own_equipmentとloud_soundで絞り込み
    elsif fes_year_id == 0 && own_equipment != 0 && bgm == 0 && camera_permission == 0 && loud_sound != 0
      @stage_common_options = StageCommonOption.where(own_equipment: option_list[own_equipment]).where(loud_sound: option_list[loud_sound])
    # bgmとcamera_permissionで絞り込み
    elsif fes_year_id == 0 && own_equipment == 0 && bgm != 0 && camera_permission != 0 && loud_sound == 0
      @stage_common_options = StageCommonOption.where(bgm: option_list[bgm]).where(camera_permission: option_list[camera_permission])
    # bgmとloud_soundで絞り込み
    elsif fes_year_id == 0 && own_equipment == 0 && bgm != 0 && camera_permission == 0 && loud_sound != 0
      @stage_common_options = StageCommonOption.where(bgm: option_list[bgm]).where(loud_sound: option_list[loud_sound])
    # camera_permissionとloud_soundで絞り込み
    elsif fes_year_id == 0 && own_equipment == 0 && bgm == 0 && camera_permission != 0 && loud_sound != 0
      @stage_common_options = StageCommonOption.where(camera_permission: option_list[camera_permission]).where(loud_sound: option_list[loud_sound])

    # fes_year_idとown_equimpmentとbgmで絞り込み
    elsif fes_year_id != 0 && own_equipment != 0 && bgm != 0 && camera_permission == 0 && loud_sound == 0
      @stage_common_options = StageCommonOption.where(own_equipment: option_list[own_equipment]).where(bgm: option_list[bgm]).preload(:group).map{ |stage_common_option| stage_common_option if stage_common_option.group.fes_year_id = fes_year_id }.compact
    # fes_year_idとown_equimpmentとcamera_permissionで絞り込み
    elsif fes_year_id != 0 && own_equipment != 0 && bgm == 0 && camera_permission != 0 && loud_sound == 0
      @stage_common_options = StageCommonOption.where(own_equipment: option_list[own_equipment]).where(camera_permission: option_list[camera_permission]).preload(:group).map{ |stage_common_option| stage_common_option if stage_common_option.group.fes_year_id = fes_year_id }.compact
    # fes_year_idとown_equimpmentとloud_soundで絞り込み
    elsif fes_year_id != 0 && own_equipment != 0 && bgm == 0 && camera_permission == 0 && loud_sound != 0
      @stage_common_options = StageCommonOption.where(own_equipment: option_list[own_equipment]).where(loud_sound: option_list[loud_sound]).preload(:group).map{ |stage_common_option| stage_common_option if stage_common_option.group.fes_year_id = fes_year_id }.compact
    # fes_year_idとbgmとcamera_permissionで絞り込み
    elsif fes_year_id != 0 && own_equipment == 0 && bgm != 0 && camera_permission != 0 && loud_sound == 0
      @stage_common_options = StageCommonOption.where(bgm: option_list[bgm]).where(camera_permission: option_list[camera_permission]).preload(:group).map{ |stage_common_option| stage_common_option if stage_common_option.group.fes_year_id = fes_year_id }.compact
    # fes_year_idとbgmとloud_soundで絞り込み
    elsif fes_year_id != 0 && own_equipment == 0 && bgm != 0 && camera_permission == 0 && loud_sound != 0
      @stage_common_options = StageCommonOption.where(bgm: option_list[bgm]).where(loud_sound: option_list[loud_sound]).preload(:group).map{ |stage_common_option| stage_common_option if stage_common_option.group.fes_year_id = fes_year_id }.compact
    # fes_year_idとcamera_permissionとloud_soundで絞り込み
    elsif fes_year_id != 0 && own_equipment == 0 && bgm == 0 && camera_permission != 0 && loud_sound != 0
      @stage_common_options = StageCommonOption.where(camera_permission: option_list[camera_permission]).where(loud_sound: option_list[loud_sound]).preload(:group).map{ |stage_common_option| stage_common_option if stage_common_option.group.fes_year_id = fes_year_id }.compact
    # own_equipmentとbgmとcamera_permissionで絞り込み
    elsif fes_year_id == 0 && own_equipment != 0 && bgm != 0 && camera_permission != 0 && loud_sound == 0
      @stage_common_options = StageCommonOption.where(own_equipment: option_list[own_equipment]).where(bgm: option_list[bgm]).where(camera_permission: option_list[camera_permission])
    # own_equipmentとbgmとloud_soundで絞り込み
    elsif fes_year_id == 0 && own_equipment != 0 && bgm != 0 && camera_permission == 0 && loud_sound != 0
      @stage_common_options = StageCommonOption.where(own_equipment: option_list[own_equipment]).where(bgm: option_list[bgm]).where(loud_sound: option_list[loud_sound])
    # own_equipmentとcamera_permissionとloud_soundで絞り込み
    elsif fes_year_id == 0 && own_equipment != 0 && bgm == 0 && camera_permission != 0 && loud_sound != 0
      @stage_common_options = StageCommonOption.where(own_equipment: option_list[own_equipment]).where(camera_permission: option_list[camera_permission]).where(loud_sound: option_list[loud_sound])
    # bgmとcamera_permissionとloud_soundで絞り込み
    elsif fes_year_id == 0 && own_equipment == 0 && bgm != 0 && camera_permission != 0 && loud_sound != 0
      @stage_common_options = StageCommonOption.where(bgm: option_list[bgm]).where(camera_permission: option_list[camera_permission]).where(loud_sound: option_list[loud_sound])

    # fes_year_idとown_equimpmentとbgmとcamera_permissionで絞り込み
    elsif fes_year_id != 0 && own_equipment != 0 && bgm != 0 && camera_permission != 0 && loud_sound == 0
      @stage_common_options = StageCommonOption.where(own_equipment: option_list[own_equipment]).where(bgm: option_list[bgm]).where(camera_permission: option_list[camera_permission]).preload(:group).map{ |stage_common_option| stage_common_option if stage_common_option.group.fes_year_id == fes_year_id }.compact
    # fes_year_idとown_equimpmentとbgmとloud_soundで絞り込み
    elsif fes_year_id != 0 && own_equipment != 0 && bgm != 0 && camera_permission == 0 && loud_sound != 0
      @stage_common_options = StageCommonOption.where(own_equipment: option_list[own_equipment]).where(bgm: option_list[bgm]).where(loud_sound: option_list[loud_sound]).preload(:group).map{ |stage_common_option| stage_common_option if stage_common_option.group.fes_year_id == fes_year_id }.compact
    # fes_year_idとown_equimpmentとcamera_permissionとloud_soundで絞り込み
    elsif fes_year_id != 0 && own_equipment != 0 && bgm == 0 && camera_permission != 0 && loud_sound != 0
      @stage_common_options = StageCommonOption.where(own_equipment: option_list[own_equipment]).where(camera_permission: option_list[camera_permission]).where(loud_sound: option_list[loud_sound]).preload(:group).map{ |stage_common_option| stage_common_option if stage_common_option.group.fes_year_id == fes_year_id }.compact
    # fes_year_idとbgmとcamera_permissionとloud_soundで絞り込み
    elsif fes_year_id != 0 && own_equipment == 0 && bgm != 0 && camera_permission != 0 && loud_sound != 0
      @stage_common_options = StageCommonOption.where(bgm: option_list[bgm]).where(camera_permission: option_list[camera_permission]).where(loud_sound: option_list[loud_sound]).preload(:group).map{ |stage_common_option| stage_common_option if stage_common_option.group.fes_year_id == fes_year_id }.compact
    # own_equipmentとbgmとcamera_permissionとloud_soundで絞り込み
    elsif fes_year_id == 0 && own_equipment != 0 && bgm != 0 && camera_permission != 0 && loud_sound != 0
      @stage_common_options = StageCommonOption.where(own_equipment: option_list[own_equipment]).where(bgm: option_list[bgm]).where(camera_permission: option_list[camera_permission]).where(loud_sound: option_list[loud_sound])
    # 全てで絞り込み
    else
      @stage_common_options = StageCommonOption.where(own_equipment: option_list[own_equipment]).where(bgm: option_list[bgm]).where(camera_permission: option_list[camera_permission]).where(loud_sound: option_list[loud_sound]).preload(:group).map{ |stage_common_option| stage_common_option if stage_common_option.group.fes_year_id == fes_year_id }.compact
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
