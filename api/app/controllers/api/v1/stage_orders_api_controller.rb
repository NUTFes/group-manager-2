class Api::V1::StageOrdersApiController < ApplicationController

  def get_stage_order_index_for_admin_view
    @stage_orders = StageOrder.with_groups
    render json: fmt(ok, @stage_orders)
  end

  def get_stage_order_show_for_admin_view
    @stage_order = StageOrder.with_group(params[:id])
    render json: fmt(ok, @stage_order)
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
