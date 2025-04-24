class MemosController < ApplicationController
  before_action :set_memo, only: [:show, :update, :destroy]

  # GET /memos
  # GET /memos.json
  def index
    @memos = Memo.preload(:user).order(id: "DESC").limit(100)
      .map{ 
        |memo| 
        {
          "memo": memo,
          "user": memo.user
        }
      }
    render json: fmt(ok, @memos)
  end

  # GET /memos/1
  # GET /memos/1.json
  def show
    render json: fmt(ok, @memo)
  end

  # POST /memos
  # POST /memos.json
  def create
    @new_memo = Memo.create(memo_params)
    @memo = {
      "memo": @new_memo,
      "user": @new_memo.user
    }
    render json: fmt(created, @memo)
    # render json: @memos
  end

  # PATCH/PUT /memos/1
  # PATCH/PUT /memos/1.json
  def update
    @memo.update(memo_params)
    @memos = Memo.all.order(id: "DESC")
    memo_list = []
    for memo in @memos
      user = memo.user.name
      memo_list << {
        memo: memo,
        user: user
      }
    end
    render json: fmt(created, memo_list)
    # render json: @memos
  end

  # DELETE /memos/1
  # DELETE /memos/1.json
  def destroy
    @memo.destroy
    render json: fmt(ok, [], "Deleted memo = "+params[:id])
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_memo
      if Memo.exists?(params[:id])
        @memo = Memo.find(params[:id])
      else
        render json: fmt(not_found, [], "Not found memo = "+params[:id])
      end
    end

    # Only allow a list of trusted parameters through.
    def memo_params
      params.permit(:content, :user_id)
    end
end
