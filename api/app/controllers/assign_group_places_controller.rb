class AssignGroupPlacesController < ApplicationController
  before_action :set_assign_group_place, only: [:show, :update, :destroy]

  # GET /assign_group_places
  # GET /assign_group_places.json
  def index
    @assign_group_places = AssignGroupPlace.all
    render json: fmt(ok, @assign_group_places)
  end

  # GET /assign_group_places/1
  # GET /assign_group_places/1.json
  def show
    render json: fmt(ok, @assign_group_place)
  end

  # POST /assign_group_places
  # POST /assign_group_places.json
  def create
    @assign_group_place = AssignGroupPlace.create(assign_group_place_params)
    render json: fmt(created, @assign_group_place)
  end

  # PATCH/PUT /assign_group_places/1
  # PATCH/PUT /assign_group_places/1.json
  def update
    @assign_group_place.update(assign_group_place_params)
    render json: fmt(created, @assign_group_place, "Updated assign_group_place id = "+params[:id])
  end

  # DELETE /assign_group_places/1
  # DELETE /assign_group_places/1.json
  def destroy
    @assign_group_place.destroy
    render json: fmt(ok, [], "Deleted assign_group_place = "+params[:id])
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_assign_group_place
      if AssignGroupPlace.exists?(params[:id])
        @assign_group_place = AssignGroupPlace.find(params[:id])
      else 
        render json: fmt(not_found, [], "Not found assign_group_place = "+params[:id]) 
      end
    end

    # Only allow a list of trusted parameters through.
    def assign_group_place_params
      params.permit(:place_order_id, :place_id)
    end
end
