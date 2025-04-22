# app/controllers/users/sessions_controller.rb
class Users::SessionsController < Devise::SessionsController
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    # ① devise-jwt 生成済みのトークンを取得
    token = request.env['warden-jwt_auth.token']

    # ② HttpOnly Cookie としてセット
    cookies[:jwt] = {
      value:     token,
      httponly:  true,
      secure:    Rails.env.production?,
      same_site: :lax,
      expires:   3.day.from_now
    }

    # ③ JSON レスポンス
    render json: {
      status: { code: 200, message: 'Logged in successfully.' },
      data:   resource.as_json(only: [:id, :email, :created_at])
    }, status: :ok
  end

  def respond_to_on_destroy
    if current_user
      # ログアウト時はクッキーを削除
      cookies.delete(:jwt)
      render json: { status: 200, message: 'Logged out successfully.' }, status: :ok
    else
      render json: { status: 401, message: "Couldn't find an active session." }, status: :unauthorized
    end
  end
end
