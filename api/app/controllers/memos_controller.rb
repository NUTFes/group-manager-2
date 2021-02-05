class MemosController < ApplicationController
  before_action :set_memo, only: [:show, :update, :destroy]

  # GET /memos
  # GET /memos.json
  def index
    @memos = Memo.all.order(id: "DESC")
    render json: @memos
  end

  # GET /memos/1
  # GET /memos/1.json
  def show
    render json: @memo
  end

  # POST /memos
  # POST /memos.json
  def create
    @memo = Memo.new(memo_params)
    @memo.save
    @memos = Memo.all.order(id: "DESC")
    render json: @memos
  end

  # PATCH/PUT /memos/1
  # PATCH/PUT /memos/1.json
  def update
    @memo.update(memo_params)
    @memos = Memo.all.order(id: "DESC")
    render json: @memos
  end

  # DELETE /memos/1
  # DELETE /memos/1.json
  def destroy
    @memo.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_memo
      @memo = Memo.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def memo_params
      params.permit(:content, :user_id)
    end
end
