class StagesController < ApplicationController
  before_action :set_stage, only: [:show, :update, :destroy]

  def index
    @stages = Stage.all
    render json: fmt(ok, @stages)
  end

  def show
     render json: fmt(ok, @stage)
  end

  def show_sunny
    @stage = Stage.where(enable_sunny: true)
    render json: fmt(ok, @stage)
  end

  def show_rainy
    @stage = Stage.where(enable_rainy: true)
    render json: fmt(ok, @stage)
  end

  def create
    @stage = Stage.create(stage_params)
    render json: fmt(created, @stage)
  end

  def update
    @stage.update(stage_params)
    render json: fmt(created, @stage, "Updated stage id = "+params[:id])
  end

  def destroy
    @stage.destroy
    render json: fmt(ok, [], "Deleted stage = "+params[:id])
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_stage
      if Stage.exists?(params[:id])
        @stage = Stage.find(params[:id])
      else
        render json: fmt(not_found, [], "Not found stage = "+params[:id])
      end
    end

    # Only allow a list of trusted parameters through.
    def stage_params
      params.permit(:name, :enable_sunny, :enable_rainy)
    end
end
