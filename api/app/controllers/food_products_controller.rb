class FoodProductsController < ApplicationController
  before_action :set_food_product, only: [:show, :destroy]

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
  # 複数件の作成も行う。配列で渡すことで複数件も可能。
  def create
    ActiveRecord::Base.transaction do
      @food_products = FoodProduct.create(food_product_array_params)

      if @food_products.all?(&:persisted?)
        render json: fmt(created, @food_products)
      else
        render json: fmt(not_found, [], "Not found food_products")
        raise ActiveRecord::Rollback
      end
    end
  end

  # PATCH/PUT /food_products
  # PATCH/PUT /food_products.json
  def update
    @food_products = []
    errors = []

    ActiveRecord::Base.transaction do
      params[:food_products].each do |food_product_data|
        food_product = FoodProduct.find_by(id: food_product_data[:id])
        if food_product.nil?
          errors << { id: food_product_data[:id], error: "Food product not found" }
          next
        end

        if food_product.update(food_product_data.permit(:group_id, :name, :is_cooking, :first_day_num, :second_day_num))
          @food_products << food_product
        else
          errors << { id: food_product_data[:id], errors: food_product.errors.full_messages }
        end
      end

      if errors.any?
        render json: { status: 422, message: "Some updates failed", errors: errors }, status: :unprocessable_entity
        raise ActiveRecord::Rollback
      end
    end

    if errors.empty?
      render json: fmt(ok, @food_products, "Updated food_products")
    end
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

    # Handle both single and bulk creation parameters
    def food_product_array_params
      if params[:food_products].present?
        params.require(:food_products).map { |f| f.permit(:group_id, :name, :is_cooking, :first_day_num, :second_day_num) }
      elsif params.is_a?(Array)
        params.map { |f| f.permit(:group_id, :name, :is_cooking, :first_day_num, :second_day_num) }
      else
        [food_product_params]
      end
    end
end
