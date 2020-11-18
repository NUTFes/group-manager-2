class FoodProductsController < ApplicationController
  before_action :set_food_product, only: [:show, :update, :destroy]

  # GET /food_products
  # GET /food_products.json
  def index
    @food_products = FoodProduct.all
  end

  # GET /food_products/1
  # GET /food_products/1.json
  def show
  end

  # POST /food_products
  # POST /food_products.json
  def create
    @food_product = FoodProduct.new(food_product_params)

    if @food_product.save
      render :show, status: :created, location: @food_product
    else
      render json: @food_product.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /food_products/1
  # PATCH/PUT /food_products/1.json
  def update
    if @food_product.update(food_product_params)
      render :show, status: :ok, location: @food_product
    else
      render json: @food_product.errors, status: :unprocessable_entity
    end
  end

  # DELETE /food_products/1
  # DELETE /food_products/1.json
  def destroy
    @food_product.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_food_product
      @food_product = FoodProduct.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def food_product_params
      params.require(:food_product).permit(:group_id, :name, :is_cooking, :first_day_num, :second_day_num)
    end
end
