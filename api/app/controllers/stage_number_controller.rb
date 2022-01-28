class StageNumberController < ApplicationController
  before_action :set_place_number, only: [:show, :update, :destroy]

  # ステージ割り当て

  def create
    @stage_number = StageNumber.create(stage_number_params)
    render json: fmt(created, @stage_number)
  end

  def update
    @stage_number.update(stage_number_params)
    render json: fmt(ok, @stage_number, "Updated stage_number id ="+params[:id])
  end

  def destroy
    @stage_number.destroy
    render json: fmt(ok, [], "Deleted stage_number id ="+params[:id])
  end

  private

  def set_stage_number
    if StageNumber.exists?(params[:id])
      @stage_number = StageNumber.find(params[:id])
    else
      render json: fmt(not_found, [], "Not found stage_number id = "+params[:id])
    end
  end

  def stage_number_params
    params.permit(:stage_id, :group_identification_id)
  end
end
