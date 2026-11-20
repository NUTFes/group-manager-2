# frozen_string_literal: true

class Api::V1::ConfirmedQrcodesApiController < ApplicationController
  before_action :authenticate_api_user!, only: :get_confirmed_qrcode_for_admin_view
  before_action :require_admin!, only: :get_confirmed_qrcode_for_admin_view
  # レスポンスにsecretを含むconfirmed_urlが載るため、念のためこのAPI自体にも
  # Referrer-Policyを設定しておく。ただしJSON APIレスポンス自体が第三者に
  # 遷移することは想定しづらく、本質的な対策はconfirmed_urlが指す
  # /confirmedページ(#2183)側に同様のヘッダーを設定することである。
  after_action -> { response.headers['Referrer-Policy'] = 'no-referrer' }

  # 管理画面向け。manager/staff(role_id: 1, 2)のみ利用可能。
  def get_confirmed_qrcode_for_admin_view
    group = Group.find(params[:group_id])
    render_qrcode(group)
  rescue ActiveRecord::RecordNotFound
    render_not_found
  end

  # 参加団体向け。認証は行わず、group_idとsecretの一致のみで認可する。
  # 不一致・団体が存在しない場合はいずれも404とし、group_idの存在有無を漏らさない。
  def get_confirmed_qrcode_for_user_view
    group = Group.find(params[:group_id])
    return render_not_found unless valid_secret?(group)

    render_qrcode(group)
  rescue ActiveRecord::RecordNotFound
    render_not_found
  end

  private

  def valid_secret?(group)
    secret = group.secret
    return false if secret.blank? || params[:secret].blank?

    ActiveSupport::SecurityUtils.secure_compare(secret, params[:secret].to_s)
  end

  def render_qrcode(group)
    confirmed_url = group.confirmed_info_url
    render json: fmt(ok, {
                       confirmed_url: confirmed_url,
                       qrcode_png: QrcodePngDataUri.call(confirmed_url)
                     })
  end

  def render_not_found
    render json: fmt(not_found, {}, 'Not found group'), status: :not_found
  end
end
