class PlaceAllowListsController < ApplicationController
  before_action :set_place_allow_list, only: [:show, :update, :destroy]

  # GET /place_allow_lists
  # GET /place_allow_lists.json
  def index
    @place_allow_lists = PlaceAllowList.all
    render json: fmt(ok, @place_allow_lists)
  end

  # GET /place_allow_lists/1
  # GET /place_allow_lists/1.json
  def show
    render json: fmt(ok, @place_allow_list)
  end

  # POST /place_allow_lists
  # POST /place_allow_lists.json
  def create
    @place_allow_list = PlaceAllowList.create(place_allow_list_params)
    render json: fmt(created, @place_allow_list)
  end

  # PATCH/PUT /place_allow_lists/1
  # PATCH/PUT /place_allow_lists/1.json
  def update
    @place_allow_list.update(place_allow_list_params)
    render json: fmt(created, @place_allow_list, "Updated place_allow_list id = "+params[:id])
  end

  # DELETE /place_allow_lists/1
  # DELETE /place_allow_lists/1.json
  def destroy
    @place_allow_list.destroy
    render json: fmt(ok, [], "Deleted place_allow_list = "+params[:id]) 
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_place_allow_list
      if PlaceAllowList.exists?(params[:id])
        @place_allow_list = PlaceAllowList.find(params[:id])
      else
        render json: fmt(not_found, [], "Not found place_allow_list = "+params[:id])
      end
    end

    # Only allow a list of trusted parameters through.
    def place_allow_list_params
      params.permit(:place_id, :group_category_id, :enable)
    end
end
