class GroupCategoriesController < ApplicationController
  before_action :set_group_category, only: [:show, :update, :destroy]

  def index
    @group_categories = GroupCategory.all
    render json: @group_categories
  end

  def show
    render json: @group_category
  end

  def create
    @group_category = Group.new(group_category_params)
    @group_category.save
    render json: @group_category
  end

  def update
    @group.update(group_category_params)
    render json: @group_category
  end

  def destroy
    @group_category.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_group_category
      @group_category = GroupCategory.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def group_params
      params.permit(:name)
    end
end
