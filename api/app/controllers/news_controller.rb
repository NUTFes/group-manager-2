class NewsController < ApplicationController
  before_action :set_news, only: [:show, :update, :destroy]

  # GET /news
  # GET /news.json
  def index
    @news = News.all
  end

  # GET /news/1
  # GET /news/1.json
  def show
  end

  # POST /news
  # POST /news.json
  def create
    @news = News.new(news_params)

    if @news.save
      render :show, status: :created, location: @news
    else
      render json: @news.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /news/1
  # PATCH/PUT /news/1.json
  def update
    if @news.update(news_params)
      render :show, status: :ok, location: @news
    else
      render json: @news.errors, status: :unprocessable_entity
    end
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
      params.require(:news).permit(:title, :body)
    end
end
