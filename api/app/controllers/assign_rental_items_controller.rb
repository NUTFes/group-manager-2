class AssignRentalItemsController < ApplicationController
  before_action :set_assign_rental_item, only: [:show, :update, :destroy]

  # GET /assign_rental_items
  # GET /assign_rental_items.json
  def index
    @assign_rental_items = AssignRentalItem.all
    render json: fmt(ok, @assign_rental_items)
  end

  # GET /assign_rental_items/1
  # GET /assign_rental_items/1.json
  def show
    render json: fmt(ok, @assign_rental_item)
  end

  # POST /assign_rental_items
  # POST /assign_rental_items.json
  def create
    ActiveRecord::Base.transaction do
      @assign_rental_items = assign_rental_items_params[:items].map do |item_params|
        AssignRentalItem.create!(
          group_id: item_params[:group_id],
          rental_item_id: assign_rental_items_params[:rentalItemId],
          num: item_params[:num],
          stocker_place_id: assign_rental_items_params[:stockerPlaceId]
        )
      end
    end
    render json: fmt(created, @assign_rental_items)
  rescue ActiveRecord::RecordInvalid => e
    render json: fmt(internal_server_error, [], e.message)
  end

  # PATCH/PUT /assign_rental_items/1
  # PATCH/PUT /assign_rental_items/1.json
  def update
    @assign_rental_item.update(assign_rental_item_params)
    render json: fmt(created, @assign_rental_item, "Updated assign_rental_item id = "+params[:id])
  end

  # DELETE /assign_rental_items/1
  # DELETE /assign_rental_items/1.json
  def destroy
    @assign_rental_item.destroy
    render json: fmt(ok, [], "Deleted assign_rental_item = "+params[:id])
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_assign_rental_item
      if AssignRentalItem.exists?(params[:id])
        @assign_rental_item = AssignRentalItem.find(params[:id])
      else
        render json: fmt(not_found, [], "Not found assign_rental_item = "+params[:id])
      end
    end

    # Only allow a list of trusted parameters through.
    def assign_rental_items_params
      params.permit(:rentalItemId, :stockerPlaceId, items: [:group_id, :num])
    end
  end
