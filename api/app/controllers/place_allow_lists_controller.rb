class PlaceAllowListsController < ApplicationController
  before_action :set_place_allow_list, only: [:show, :update, :destroy]

  # GET /place_allow_lists
  # GET /place_allow_lists.json
  def index
    @place_allow_lists = PlaceAllowList.all
    render json: @place_allow_lists
  end

  # GET /place_allow_lists/1
  # GET /place_allow_lists/1.json
  def show
    render json: @place_allow_list
  end

  # POST /place_allow_lists
  # POST /place_allow_lists.json
  def create
    @place_allow_list = PlaceAllowList.new(place_allow_list_params)
    @place_allow_list.save
    render json: @place_allow_list
  end

  # PATCH/PUT /place_allow_lists/1
  # PATCH/PUT /place_allow_lists/1.json
  def update
    @place_allow_list.update(place_allow_list_params)
    render json: @place_allow_list
  end

  # DELETE /place_allow_lists/1
  # DELETE /place_allow_lists/1.json
  def destroy
    @place_allow_list.destroy
    @place_allow_lists = PlaceAllowList.all
    render json: @place_allow_lists
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_place_allow_list
      @place_allow_list = PlaceAllowList.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def place_allow_list_params
      params.permit(:place_id, :group_category_id, :enable)
    end
end
