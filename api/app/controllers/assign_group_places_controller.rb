class AssignGroupPlacesController < ApplicationController
  before_action :set_assign_group_place, only: [:show, :update, :destroy]

  # GET /assign_group_places
  # GET /assign_group_places.json
  def index
    @assign_group_places = AssignGroupPlace.all
  end

  # GET /assign_group_places/1
  # GET /assign_group_places/1.json
  def show
  end

  # POST /assign_group_places
  # POST /assign_group_places.json
  def create
    @assign_group_place = AssignGroupPlace.new(assign_group_place_params)

    if @assign_group_place.save
      render :show, status: :created, location: @assign_group_place
    else
      render json: @assign_group_place.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /assign_group_places/1
  # PATCH/PUT /assign_group_places/1.json
  def update
    if @assign_group_place.update(assign_group_place_params)
      render :show, status: :ok, location: @assign_group_place
    else
      render json: @assign_group_place.errors, status: :unprocessable_entity
    end
  end

  # DELETE /assign_group_places/1
  # DELETE /assign_group_places/1.json
  def destroy
    @assign_group_place.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_assign_group_place
      @assign_group_place = AssignGroupPlace.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def assign_group_place_params
      params.require(:assign_group_place).permit(:place_order_id, :place_id)
    end
end
