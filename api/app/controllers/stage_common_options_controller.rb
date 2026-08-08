# frozen_string_literal: true

class StageCommonOptionsController < ApplicationController
  before_action :set_stage_common_option, only: %i[show update destroy]
  before_action :set_stage_common_option_by_group_id, only: [:get_by_group_id]

  # GET /stage_common_options
  # GET /stage_common_options.json
  def index
    @stage_common_options = current_user_group_scope(StageCommonOption)
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
    group = current_api_user_group!(stage_common_option_params[:group_id])
    return unless group

    @stage_common_option = StageCommonOption.new(stage_common_option_params.merge(group_id: group.id))
    if @stage_common_option.save
      render json: fmt(created, @stage_common_option)
    else
      render_validation_errors(@stage_common_option)
    end
  end

  # PATCH/PUT /stage_common_options/1
  # PATCH/PUT /stage_common_options/1.json
  def update
    attrs = stage_common_option_params
    return if attrs[:group_id].present? && !current_api_user_group!(attrs[:group_id])

    if @stage_common_option.update(attrs)
      render json: fmt(created, @stage_common_option, "Updated stage_common_option id = #{params[:id]}")
    else
      render_validation_errors(@stage_common_option)
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
    render json: fmt(ok, @stage_common_option)
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_stage_common_option
    @stage_common_option = current_user_group_record!(StageCommonOption, params[:id])
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_stage_common_option_by_group_id
    group = current_api_user_group!(params[:group_id])
    return unless group

    @stage_common_option = StageCommonOption.find_by(group_id: group.id)
    render json: fmt(not_found, [], 'Not Found'), status: :not_found unless @stage_common_option
  end

  # Only allow a list of trusted parameters through.
  def stage_common_option_params
    params.permit(:group_id, :own_equipment, :bgm, :camera_permission, :loud_sound)
  end
end
