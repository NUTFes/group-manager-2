# frozen_string_literal: true

class SubRepsController < ApplicationController
  before_action :set_sub_rep, only: %i[show update destroy]
  before_action :set_sub_reps_by_group_id, only: [:get_by_group_id]

  # 🌟この行を追加！GET以外のアクションだけに認証かける神テク✨
  before_action :authenticate_api_user!, only: %i[index show]

  # GET /sub_reps
  # GET /sub_reps.json
  def index
    @sub_reps = SubRep.all
    render json: fmt(ok, @sub_reps)
  end

  # GET /sub_reps/1
  # GET /sub_reps/1.json
  def show
    render json: fmt(ok, @sub_rep)
  end

  # POST /sub_reps
  # POST /sub_reps.json
  def create
    @sub_rep = SubRep.new(sub_rep_params)
    if @sub_rep.save
      render json: fmt(created, @sub_rep)
    else
      render json: fmt(unprocessable_entity, @sub_rep.errors), status: :unprocessable_entity
    end
  end

  # PATCH/PUT /sub_reps/1
  # PATCH/PUT /sub_reps/1.json
  def update
    @sub_rep.update(sub_rep_params)
    render json: fmt(created, @sub_rep, "Updated sub_rep id = #{params[:id]}")
  end

  # DELETE /sub_reps/1
  # DELETE /sub_reps/1.json
  def destroy
    @sub_rep.destroy
    render json: fmt(ok, [], "Deleted sub_rep = #{params[:id]}")
  end

  # GET /sub_reps/group_id/1
  def get_by_group_id
    render json: fmt(ok, @sub_rep)
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_sub_rep
    if SubRep.exists?(params[:id])
      @sub_rep = SubRep.find(params[:id])
    else
      render json: fmt(not_found, [], "Not found sub_rep = #{params[:id]}"), status: :not_found
    end
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_sub_reps_by_group_id
    if SubRep.exists?(group_id: params[:group_id])
      @sub_rep = SubRep.find_by(group_id: params[:group_id])
    else
      render json: fmt(not_found, [], "Not found sub_rep = #{params[:group_id]}")
    end
  end

  # Only allow a list of trusted parameters through.
  def sub_rep_params
    params.permit(:group_id, :name, :department_id, :grade_id, :tel, :email, :student_id)
  end
end
