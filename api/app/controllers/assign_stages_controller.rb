class AssignStagesController < ApplicationController
  before_action :set_assign_stage, only: [:show, :update, :destroy]

  # GET /assign_stages
  # GET /assign_stages.json
  def index
    @assign_stages = AssignStage.all
    render json: @assign_stages
  end

  # GET /assign_stages/1
  # GET /assign_stages/1.json
  def show
    render json: @assign_stage
  end

  # POST /assign_stages
  # POST /assign_stages.json
  def create
    @assign_stage = AssignStage.new(assign_stage_params)
    @assign_stage.save
  end

  # PATCH/PUT /assign_stages/1
  # PATCH/PUT /assign_stages/1.json
  def update
    @assign_stage.update(assign_stage_params)
  end

  # DELETE /assign_stages/1
  # DELETE /assign_stages/1.json
  def destroy
    @assign_stage.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_assign_stage
      @assign_stage = AssignStage.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def assign_stage_params
      params.permit(:stage_order_id, :stage_id, :time_point_start, :time_point_end)
    end
end
