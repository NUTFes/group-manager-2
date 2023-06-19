class PurchaseListsController < ApplicationController
  before_action :set_purchase_list, only: [:show, :update, :destroy]

  # GET /purchase_lists
  # GET /purchase_lists.json
  def index
    @purchase_lists = PurchaseList.all
    render json: fmt(ok, @purchase_lists)
  end

  # GET /purchase_lists/1
  # GET /purchase_lists/1.json
  def show
    render json: fmt(ok, @purchase_list)
  end

  # POST /purchase_lists
  # POST /purchase_lists.json
  def create
    @purchase_list = PurchaseList.create(purchase_list_params)
    render json: fmt(created, @purchase_list)
  end

  # PATCH/PUT /purchase_lists/1
  # PATCH/PUT /purchase_lists/1.json
  def update
    @purchase_list.update(purchase_list_params)
    render json: fmt(created, @purchase_list, "Updated purchase_list id = "+params[:id])
  end

  # DELETE /purchase_lists/1
  # DELETE /purchase_lists/1.json
  def destroy
    @purchase_list.destroy
    render json: fmt(ok, [], "Deleted purchase_list = "+params[:id])
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_purchase_list
      if PurchaseList.exists?(params[:id])
        @purchase_list = PurchaseList.find(params[:id])
      else
        render json: fmt(not_found, [], "Not found purhase_list = "+params[:id])
      end
    end
    # Only allow a list of trusted parameters through.
    def purchase_list_params
      params.permit(:food_product_id, :shop_id, :fes_date_id, :items, :is_fresh, :purchase_date, :url)
    end
end
