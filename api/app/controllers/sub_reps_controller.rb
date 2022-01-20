class SubRepsController < ApplicationController
  before_action :set_sub_rep, only: [:show, :update, :destroy]

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
    @sub_rep = SubRep.create(sub_rep_params)
    render json: fmt(created, @sub_rep)
  end

  # PATCH/PUT /sub_reps/1
  # PATCH/PUT /sub_reps/1.json
  def update
    @sub_rep.update(sub_rep_params)
    render json: fmt(created, @sub_rep, "Updated sub_rep id = "+params[:id])
  end

  # DELETE /sub_reps/1
  # DELETE /sub_reps/1.json
  def destroy
    @sub_rep.destroy
    render json: fmt(ok, [], "Deleted sub_rep = "+params[:id])
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_sub_rep
      if SubRep.exists?(params[:id])
        @sub_rep = SubRep.find(params[:id])
      else
        render json: fmt(not_found, [], "Not found sub_rep = "+params[:id])
      end
    end

    # Only allow a list of trusted parameters through.
    def sub_rep_params
      params.permit(:group_id, :name, :department_id, :grade_id, :tel, :email, :student_id) 
    end
end
