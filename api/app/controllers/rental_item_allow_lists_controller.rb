class RentalItemAllowListsController < ApplicationController
  before_action :set_rental_item_allow_list, only: [:show, :update, :destroy]

  def index
    @rental_item_allow_lists = RentalItemAllowList.all
    render json: fmt(ok, @rental_item_allow_lists)
  end

  def show
    render json: fmt(ok, @rental_item_allow_list)
  end

  def create
    @rental_item_allow_list = RentalItemAllowList.create(rental_item_allow_list_params)
    render json: fmt(created, @rental_item_allow_list)
  end

  def update
    @rental_item_allow_list.update(rental_item_allow_list_params)
    render json: fmt(created, @rental_item_allow_list, "Updated rental_item_allow_list id = "+params[:id])
  end

  def destroy
    @rental_item_allow_list.destroy
    render json: fmt(ok, [], "Deleted rental_item_allow_list = "+params[:id])
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_rental_item_allow_list
      if RentalItemAllowList.exists?(params[:id])
        @rental_item_allow_list = RentalItemAllowList.find(params[:id])
      else
        render json: fmt(not_found, [], "Not found rental_item_allow_list = "+params[:id])
      end
    end

    # Only allow a list of trusted parameters through.
    def rental_item_allow_list_params
      params.permit(:rental_item_id, :group_category_id)
    end
end
