class FesDatesController < ApplicationController
    before_action :set_fes_date, only: [:show, :update, :destroy]
  
    def index
      @fes_dates = FesDate.all
      render json: fmt(ok, @fes_dates)
    end
  
    def show
      render json: fmt(ok, @fes_date)
    end
  
    def create
      @fes_date = FesDate.new(fes_date_params)
      @fes_date.save
      render json: fmt(ok, @fes_date)
    end
  
    def update
      @fes_date.update(fes_date_params)
      render json: fmt(ok, @fes_date)
    end
  
    def destroy
      @fes_date.destroy
      render json: fmt(ok, [], "Deleted fes_date = "+params[:id])
    end
  
    private
      # Use callbacks to share common setup or constraints between actions.
      def set_fes_date
        @fes_date = FesDate.find(params[:id])
      end
  
      # Only allow a list of trusted parameters through.
      def fes_date_params
        params.permit(:days_num, :date, :day, :fes_year_id)
      end
  end
  
