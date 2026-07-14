# frozen_string_literal: true

class StageCommonOptionsController < ApplicationController
  before_action :set_stage_common_option, only: %i[show update destroy]
  before_action :set_stage_common_option_by_group_id, only: [:get_by_group_id]

  # GET /stage_common_options
  # GET /stage_common_options.json
  def index
    @stage_common_options = StageCommonOption.all
    render json: fmt(ok, @stage_common_options)
  end

  # GET /stage_common_options/1
  # GET /stage_common_options/1.json
  def show
    render json: fmt(ok, @stage_common_option)
  end

  # POST /stage_common_options
  # POST /stage_common_options.json
  def create
    @stage_common_option = StageCommonOption.new(stage_common_option_params)
    if @stage_common_option.save
      render json: fmt(created, @stage_common_option)
    else
      render json: fmt(unprocessable_entity, [], @stage_common_option.errors.full_messages.join(', ')), status: :unprocessable_entity
    end
  end

  # PATCH/PUT /stage_common_options/1
  # PATCH/PUT /stage_common_options/1.json
  def update
    if @stage_common_option.update(stage_common_option_params)
      render json: fmt(created, @stage_common_option, "Updated stage_common_option id = #{params[:id]}")
    else
      render json: fmt(unprocessable_entity, [], @stage_common_option.errors.full_messages.join(', ')), status: :unprocessable_entity
    end
  end

  # DELETE /stage_common_options/1
  # DELETE /stage_common_options/1.json
  def destroy
    @stage_common_option.destroy
    render json: fmt(ok, [], "Deleted stage_common_option = #{params[:id]}")
  end

  # GET /place_orders/group_id/1
  def get_by_group_id
    render json: fmt(ok, @place_order)
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_stage_common_option
    if StageCommonOption.exists?(params[:id])
      @stage_common_option = StageCommonOption.find(params[:id])
    else
      render json: fmt(not_found, [], "Not found stage_common_option = #{params[:id]}")
    end
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_stage_common_option_by_group_id
    if StageCommonOption.exists?(group_id: params[:group_id])
      @stage_common_option = StageCommonOption.find_by(group_id: params[:group_id])
    else
      render json: fmt(not_found, [], "Not found stage_common_option = #{params[:group_id]}")
    end
  end

  # Only allow a list of trusted parameters through.
  def stage_common_option_params
    params.permit(:group_id, :own_equipment, :bgm, :camera_permission, :loud_sound)
  end
end
