class FoodProductsController < ApplicationController
  before_action :set_food_product, only: [:show, :destroy]

  # GET /food_products
  def index
    @food_products = FoodProduct.all
    render json: fmt(ok, @food_products)
  end

  # GET /group/:group_id/food_products
  def group_food_products
    @food_products = FoodProduct.where(group_id: params[:group_id])
    render json: fmt(ok, @food_products)
  end

  # GET /food_products/1
  def show
    render json: fmt(ok, @food_product)
  end

  # POST /food_products
  # 単一レコード作成
  def create
    @food_product = FoodProduct.new(food_product_params)
    if @food_product.save
      render json: fmt(created, @food_product)
    else
      render json: fmt(unprocessable_entity, [], @food_product.errors.full_messages.join(', ')), status: :unprocessable_entity
    end
  end

  # POST /food_products/bulk_create
  # 複数レコード作成
  def bulk_create
    created = FoodProduct.transaction do
      food_product_bulk_params.map { |attrs| FoodProduct.create!(attrs) }
    end
    render json: fmt(created, created), status: :created
  rescue ActiveRecord::RecordInvalid => e
    render json: fmt(unprocessable_entity, [], e.record.errors.full_messages.join(', ')), status: :unprocessable_entity
  end

  # PATCH/PUT /food_products/:id
  # 単一レコード更新
  def update
    @food_product = FoodProduct.find_by(id: params[:id])
    if @food_product&.update(food_product_params)
      render json: fmt(ok, @food_product, "Updated food_product id = #{params[:id]}")
    else
      render json: fmt(unprocessable_entity, [], @food_product&.errors&.full_messages&.join(', ') || "Not found"), status: :unprocessable_entity
    end
  end

  # PATCH/PUT /food_products/bulk_update
  # 複数レコード更新
  def bulk_update
    updates = food_product_bulk_params(include_id: true)
    updated = FoodProduct.transaction do
      updates.map do |attrs|
        fp = FoodProduct.find(attrs.delete(:id))
        fp.update!(attrs)
        fp
      end
    end
    render json: fmt(ok, updated)
  rescue ActiveRecord::RecordNotFound => e
    render json: fmt(not_found, [], e.message), status: :not_found
  rescue ActiveRecord::RecordInvalid => e
    render json: fmt(unprocessable_entity, [], e.record.errors.full_messages.join(', ')), status: :unprocessable_entity
  end

  # DELETE /food_products/1
  def destroy
    @food_product.destroy
    render json: fmt(ok, [], "Deleted food_product = #{params[:id]}")
  end

  private

    def set_food_product
      @food_product = FoodProduct.find_by(id: params[:id])
      return if @food_product
      render json: fmt(not_found, [], "Not found food_product id=#{params[:id]}"), status: :not_found
    end

    # 単一レコード用 Strong Parameters
    def food_product_params
      params.permit(:group_id, :name, :is_cooking, :first_day_num, :second_day_num)
    end

    # 複数レコード用 Strong Parameters
    # include_id: true で :id を許可
    def food_product_bulk_params(include_id: false)
      permitted = %i[group_id name is_cooking first_day_num second_day_num]
      permitted << :id if include_id

      params.require(:food_products).map do |fp|
        ActionController::Parameters
          .new(fp.to_unsafe_h)
          .permit(permitted)
          .to_h
          .symbolize_keys
      end
    end
end
