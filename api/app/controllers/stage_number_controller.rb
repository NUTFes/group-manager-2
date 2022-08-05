class StageNumberController < ApplicationController
  before_action :set_stage_number, only: [:show, :update, :destroy]

  # ステージ割り当て

  def index
    @stages = Stage.all
    @stage_numbers = @stages.map{
      |stage|
      {
        "stage": stage,
        "stage_numbers": stage.stage_numbers.nil? ? nil : stage.stage_numbers.map{
          |stage_number|
          {
            "group_identification_id": stage_number.group_identification.nil? ? nil : stage_number.group_identification.id,
            "stage_number": stage_number,
            "num": stage_number.group_identification.nil? ? nil : (stage_number.group_identification.group.fes_year_id == params[:fes_year_id].to_i ? stage_number.group_identification.number : nil),
            "group": stage_number.group_identification.nil? ? nil : (stage_number.group_identification.group.fes_year_id == params[:fes_year_id].to_i ? stage_number.group_identification.group : nil)
          }
        }
      }
    }
    render json: fmt(ok, @stage_numbers)
  end

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
