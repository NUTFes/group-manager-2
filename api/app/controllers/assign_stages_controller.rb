class AssignStagesController < ApplicationController
  before_action :set_assign_stage, only: [:show, :update, :destroy]

  # GET /assign_stages
  # GET /assign_stages.json
  def index
    @assign_stages = AssignStage.all
    render json: fmt(ok, @assign_stages)
  end

  # GET /assign_stages/1
  # GET /assign_stages/1.json
  def show
    render json: fmt(ok, @assign_stage)
  end

  # POST /assign_stages
  # POST /assign_stages.json
  def create
    @assign_stage = AssignStage.create(assign_stage_params)
    render json: fmt(created, @assign_stage)
  end

  # PATCH/PUT /assign_stages/1
  # PATCH/PUT /assign_stages/1.json
  def update
    @assign_stage.update(assign_stage_params)
    render json: fmt(created, @assign_stage, "Updated assign_stage id = "+params[:id])
  end

  # DELETE /assign_stages/1
  # DELETE /assign_stages/1.json
  def destroy
    @assign_stage.destroy
    render json: fmt(ok, [], "Deleted assign_stage = "+params[:id])
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_assign_stage
      if AssignStage.exists?(params[:id])
        @assign_stage = AssignStage.find(params[:id])
      else
        render json: fmt(not_found, [], "Not found assign_stage = "+params[:id])
      end
    end

    # Only allow a list of trusted parameters through.
    def assign_stage_params
      params.permit(:stage_order_id, :stage_id, :time_point_start, :time_point_end)
    end
end
