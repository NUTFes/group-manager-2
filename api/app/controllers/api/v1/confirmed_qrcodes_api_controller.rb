# frozen_string_literal: true

class Api::V1::ConfirmedQrcodesApiController < ApplicationController
  before_action :authenticate_api_user!

  def get_confirmed_qrcode_for_admin_view
    group = Group.find(params[:group_id])
    confirmed_url = group.confirmed_info_url

    render json: fmt(ok, {
                       confirmed_url: confirmed_url,
                       qrcode_png: QrcodePngDataUri.call(confirmed_url)
                     })
  rescue ActiveRecord::RecordNotFound
    render json: fmt(not_found, {}, 'Not found group'), status: :not_found
  end
end
