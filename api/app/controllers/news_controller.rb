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
    render json: @news
  end

  # POST /news
  # POST /news.json
  def create
    @news = News.new(news_params)
    @news.save
  end

  # PATCH/PUT /news/1
  # PATCH/PUT /news/1.json
  def update
    @news.update(news_params)
  end

  # DELETE /news/1
  # DELETE /news/1.json
  def destroy
    @news.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_news
      @news = News.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def news_params
      params.permit(:title, :body)
    end
end
