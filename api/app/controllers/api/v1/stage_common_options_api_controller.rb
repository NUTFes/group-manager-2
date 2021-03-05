class Api::V1::StageCommonOptionsApiController < ApplicationController

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
