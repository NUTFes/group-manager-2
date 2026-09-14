# frozen_string_literal: true

# rental/（貸出・返却記録アプリ）向けの認証。
#
# rental はアプリ側にログイン画面を持たず、Cloudflare Access（Zero Trust）で保護する。
# Access のCookieはrentalのドメインにしか無くAPIへ識別情報を運べないため、rentalの
# Route Handler（BFF）がサーバーサイドからAPIを呼ぶ。このconcernはその呼び出しを
# 受けるための認証で、次の2つを分けて扱う。
#
#   - 呼び出し元が正当なBFFか  … X-Rental-Api-Token を ENV['RENTAL_API_TOKEN'] と比較
#   - 記録者が誰か             … BFFが転送する Cf-Access-Authenticated-User-Email を使う
#
# 人の認証はAccessが行うため、ここでdevise_token_authのログインは要求しない。
# 既存の管理画面・ユーザー画面向けAPIには影響させない（このconcernをincludeした
# コントローラにのみ適用される）。
module RentalBffAuthenticatable
  extend ActiveSupport::Concern

  API_TOKEN_HEADER = 'X-Rental-Api-Token'
  RECORDER_EMAIL_HEADER = 'Cf-Access-Authenticated-User-Email'

  private

  # BFF専用トークンを検証する。読み取り系・書き込み系の両方で必要。
  def authenticate_rental_bff!
    return if valid_rental_bff_token?

    render_rental_unauthorized('Invalid rental API token')
  end

  # 記録者を残す必要があるアクション（記録の作成など）で使う。
  def require_rental_recorder_email!
    return if rental_recorder_email.present?

    render_rental_unauthorized('Missing recorder email')
  end

  def rental_recorder_email
    request.headers[RECORDER_EMAIL_HEADER].to_s.strip
  end

  def valid_rental_bff_token?
    expected = ENV.fetch('RENTAL_API_TOKEN', nil).to_s
    provided = request.headers[API_TOKEN_HEADER].to_s
    # トークン未設定の環境では常に拒否する（空文字同士の一致で通ってしまうのを防ぐ）
    return false if expected.blank? || provided.blank?

    ActiveSupport::SecurityUtils.secure_compare(expected, provided)
  end

  def render_rental_unauthorized(message)
    render json: fmt(unauthorized, [], message), status: :unauthorized
  end
end
