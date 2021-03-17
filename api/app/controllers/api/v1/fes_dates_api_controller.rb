class Api::V1::FesDatesApiController < ApplicationController

  def get_fes_dates
    # 開催日を取得する
    fes_dates = FesDate.all
    fes_date_list = []
    for fes_date in fes_dates
      fes_year = fes_date.fes_year.year_num
      fes_date_list << {
        fes_date: fes_date,
        fes_year: fes_year,
      }
    end
    render json: fes_date_list
  end

  def get_fes_date
    # 開催日を取得する
    fes_date = FesDate.find(params[:id])
    fes_year = fes_date.fes_year.year_num
    fes_date_list = {
      fes_date: fes_date,
      fes_year: fes_year,
    }
    render json: fes_date_list
  end

end
