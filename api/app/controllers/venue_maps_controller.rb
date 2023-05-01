class VenueMapsController < ApplicationController
  before_action :set_venue_map, only: [:show, :update, :destroy]

  # GET /venue_maps
  # GET /venue_maps.json
  def index
    @venue_maps = VenueMap.all
    render json: fmt(ok, @venue_maps)
  end

  # GET /venue_maps/1
  # GET /venue_maps/1.json
  def show
    render json: fmt(ok, @venue_map)
  end

  # POST /venue_maps
  # POST /venue_maps.json
  def create
    @venue_map = VenueMap.create(venue_map_params)
    render json: fmt(created, @venue_map)
  end

  # PATCH/PUT /venue_maps/1
  # PATCH/PUT /venue_maps/1.json
  def update
    @venue_map.update(venue_map_params)
    render json: fmt(created, @venue_map, "Updated venue_map id = "+params[:id])
  end

  # DELETE /venue_maps/1
  # DELETE /venue_maps/1.json
  def destroy
    @venue_map.destroy
    render json: fmt(ok, [], "Deleted venue_map = "+params[:id])
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_venue_map
      if VenueMap.exists?(params[:id])
        @venue_map = VenueMap.find(params[:id])
      else
        render json: fmt(not_found, [], "Not found venue_map = "+params[:id])
      end
    end
    # Only allow a list of trusted parameters through.
    def venue_map_params
      params.permit(:group_id, :picture_name, :picture_path)
    end
end
