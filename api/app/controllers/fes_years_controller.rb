class FesYearsController < ApplicationController
  before_action :set_fes_year, only: [:show, :update, :destroy]

  def index
    @fes_years = FesYear.all
    render json: @fes_years
  end

  def show
    render json: @fes_year
  end

  def create
    @fes_year = FesYear.new(fes_year_params)
    @fes_year.save
    render json: @fes_year
  end

  def update
    @fes_year.update(fes_year_params)
    render json: @fes_year
  end

  def destroy
    @fes_year.destroy
    @fes_years = FesYear.all
    render json: @fes_years
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_fes_year
      @fes_year = FesYear.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def fes_year_params
      params.permit(:year_num)
    end
end
