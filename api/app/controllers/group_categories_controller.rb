class GroupCategoriesController < ApplicationController
  before_action :set_group_category, only: [:show, :update, :destroy]

  def index
    @group_categories = GroupCategory.all
    render json: fmt(ok, @group_categories)
  end

  def show
    render json: fmt(ok, @group_category)
  end

  def create
    @group_category = Group.create(group_category_params)
    render json: fmt(created, @group_category)
  end

  def update
    @group.update(group_category_params)
    render json: fmt(created, @group_category, "Updated group_category id = "+params[:id])
  end

  def destroy
    @group_category.destroy
    render json: fmt(ok, [], "Deleted group_category = "+params[:id])
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_group_category
      if GroupCategory.exists?(params[:id])
        @group_category = GroupCategory.find(params[:id])
      else
        render json: fmt(not_found, [], "Not found group_category = "+params[:id])
      end
    end


    # Only allow a list of trusted parameters through.
    def group_params
      params.permit(:name)
    end
end
