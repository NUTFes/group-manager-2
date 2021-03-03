class AssignRentalItemsController < ApplicationController
  before_action :set_assign_rental_item, only: [:show, :update, :destroy]

  # GET /assign_rental_items
  # GET /assign_rental_items.json
  def index
    @assign_rental_items = AssignRentalItem.all
    render json: @assign_rental_items
  end

  # GET /assign_rental_items/1
  # GET /assign_rental_items/1.json
  def show
    render json: @assign_rental_item
  end

  # POST /assign_rental_items
  # POST /assign_rental_items.json
  def create
    @assign_rental_item = AssignRentalItem.new(assign_rental_item_params)
    @assign_rental_item.save
    render json: @assign_rental_item
  end

  # PATCH/PUT /assign_rental_items/1
  # PATCH/PUT /assign_rental_items/1.json
  def update
    @assign_rental_item.update(assign_rental_item_params)
    render json: @assign_rental_item
  end

  # DELETE /assign_rental_items/1
  # DELETE /assign_rental_items/1.json
  def destroy
    @assign_rental_item.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_assign_rental_item
      @assign_rental_item = AssignRentalItem.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def assign_rental_item_params
      params.permit(:group_id, :rental_item_id, :num, :stocker_place_id)
    end
end
