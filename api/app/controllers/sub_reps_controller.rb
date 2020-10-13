class SubRepsController < ApplicationController
  before_action :set_sub_rep, only: [:show, :update, :destroy]

  # GET /sub_reps
  # GET /sub_reps.json
  def index
    @sub_reps = SubRep.all
    render json: @sub_reps
  end

  # GET /sub_reps/1
  # GET /sub_reps/1.json
  def show
    render json: @sub_rep
  end

  # POST /sub_reps
  # POST /sub_reps.json
  def create
    @sub_rep = SubRep.new(sub_rep_params)

    if @sub_rep.save
      render :show, status: :created, location: @sub_rep
    else
      render json: @sub_rep.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /sub_reps/1
  # PATCH/PUT /sub_reps/1.json
  def update
    if @sub_rep.update(sub_rep_params)
      render :show, status: :ok, location: @sub_rep
    else
      render json: @sub_rep.errors, status: :unprocessable_entity
    end
  end

  # DELETE /sub_reps/1
  # DELETE /sub_reps/1.json
  def destroy
    @sub_rep.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_sub_rep
      @sub_rep = SubRep.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
   def sub_rep_params
      # params.require(:sub_rep).permit(:group_id, :name, :department_id, :grade_id, :tel, :email)
      params.permit(:group_id, :name, :department_id, :grade_id, :tel, :email) 
    end
end
