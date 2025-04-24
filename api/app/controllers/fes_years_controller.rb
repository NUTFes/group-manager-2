class FesYearsController < ApplicationController
  before_action :set_fes_year, only: [:show, :update, :destroy]

  def index
    @fes_years = FesYear.all
    render json: fmt(ok, @fes_years)
  end

  def show
    render json: fmt(ok, @fes_year)
  end

  def create
    @fes_year = FesYear.create(fes_year_params)
    render json: fmt(created, @fes_year)
  end

  def update
    @fes_year.update(fes_year_params)
    render json: fmt(created, @fes_year)
  end

  def destroy
    @fes_year.destroy
    render json: fmt(ok, [], "Deleted fes_year = "+params[:id])
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_fes_year
      if FesYear.exists?(params[:id])
        @fes_year = FesYear.find(params[:id])
      else
        render json: fmt(not_found, [], "Not found fes_year = "+params[:id])
      end
    end

    # Only allow a list of trusted parameters through.
    def fes_year_params
      params.permit(:year_num)
    end
end
