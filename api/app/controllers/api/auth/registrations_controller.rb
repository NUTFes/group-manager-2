# app/controllers/api/auth/registrations_controller.rb
module Api
  module Auth
    class RegistrationsController < DeviseTokenAuth::RegistrationsController

      # Strong Params 定義
      private def sign_up_params
        params.permit(:name, :email, :password, :password_confirmation, :role_id)
      end

      private def account_update_params
        params.permit(:name, :email, :role_id)
      end

      # user_details 用の Strong Params
      private def user_details_params
        params.require(:user_details).permit(
          :student_id,
          :department_id,
          :grade_id,
          :tel
        )
      end

      private def check_save_user_details
        # role_idが4かチェック
        if params[:role_id].to_i == 4
          return true
        # role_idが1,2,3の場合、user_detailsが存在するかチェック
        elsif [1, 2, 3].include?(params[:role_id].to_i) && params[:user_details].present?
          return true
        else
          return false
        end
      end

      public
      def create
        begin
          # role_idが4の場合、user_detailsの必須キーが揃っているかチェック
          if params[:role_id].to_i == 4
            # user_detailsオブジェクトが存在するか確認
            params.require(:user_details)
            # 必須キーが揃っているか確認
            %i[student_id department_id grade_id tel].each do |key|
              params.require(:user_details).require(key)
            end
          elsif [1, 2, 3].include?(params[:role_id].to_i) && params[:user_details].present?
            # role_idが1,2,3の場合、user_detailsが存在するならカラムチェック
            %i[student_id department_id grade_id tel].each do |key|
              params.require(:user_details).require(key)
            end
          end

          # トランザクションの開始
          ActiveRecord::Base.transaction do
            # DeviseTokenAuthのsuperメソッドを呼び出し、リソースを作成
            super do |resource|
              if check_save_user_details
                # チェックを通過した場合、user_detailsを保存
                detail = resource.build_user_detail(user_details_params)
                unless detail.save
                  # user_detailsの保存に失敗した場合、エラーレスポンスを返す
                  resource.errors.add(:user_details, detail.errors.full_messages)
                  render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
                  # トランザクションをロールバック
                  raise ActiveRecord::Rollback
                end
              end
            end
          end

        rescue ActionController::ParameterMissing => e
          # 必須パラメータが不足している場合のエラーハンドリング
          # 例: user_details.student_id が不足している場合にエラーを返す
          render json: { errors: ["user_details.#{e.param} が存在しません"] }, status: :unprocessable_entity
        end

      end

    end
  end
end
