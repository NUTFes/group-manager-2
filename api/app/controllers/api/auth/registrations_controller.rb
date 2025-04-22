module Api
  module Auth
    class RegistrationsController < DeviseTokenAuth::RegistrationsController
      # サインアップ完了時（createアクション）にユーザー詳細情報も保存する
      def create
        super do |resource|
          # ユーザーが正常に作成された場合、user_detailsテーブルにも情報を登録
          if resource.persisted? && params[:user_details].present?
            # user_detailsテーブルに登録するデータを準備
            user_detail_params = params[:user_details].permit(
              :tel, 
              :grade_id, 
              :department_id, 
              :student_id
            )
            
            # user_idを追加
            user_detail_params[:user_id] = resource.id
            
            # UserDetailモデルにデータを登録
            user_detail = UserDetail.new(user_detail_params)
            unless user_detail.save
              # user_detailの保存に失敗した場合はログに残す
              Rails.logger.error("Failed to create user_detail: #{user_detail.errors.full_messages}")
            end
          end
        end
      end

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
