class StockerItemsController < ApplicationController
  before_action :set_stocker_item, only: [:show, :update, :destroy]

  # GET /stocker_items
  # GET /stocker_items.json
  def index
    @stocker_items = StockerItem.all
    render json: fmt(ok, @stocker_items)
  end

  # GET /stocker_items/1
  # GET /stocker_items/1.json
  def show
    render json: fmt(ok, @stocker_item)
  end

  # POST /stocker_items
  # POST /stocker_items.json
  def create
    @stocker_item = StockerItem.create(stocker_item_params)
    render json: fmt(created, @stocker_item)
    # @stocker_items = StockerItem.all
    # render json: @stocker_items
  end

  # PATCH/PUT /stocker_items/1
  # PATCH/PUT /stocker_items/1.json
  def update
    @stocker_item.update(stocker_item_params)
    render json: fmt(created, @stocker_item, "Updated stocker_item id = "+params[:id])
  end

  # DELETE /stocker_items/1
  # DELETE /stocker_items/1.json
  def destroy
    @stocker_item.destroy
    render json: fmt(ok, [], "Deleted stocker_item = "+params[:id])
  end

  def index_with_remaining_num
    rental_item_id = params[:rental_item_id].to_i
    stocker_place_id = params[:stocker_place_id].to_i
    
    # 両方ともALL
    if rental_item_id == 0 && stocker_place_id == 0
      @stocker_items = StockerItem.all

    # rental_item_idだけ指定
    elsif rental_item_id != 0 && stocker_place_id == 0
      @stocker_items = StockerItem.where(rental_item_id: rental_item_id)
    
    # stocker_place_idだけ指定
    elsif rental_item_id == 0 && stocker_place_id != 0
      @stocker_items = StockerItem.where(stocker_place_id: stocker_place_id)

    # 両方とも指定
    elsif rental_item_id != 0 && stocker_place_id != 0
      @stocker_items = StockerItem.where(rental_item_id: rental_item_id, stocker_place_id: stocker_place_id)
    end

    output = []
    if(@stocker_items.length != 0)
      @stocker_items.each do |stocker_item|
        remaining_num = stocker_item.num - 
                          AssignRentalItem.where( rental_item_id: stocker_item.rental_item_id, 
                                                  stocker_place_id: stocker_item.stocker_place_id).sum(:num)
        temp = {
          id: stocker_item.id,
          fes_year_id: stocker_item.fes_year_id,
          rental_item: stocker_item.rental_item.name,
          stocker_place: stocker_item.stocker_place.name,
          num: stocker_item.num,
          remaining_num: remaining_num,
        }
        output << temp
      end
      render json: fmt(ok, output)
    else
      render json: fmt(not_found, [], "Not found stocker_items")
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_stocker_item
      if StockerItem.exists?(params[:id])
        @stocker_item = StockerItem.find(params[:id])
      else
        render json: fmt(not_found, [], "Not found stocker_item = "+params[:id])
      end
    end

    # Only allow a list of trusted parameters through.
    def stocker_item_params
      params.permit(:rental_item_id, :stocker_place_id, :fes_year_id, :num)
    end
end
