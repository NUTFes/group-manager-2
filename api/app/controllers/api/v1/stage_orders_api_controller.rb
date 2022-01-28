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

    #絞り込み機能 
    def get_refinement_stage_orders
      fes_year_id = params[:fes_year_id].to_i 
      fes_date_id = params[:fes_date_id].to_i 
      stage_id = params[:stage_id].to_i 
      is_sunny = params[:is_sunny]
      if is_sunny 
        @stage_orders = StageOrder.where(is_sunny: is_sunny) 
        if fes_year_id == 0 && fes_date_id == 0 && stage_id == 0  
          @stage_order = StageOrder.where(is_sunny: is_sunny)
        elsif fes_year_id != 0 && fes_date_id == 0 && stage_id == 0
          @stage_orders = Group.where(fes_year_id: fes_year_id).preload(:stage_orders).map{ |group| group.stage_orders.where(is_sunny: is_sunny) }
        elsif fes_year_id == 0 && fes_date_id != 0 && stage_id == 0
          @stage_orders = StageOrder.where(is_sunny: is_sunny).where(fes_date_id: fes_date_id)
        elsif fes_year_id == 0 && fes_date_id == 0 && stage_id != 0
          @stage_orders = StageOrder.where(is_sunny: is_sunny).where("(stage_first = ?) OR (stage_second = ?)", stage_id, stage_id)
        elsif fes_year_id != 0 && fes_date_id != 0 && stage_id == 0
          @stage_orders = Group.where(fes_year_id: fes_year_id).preload(:stage_orders).map{ |group| group.stage_orders.where(is_sunny: is_sunny).where(fes_date_id: fes_date_id) }
        elsif fes_year_id != 0 && fes_date_id == 0 && stage_id != 0
          @stage_orders = Group.where(fes_year_id: fes_year_id).preload(:stage_orders).map{ |group| group.stage_orders.where(is_sunny: is_sunny).where("(stage_first = ?) OR (stage_second = ?)", stage_id, stage_id) }
        else 
          @stage_orders = Group.where(fes_year_id: fes_year_id).preload(:stage_orders).map{ |group| group.stage_orders.where(is_sunny: is_sunny).where(fes_date_id: fes_date_id).where("(stage_first = ?) OR (stage_second = ?)", stage_id, stage_id) }
        end
      else 
        if fes_year_id == 0 && fes_date_id == 0 && stage_id == 0  
          @stage_order = StageOrder.all
        elsif fes_year_id != 0 && fes_date_id == 0 && stage_id == 0
          @stage_orders = Group.where(fes_year_id: fes_year_id).preload(:stage_orders).map{ |group| group.stage_orders }
        elsif fes_year_id == 0 && fes_date_id != 0 && stage_id == 0
          @stage_orders = StageOrder.where(fes_date_id: fes_date_id)
        elsif fes_year_id == 0 && fes_date_id == 0 && stage_id != 0
          @stage_orders = StageOrder.where("(stage_first = ?) OR (stage_second = ?)", stage_id, stage_id)
        elsif fes_year_id != 0 && fes_date_id != 0 && stage_id == 0
          @stage_orders = Group.where(fes_year_id: fes_year_id).preload(:stage_orders).map{ |group| group.stage_orders.where(fes_date_id: fes_date_id) }
        elsif fes_year_id != 0 && fes_date_id == 0 && stage_id != 0
          @stage_orders = Group.where(fes_year_id: fes_year_id).preload(:stage_orders).map{ |group| group.stage_orders.where("(stage_first = ?) OR (stage_second = ?)", stage_id, stage_id) }
        else 
          @stage_orders = Group.where(fes_year_id: fes_year_id).preload(:stage_orders).map{ |group| group.stage_orders.where(fes_date_id: fes_date_id).where("(stage_first = ?) OR (stage_second = ?)", stage_id, stage_id) }
        end
      end
      
      if @stage_orders.count == 0  
        render json: fmt(not_found, [], "Not found stage_orders")
      else 
        render json: fmt(ok, @stage_orders)
      end
    end

  #あいまい検索
  def get_search_stage_orders
    word = params[:word]
    @stage_orders = Group.where("name like ?", "%#{word}%").preload(:stage_orders).map{ |group| group.stage_orders } 
    if @stage_orders.count == 0
      render json: fmt(not_found, [], "Not found stage_orders")
    else
      render json: fmt(ok, @stage_orders)
    end
  end

      
end
