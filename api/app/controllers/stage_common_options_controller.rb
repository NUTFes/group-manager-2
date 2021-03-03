class StageCommonOptionsController < ApplicationController
  before_action :set_stage_common_option, only: [:show, :update, :destroy]

  # GET /stage_common_options
  # GET /stage_common_options.json
  def index
    @stage_common_options = StageCommonOption.all
    render json: @stage_common_options
  end

  # GET /stage_common_options/1
  # GET /stage_common_options/1.json
  def show
    render json: @stage_common_option
  end

  # POST /stage_common_options
  # POST /stage_common_options.json
  def create
    @stage_common_option = StageCommonOption.new(stage_common_option_params)
    @stage_common_option.save
  end

  # PATCH/PUT /stage_common_options/1
  # PATCH/PUT /stage_common_options/1.json
  def update
    @stage_common_option.update(stage_common_option_params)
  end

  # DELETE /stage_common_options/1
  # DELETE /stage_common_options/1.json
  def destroy
    @stage_common_option.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_stage_common_option
      @stage_common_option = StageCommonOption.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def stage_common_option_params
      params.permit(:group_id, :own_equipment, :bgm, :camera_permission, :loud_sound, :stage_content)
    end
end
