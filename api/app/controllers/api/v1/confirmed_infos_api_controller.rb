# frozen_string_literal: true

class Api::V1::ConfirmedInfosApiController < ApplicationController
  # 認証なしで閲覧する確定情報
  # QRコードで配るURLにgroup_idとsecretを埋め、両方一致したときだけ返す
  def get_confirmed_info_for_user_view
    # 配列やハッシュのまま渡すと、IN句による一括試行やクエリ生成時の例外につながるため文字列にする
    secret = params[:secret].to_s
    @confirmed_info = Group.with_confirmed_info(params[:group_id], secret)

    # idが無い場合とsecretが違う場合を撃ち分けると団体の存在有無が漏れるため、常に404にする
    return render json: fmt(not_found, [], 'Not found group'), status: :not_found if @confirmed_info.nil?

    render json: fmt(ok, @confirmed_info)
  end
end
