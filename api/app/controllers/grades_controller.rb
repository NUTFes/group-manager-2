# frozen_string_literal: true

class GradesController < ApplicationController
  # 登録画面など未ログインの画面からも選択肢として使うため、認証は行わない
  def index
    render json: fmt(ok, Grade.order(:id))
  end
end
