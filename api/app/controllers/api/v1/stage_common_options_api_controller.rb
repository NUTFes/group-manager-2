class Api::V1::StageCommonOptionsApiController < ApplicationController

  def get_stage_common_option_index_for_admin_view
    @stage_common_options = StageCommonOption.with_groups
    render json: fmt(ok, @stage_common_options)
  end

  def get_stage_common_option_show_for_admin_view
    @stage_common_option = StageCommonOption.with_group(params[:id])
    render json: fmt(ok, @stage_common_option)
  end

end
