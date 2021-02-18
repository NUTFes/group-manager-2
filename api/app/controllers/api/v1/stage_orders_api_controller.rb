class Api::V1::StageOrdersApiController < ApplicationController

    def get_stage_orders_details
        stage_orders = StageOrder.all
        stage_orders_details = []
        for stage_order in stage_orders
          group = stage_order.group.name
          fes_date = stage_order.fes_date
          stage_first = Stage.find(stage_order.stage_first).name
          stage_second = Stage.find(stage_order.stage_second).name
          stage_orders_details << {
            stage_order: stage_order,
            group: group,
            fes_date: fes_date,
            stage_first: stage_first,
            stage_second: stage_second
          }
        end
        render json: stage_orders_details
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
