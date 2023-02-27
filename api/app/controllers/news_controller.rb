class NewsController < ApplicationController
  before_action :set_news, only: [:show, :update, :destroy]

  # GET /news
  # GET /news.json
  def index
    @news = News.all.order(id: "DESC")
    render json: @news
  end

  # GET /news/1
  # GET /news/1.json
  def show
    render json: fmt(ok, @news)
  end

  # POST /news
  # POST /news.json
  def create
    @news = News.create(news_params)
    render json: fmt(created, @news)
  end

  # PATCH/PUT /news/1
  # PATCH/PUT /news/1.json
  def update
    @news.update(news_params)
    render json: fmt(created, @news, "Updated news id = "+params[:id])
  end

  # DELETE /news/1
  # DELETE /news/1.json
  def destroy
    @news.destroy
    render json: fmt(ok, [], "Deleted news = "+params[:id])
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_news
      if News.exists?(params[:id])
        @news = News.find(params[:id])
      else
        render json: fmt(not_found, [], "Not found news = "+params[:id])
      end
    end

    # Only allow a list of trusted parameters through.
    def news_params
      params.permit(:title, :body)
    end
end
