module Api
  module Auth
    class RegistrationsController < DeviseTokenAuth::RegistrationsController
      def create
        Rails.logger.debug "Registration params: #{params.inspect}"
        Rails.logger.debug "User detail params: #{params[:user_detail_attributes].inspect}"
        begin
          super
        rescue => e
          Rails.logger.error "Registration error: #{e.message}"
          Rails.logger.error "Resource errors: #{@resource.errors.full_messages}" if @resource&.errors.present?
          Rails.logger.error e.backtrace.join("\n")
          raise e
        end
      end

      protected

      def build_resource
        @resource = resource_class.new(sign_up_params)
        if params[:user_detail_attributes].present?
          user_detail_params = params[:user_detail_attributes].permit(:student_id, :department_id, :grade_id)
          Rails.logger.debug "Building user detail with params: #{user_detail_params.inspect}"
          @resource.build_user_detail(user_detail_params)
          Rails.logger.debug "User detail errors: #{@resource.user_detail.errors.full_messages}" if @resource.user_detail&.errors.present?
        end
      end

      private
      def sign_up_params
        params.permit(:email, :password, :password_confirmation, :name, :role_id, user_detail_attributes: [:student_id, :department_id, :grade_id])
      end

      def account_update_params
        params.permit(:name, :email, :role_id)
      end

    end
  end
end
