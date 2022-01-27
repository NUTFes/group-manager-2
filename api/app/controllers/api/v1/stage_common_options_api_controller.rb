class Api::V1::StageCommonOptionsApiController < ApplicationController

  def get_stage_common_option_index_for_admin_view
    @stage_common_options = StageCommonOption.with_groups
    render json: fmt(ok, @stage_common_options)
  end

  def get_stage_common_option_show_for_admin_view
    @stage_common_option = StageCommonOption.with_group(params[:id])
    render json: fmt(ok, @stage_common_option)
  end

  def get_stage_common_options_with_group
    stage_common_options = StageCommonOption.all
    stage_common_options_with_group = []
    for s in stage_common_options 
      group = s.group.name
      stage_common_options_with_group << {
        stage_common_option: s,
        group: group,
      }
    end 
    render json: stage_common_options_with_group
  end

  def get_stage_common_option_with_group
    stage_common_option = StageCommonOption.find(params[:id])
    group = stage_common_option.group.name
    stage_common_option_with_group = {
      stage_common_option: stage_common_option,
      group: group
    }
    render json: stage_common_option_with_group
  end

end
