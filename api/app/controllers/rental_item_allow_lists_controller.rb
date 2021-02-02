class RentalItemAllowListsController < ApplicationController
  before_action :set_rental_item_allow_list, only: [:show, :update, :destroy]

  def index
    @rental_item_allow_lists = RentalItemAllowList.all
    render json: @rental_item_allow_lists
  end

  def show
    render json: @rental_item_allow_list
  end

  def create
    @rental_item_allow_list = RentalItemAllowList.new(rental_item_allow_list_params)
    @rental_item_allow_list.save
  end

  def update
    @rental_item_allow_list.update(rental_item_allow_list_params)
  end

  def destroy
    @rental_item_allow_list.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_rental_item_allow_list
      @rental_item_allow_list = RentalItemAllowList.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def rental_item_allow_list_params
      params.permit(:rental_item_id, :group_category_id)
    end
end
