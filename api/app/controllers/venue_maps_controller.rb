# frozen_string_literal: true

class VenueMapsController < ApplicationController
  before_action :set_venue_map, only: %i[show update destroy]

  # GET /venue_maps
  # GET /venue_maps.json
  def index
    @venue_maps = current_user_group_scope(VenueMap)
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
    group = current_api_user_group!(venue_map_params[:group_id])
    return unless group

    @venue_map = VenueMap.create(venue_map_params.merge(group_id: group.id))
    render json: fmt(created, @venue_map)
  end

  # PATCH/PUT /venue_maps/1
  # PATCH/PUT /venue_maps/1.json
  def update
    old_picture_path = @venue_map.picture_path
    old_imgur_deletehash = @venue_map.imgur_deletehash

    attrs = venue_map_params
    return if attrs[:group_id].present? && !current_api_user_group!(attrs[:group_id])

    updated = @venue_map.update(attrs)
    ImgurImageDeleter.call_if_replaced(old_picture_path, old_imgur_deletehash, @venue_map.picture_path) if updated

    render json: fmt(created, @venue_map, "Updated venue_map id = #{params[:id]}")
  end

  # DELETE /venue_maps/1
  # DELETE /venue_maps/1.json
  def destroy
    imgur_deletehash = @venue_map.imgur_deletehash

    @venue_map.destroy
    ImgurImageDeleter.call(imgur_deletehash) if @venue_map.destroyed?

    render json: fmt(ok, [], "Deleted venue_map = #{params[:id]}")
  end

  # GET /venue_maps/group/:group_id
  def get_by_group_id
    group = current_api_user_group!(params[:group_id])
    return unless group

    venue_map = VenueMap.find_by(group_id: group.id)
    if venue_map
      render json: fmt(ok, venue_map)
    else
      render json: fmt(not_found, [], 'Not Found'), status: :not_found
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_venue_map
    @venue_map = current_user_group_record!(VenueMap, params[:id])
  end

  # Only allow a list of trusted parameters through.
  def venue_map_params
    params.permit(:group_id, :picture_name, :picture_path, :imgur_deletehash)
  end
end
