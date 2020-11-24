class PurchaseListsController < ApplicationController
  before_action :set_purchase_list, only: [:show, :update, :destroy]

  # GET /purchase_lists
  # GET /purchase_lists.json
  def index
    @purchase_lists = PurchaseList.all
    render json: @purchase_lists
  end

  # GET /purchase_lists/1
  # GET /purchase_lists/1.json
  def show
    render json: @purchase_list
  end

  # POST /purchase_lists
  # POST /purchase_lists.json
  def create
    @purchase_list = PurchaseList.new(purchase_list_params)
    @purchase_list.save
  end

  # PATCH/PUT /purchase_lists/1
  # PATCH/PUT /purchase_lists/1.json
  def update
    @purchase_list.update(purchase_list_params)
  end

  # DELETE /purchase_lists/1
  # DELETE /purchase_lists/1.json
  def destroy
    @purchase_list.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_purchase_list
      @purchase_list = PurchaseList.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def purchase_list_params
      params.permit(:food_product_id, :shop_id, :fes_date_id, :items, :is_fresh)
    end
end
