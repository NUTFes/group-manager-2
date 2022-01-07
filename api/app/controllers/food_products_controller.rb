class FoodProductsController < ApplicationController
  before_action :set_food_product, only: [:show, :update, :destroy]

  # GET /food_products
  # GET /food_products.json
  def index
    @food_products = FoodProduct.all
    render json: fmt(ok, @food_products)
  end

  # GET /food_products/1
  # GET /food_products/1.json
  def show
    render json: fmt(ok, @food_product)
  end

  # POST /food_products
  # POST /food_products.json
  def create
    @food_product = FoodProduct.create(food_product_params)
    render json: fmt(created, @food_product)
  end

  # PATCH/PUT /food_products/1
  # PATCH/PUT /food_products/1.json
  def update
    @food_product.update(food_product_params)
    render json: fmt(created, @food_product, "Updated food_product id = "+params[:id])
  end

  # DELETE /food_products/1
  # DELETE /food_products/1.json
  def destroy
    @food_product.destroy
    render json: fmt(ok, [], "Deleted food_product = "+params[:id])
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_food_product
      if FoodProduct.exists?(params[:id])
        @food_product = FoodProduct.find(params[:id])
      else
        render json: fmt(not_found, [], "Not found food_product = "+params[:id])
      end
    end

    # Only allow a list of trusted parameters through.
    def food_product_params
      params.permit(:group_id, :name, :is_cooking, :first_day_num, :second_day_num)
    end
end
