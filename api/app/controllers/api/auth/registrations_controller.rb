module Api
  module Auth
    class RegistrationsController < DeviseTokenAuth::RegistrationsController
      private
      def sign_up_params
        params.permit(:name, :email, :password, :password_confirmation, :role_id)
      end

      def account_update_params
        params.permit(:name, :email, :role_id)
      end

    end
  end
end
