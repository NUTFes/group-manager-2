class CurrentStocksController < ApplicationController
  before_action :set_current_stock, only: [:show, :update, :destroy]

  # GET /current_stocks
  # GET /current_stocks.json
  def index
    @current_stocks = CurrentStock.all
    render json: fmt(ok, @current_stocks)
  end

  # GET /current_stocks/1
  # GET /current_stocks/1.json
  def show
    render json: fmt(ok, @current_stock)
  end

  # POST /current_stocks
  # POST /current_stocks.json
  def create
    @current_stock = CurrentStock.create(current_stock_params)
    render json: fmt(created, @current_stock)
  end

  # PATCH/PUT /current_stocks/1
  # PATCH/PUT /current_stocks/1.json
  def update
    @current_stock.update(current_stock_params)
    render json: fmt(created, @current_stock, "Updated current_stock id = "+params[:id])
  end

  # DELETE /current_stocks/1
  # DELETE /current_stocks/1.json
  def destroy
    @current_stock.destroy
    render json: fmt(ok, [], "Deleted current_stock id = "+params[:id])
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_current_stock
      if CurrentStock.exists?(params[:id])
        @current_stock = CurrentStock.find(params[:id])
      else
        render json: fmt(not_found, [], "Not found current_stock id = "+params[:id])
      end
    end

    # Only allow a list of trusted parameters through.
    def current_stock_params
      params.permit(:group_id, :stock_id, :number)
    end
end
