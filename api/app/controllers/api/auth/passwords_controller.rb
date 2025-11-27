# frozen_string_literal: true

module Api
  module Auth
    class PasswordsController < DeviseTokenAuth::PasswordsController
      # Devise Token Auth 標準のパスワードリセットフローを利用します。
      # 基本的な挙動は親クラスに委譲し、必要があればここでカスタマイズします。
    end
  end
end
