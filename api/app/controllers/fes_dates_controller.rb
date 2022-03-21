class FesDatesController < ApplicationController
    before_action :set_fes_date, only: [:show, :update, :destroy]
  
    def index
      @fes_dates = FesDate.preload(:fes_year)
        .map{
          |fes_date|
          {
            "fes_date": fes_date,
            "fes_year": fes_date.fes_year
          }
        }
      render json: fmt(ok, @fes_dates)
    end
  
    def show
      fes_date = {
        "fes_date": @fes_date,
        "fes_year": @fes_date.fes_year
      }
      render json: fmt(ok, fes_date)
    end
  
    def create
      @fes_date = FesDate.create(fes_date_params)
      render json: fmt(created, @fes_date)
    end
  
    def update
      @fes_date.update(fes_date_params)
      render json: fmt(created, @fes_date, "Updated fes_date id = "+params[:id])
    end
  
    def destroy
      @fes_date.destroy
      render json: fmt(ok, [], "Deleted fes_date = "+params[:id])
    end
  
    private
      # Use callbacks to share common setup or constraints between actions.
      def set_fes_date
        if FesDate.exists?(params[:id])
          @fes_date = FesDate.find(params[:id])
        else
          render json: fmt(not_found, [], "Not found fes_date = "+params[:id])
        end
      end
  
      # Only allow a list of trusted parameters through.
      def fes_date_params
        params.permit(:days_num, :date, :day, :fes_year_id)
      end
  end
  
