class Api::V1::UsersController < ApplicationController
  # before_action :authenticate_api_user!
  
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

  #admin_pageのviewの形に整える
  def fit_user_index_for_admin_view(users)
    users.map{
      |user|
      {
        "user": user,
        "role": user.role
      }
    }
  end

  
  # 絞り込み機能
  def get_refinement_users
    role_id = params[:role_id].to_i
    if role_id == 0
      @users = User.all
    elsif role_id != 0
      @users = User.where(role_id: role_id)
    end

    if @users.count == 0
      render json: fmt(not_found, [], "Not found users")
    else 
      render json: fmt(ok, fit_user_index_for_admin_view(@users))
    end
  end

  # あいまい検索機能
  def get_search_users
    word = params[:word]
    @users = User.where("name like ? or email like ?", "%#{word}%", "%#{word}%")
    if @users.count == 0
      render json: fmt(not_found, [], "Not found groups")
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
    render json: fmt(ok, [], "Updated password user_id = "+params[:user_id])
  end

  private
  
    def edit_user_info_params
      params.permit(:user_id, :name, :student_id, :grade_id, :department_id, :tel, :email)
    end

    def reset_password_params
      params.permit(:user_id, :password, :password_confirmation)
    end
end
