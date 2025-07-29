# app/controllers/api/auth/registrations_controller.rb
module Api
  module Auth
    class RegistrationsController < DeviseTokenAuth::RegistrationsController

      private

      # 困惑しないように解説コメント
      # Userテーブルに保存する内容はregistrationキーの中にいれてリクエストする必要がある
      # 例: { registration: { name: "ユーザー名", email: "メールアドレス", password: "パスワード" } }
      # user_detailsテーブルに保存する内容はuser_detailsキーの中にいれてリクエストする必要がある
      # 例: { user_details: { student_id: "学籍番号", department_id: "学部ID", grade_id: "学年ID", tel: "電話番号" } }
      # これらのキーはparamsの中にネストされている必要がある
      # 例: { registration: { name: "ユーザー名", email: "メールアドレス", password: "パスワード" }, user_details: { student_id: "学籍番号", department_id: "学部ID", grade_id: "学年ID", tel: "電話番号" } }
      # これにより、Strong Parametersを使用して、許可されたパラメータのみを受け取ることができる

      def sign_up_params
        # 許可するパラメータを定義
        allowed_attrs = %i[name email password password_confirmation role_id confirm_success_url]
        # user_detailsのネストされたパラメータも許可
        nested = { user_details: %i[student_id department_id grade_id tel] }

        # registrationキーが存在する場合と存在しない場合で分岐
        if params[:registration]
          # registrationキーがある場合、その中のパラメータを許可
          params.require(:registration).permit(allowed_attrs, nested)
        else
          # registrationキーがない場合、トップレベルのパラメータを許可
          params.permit(allowed_attrs, nested)
        end
      end

      # アカウント更新時の Strong Parameters
      def account_update_params
        # 許可するパラメータを定義
        allowed_attrs = %i[name email role_id]
        nested = { user_details: %i[student_id department_id grade_id tel] }

        # registrationキーが存在する場合と存在しない場合で分岐
        if params[:registration]
          # registrationキーがある場合、その中のパラメータを許可
          params.require(:registration).permit(allowed_attrs, nested)
        else
          # registrationキーがない場合、トップレベルのパラメータを許可
          params.permit(allowed_attrs, nested)
        end
      end

      # user_details 用の Strong Parameters
      def user_details_params
        # registrationキー内にuser_detailsが存在する場合
        if params[:registration] && params[:registration][:user_details].present?
          # registrationキー内のuser_detailsを取得し、許可する
          params.require(:registration)
                .require(:user_details)
                .permit(:student_id, :department_id, :grade_id, :tel)
        elsif params[:user_details].present?
          # トップレベルにuser_detailsが存在する場合
          params.require(:user_details)
                .permit(:student_id, :department_id, :grade_id, :tel)
        else
          # user_detailsが存在しない場合は空のパラメータを返す
          ActionController::Parameters.new
        end
      end

      # user_detailsの必須チェックを行う関数
      def check_user_details
        role = (params[:registration]&.dig(:role_id) || params[:role_id]).to_i
        details = user_details_params

        # role_idが4の場合、user_detailsの必須キーをチェック
        if role == 4
          missing = %i[student_id department_id grade_id tel].map(&:to_s) - details.keys.map(&:to_s)
          return missing.empty? || missing
        elsif details.present?
          # role_idが4以外でuser_detailsが存在する場合、必須キーをチェック
          missing = %i[student_id department_id grade_id tel].map(&:to_s) - details.keys.map(&:to_s)
          return missing.empty? || missing
        end

        # user_detailsが不要な場合はtrueを返す
        true
      end

      public

      def create
        # user_detailsのチェックを実行
        check_req = check_user_details
        # 必須パラメータが不足している場合、エラーレスポンスを返す
        return render json: { errors: { user_details: check_req.map { |k| "user_details.#{k} が存在しません" } } }, status: :unprocessable_entity if check_req.is_a?(Array)

        # トランザクションの開始
        ActiveRecord::Base.transaction do
          # DeviseTokenAuthのsuperメソッドを呼び出し、リソースを作成
          super do |resource|
            # user_details が存在すれば保存
            if resource.persisted? && user_details_params.present?
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
      end
    end
  end
end
