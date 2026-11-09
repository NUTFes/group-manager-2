# frozen_string_literal: true

class Api::V1::ConfirmedInfosApiController < ApplicationController
  # group_idとして受け付けるのは正の整数の文字列のみ。先頭ゼロ・符号付き・非数値を弾く
  GROUP_ID_REGEXP = /\A[1-9]\d*\z/
  # groups.idはbigintなので、この範囲を超えるidは存在し得ない
  GROUP_ID_MAX = (2**63) - 1

  # 認証なしで閲覧する確定情報
  # QRコードで配るURLにgroup_idとsecretを埋め、両方一致したときだけ返す
  def get_confirmed_info_for_user_view
    # 配列やハッシュのまま渡すと、IN句による一括試行やクエリ生成時の例外につながるため文字列にする
    secret = params[:secret].to_s
    group_id = params[:group_id].to_s

    @confirmed_info = valid_group_id?(group_id) ? Group.with_confirmed_info(group_id, secret) : nil

    # idが無い場合とsecretが違う場合を撃ち分けると団体の存在有無が漏れるため、常に404にする
    return render json: fmt(not_found, [], 'Not found group'), status: :not_found if @confirmed_info.nil?

    render json: fmt(ok, @confirmed_info)
  end

  private

  # 現状のRailsは範囲外の値でクエリ自体を発行しないため結果的に404になるが、
  # その内部挙動に依存すると将来ActiveModel::RangeErrorが伝播して500になり得る。
  # 「存在有無を漏らさず常に404」という契約をコード側で固定する
  def valid_group_id?(group_id)
    GROUP_ID_REGEXP.match?(group_id) && group_id.to_i <= GROUP_ID_MAX
  end
end
