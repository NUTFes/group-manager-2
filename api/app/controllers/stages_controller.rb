class StagesController < ApplicationController
  before_action :set_stage, only: [:show, :update, :destroy]

  def index
    @stages = Stage.all
    render json: @stages
  end

  def show
     render json: @stage
  end

  def create
    @stage = Stage.new(stage_params)
    @stage.save
  end

  def update
    @stage.update(stage_params)
  end

  def destroy
    @stage.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_stage
      @stage = Stage.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def stage_params
      params.permit(:name, :enable_sunny, :enable_rainy)
    end
end
