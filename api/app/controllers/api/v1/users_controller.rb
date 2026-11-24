# frozen_string_literal: true

class Api::V1::UsersController < ApplicationController
  before_action :authenticate_api_user!
  # 管理画面向け（参照はstaff以上、書き込みはmanager）。
  # ユーザー情報の変更・パスワードの再設定は、本人ならロールを問わず使え、他人の分はmanagerだけが変更できる
  before_action :require_staff!, except: %i[edit_user_info reset_password]
  before_action :require_manager!, except: %i[
    get_user_index_for_admin_view
    get_user_show_for_admin_view
    get_representative_index_for_admin_view
    get_representative_show_for_admin_view
    get_refinement_users
    get_search_users
    show
    edit_user_info
    reset_password
  ]
  before_action :require_self_or_manager!, only: %i[edit_user_info reset_password]

  def get_user_index_for_admin_view
    @users = User.with_user_details
    render json: fmt(ok, @users)
  end

  def get_user_show_for_admin_view
    @user = User.with_user_detail(params[:id])
    render json: fmt(ok, @user)
  end

  # 代表者の取得
  def get_representative_index_for_admin_view
    @users = User.with_sub_reps
    render json: fmt(ok, @users)
  end

  def get_representative_show_for_admin_view
    @user = User.with_sub_rep(params[:id])
    render json: fmt(ok, @user)
  end

  # admin_pageのviewの形に整える
  def fit_user_index_for_admin_view(users)
    users.map do |user|
      {
        user: user,
        role: user.role
      }
    end
  end

  # 絞り込み機能
  def get_refinement_users
    role_id = params[:role_id].to_i
    if role_id == 0
      @users = User.all
    elsif role_id != 0
      @users = User.where(role_id: role_id)
    end

    if @users.none?
      render json: fmt(not_found, [], 'Not found users')
    else
      render json: fmt(ok, fit_user_index_for_admin_view(@users))
    end
  end

  # あいまい検索機能
  def get_search_users
    word = params[:word]
    @users = User.where('name like ? or email like ?', "%#{word}%", "%#{word}%")
    if @users.none?
      render json: fmt(not_found, [], 'Not found groups')
    else
      render json: fmt(ok, fit_user_index_for_admin_view(@users))
    end
  end

  # 現在のログインしているユーザーを返す
  # TODO: このコントローラーはフロントが整備され次第変更する
  def show
    @user = current_api_user
    render json: fmt(ok, @user)
  end

  ### これ使ってる？
  def update
    @user = User.find(params[:id])
    role_id = params[:role_id]
    @user.update(role_id: role_id)
    render json: @user
  end

  def edit_user_info
    @user = User.find(edit_user_info_params[:user_id])
    @user_detail = @user.user_detail
    @user.name = edit_user_info_params[:name]
    @user.email = edit_user_info_params[:email]
    @user_detail.student_id = edit_user_info_params[:student_id]
    @user_detail.grade_id = edit_user_info_params[:grade_id]
    @user_detail.department_id = edit_user_info_params[:department_id]
    @user_detail.tel = edit_user_info_params[:tel]
    @user.save!
    @user_detail.save!
  end

  def reset_password
    @user = User.find(reset_password_params[:user_id])
    @user.password = reset_password_params[:password]
    @user.password_confirmation = reset_password_params[:password_confirmation]
    @user.save!
    render json: fmt(ok, [], "Updated password user_id = #{params[:user_id]}")
  end

  private

  def require_self_or_manager!
    return if manager? || params[:user_id].to_s == current_api_user.id.to_s

    render_forbidden
  end

  def edit_user_info_params
    params.permit(:user_id, :name, :student_id, :grade_id, :department_id, :tel, :email)
  end

  def reset_password_params
    params.permit(:user_id, :password, :password_confirmation)
  end
end
