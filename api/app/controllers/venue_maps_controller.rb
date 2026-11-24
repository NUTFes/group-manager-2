# frozen_string_literal: true

class VenueMapsController < ApplicationController
  before_action :authenticate_api_user!
  # userの画面から呼ばれるaction以外は管理画面向け（参照はstaff以上、書き込みはmanager）
  before_action :require_staff!, except: %i[create update get_by_group_id]
  before_action :require_manager!, except: %i[create update get_by_group_id index show]
  # staffは閲覧専用のため、userの画面から呼ばれる書き込みも拒否する
  before_action :reject_staff_write!, only: %i[create update]
  before_action :require_accessible_group_param!, only: %i[create update get_by_group_id]
  before_action :set_venue_map, only: %i[show update destroy]

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
    old_picture_path = @venue_map.picture_path
    old_imgur_deletehash = @venue_map.imgur_deletehash

    updated = @venue_map.update(venue_map_params)
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
    venue_map = VenueMap.find_by(group_id: params[:group_id])
    if venue_map
      render json: fmt(ok, venue_map)
    else
      render json: fmt(not_found, [], "VenueMap not found for group_id: #{params[:group_id]}")
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_venue_map
    @venue_map = scope_to_accessible_groups(VenueMap.all).find_by(id: params[:id])
    return if @venue_map

    render_not_found_or_forbidden { render json: fmt(not_found, [], "Not found venue_map = #{params[:id]}") }
  end

  # Only allow a list of trusted parameters through.
  def venue_map_params
    params.permit(:group_id, :picture_name, :picture_path, :imgur_deletehash)
  end
end
