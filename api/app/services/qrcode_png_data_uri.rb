# frozen_string_literal: true

require 'rqrcode'
require 'base64'

# 任意のURLをPNG形式のQRコードに変換し、data URI(base64)として返す。
class QrcodePngDataUri
  SIZE = 300

  def self.call(url)
    png = RQRCode::QRCode.new(url).as_png(color: 'black', fill: 'white', size: SIZE)
    "data:image/png;base64,#{Base64.strict_encode64(png.to_blob)}"
  end
end
