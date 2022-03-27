class Api::V1::FesDatesApiController < ApplicationController

  def get_refinement_fes_date_by_fes_year
    fes_year_id = params[:fes_year_id]
    @fes_dates = FesDate.where(fes_year_id: fes_year_id)

    if @fes_dates.count == 0
      render json: fmt(not_found, @fes_dates)
    else
      render json: fmt(ok, @fes_dates)
    end
  end

  def get_current_fes_dates
    current_fes_year_id = UserPageSetting.find(1).fes_year_id
    @fes_dates = FesDate.where(fes_year_id: current_fes_year_id)
    render json: fmt(ok, @fes_dates)
  end
end

