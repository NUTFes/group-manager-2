class Api::V1::StageOrdersApiController < ApplicationController

    def get_stage_orders_details
      # ステージ申請の一覧で使う
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

    def get_stage_order_details
      # ステージ申請の詳細で使う
      stage_order_details = []
      stage_order = StageOrder.find(params[:id])
      group = stage_order.group.name
      fes_date = stage_order.fes_date
      stage_first = Stage.find(stage_order.stage_first).name
      stage_second = Stage.find(stage_order.stage_second).name
      stage_order_details = {
        stage_order: stage_order,
        group: group,
        fes_date: fes_date,
        stage_first: stage_first,
        stage_second: stage_second,
      }
      render json: stage_order_details
    end

end
