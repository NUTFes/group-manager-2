# frozen_string_literal: true

class StageNumberController < ApplicationController
  before_action :set_stage_number, only: %i[update destroy]

  # ステージ割り当て

  def index
    @stages = Stage.all
    @stage_numbers = @stages.map do |stage|
      {
        stage: stage,
        stage_numbers: if stage.stage_numbers.nil?
                         nil
                       else
                         stage.stage_numbers.map do |stage_number|
                           {
                             group_identification_id: stage_number.group_identification&.id,
                             stage_number: stage_number,
                             num: if stage_number.group_identification.nil?
                                    nil
                                  else
                                    (stage_number.group_identification.group.fes_year_id == params[:fes_year_id].to_i ? stage_number.group_identification.number : nil)
                                  end,
                             group: if stage_number.group_identification.nil?
                                      nil
                                    else
                                      (stage_number.group_identification.group.fes_year_id == params[:fes_year_id].to_i ? stage_number.group_identification.group : nil)
                                    end
                           }
                         end
                       end
      }
    end
    render json: fmt(ok, @stage_numbers)
  end

  def create
    @stage_number = StageNumber.create(stage_number_params)
    render json: fmt(created, @stage_number)
  end

  def update
    @stage_number.update(stage_number_params)
    render json: fmt(ok, @stage_number, "Updated stage_number id =#{params[:id]}")
  end

  def destroy
    @stage_number.destroy
    render json: fmt(ok, [], "Deleted stage_number id =#{params[:id]}")
  end

  private

  def set_stage_number
    if StageNumber.exists?(params[:id])
      @stage_number = StageNumber.find(params[:id])
    else
      render json: fmt(not_found, [], "Not found stage_number id = #{params[:id]}")
    end
  end

  def stage_number_params
    params.permit(:stage_id, :group_identification_id)
  end
end
