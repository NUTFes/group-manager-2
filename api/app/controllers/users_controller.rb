class UsersController < ApplicationController
  # before_action :authenticate_api_user!
  before_action :set_user, only: [:show, :update, :destroy]

  def index
    @users = User.all
    render json: fmt(ok, @users)
  end
  
  def show
    render json: fmt(ok, @user)
  end

  def get_current_user
    @user = current_api_user
    render json: @user
  end

  def update
    @user.update(user_params)
    render json: fmt(ok, @user, "Updated user id = "+params[:id])
  end

  def destroy
    @user.destroy
    render json: fmt(ok, [], "Deleted user = "+params[:id])
  end

  def show_user_detail
    @user = User.find(params[:id])
    role = @user.role.name
    grade = @user.user_detail.grade.name
    grade_id = @user.user_detail.grade.id
    department = @user.user_detail.department.name
    department_id = @user.user_detail.department.id
    student_id = @user.user_detail.student_id
    tel = @user.user_detail.tel
    user_id = @user.id
    user_provider = @user.provider
    user_name = @user.name
    email = @user.email
    
    @groups = @user.groups
    groups = []
    for group in @groups
      group_data = []
      group_data = {
        group: group,
        fes_year: group.fes_year.year_num,
        category: group.group_category.name
      }
      groups << group_data
    end
    user_detail = {
      user: @user,
      groups: groups,
      user_id: user_id,
      user_name: user_name,
      user_provider: user_provider,
      email: email,
      role: role,
      grade: grade,
      grade_id: grade_id,
      department: department,
      department_id: department_id,
      student_id: student_id,
      tel: tel,
    }

    render json: fmt(ok, user_detail)
  end

  def get_user_detail
    @user = current_api_user
    @role = @user.role.name
    @grade = @user.user_detail.grade.name
    @department = @user.user_detail.department.name
    @student_id = @user.user_detail.student_id
    @tel = @user.user_detail.tel
    user_detail = {
      user: @user,
      role: @role,
      grade: @grade,
      department: @department,
      student_id: @student_id,
      tel: @tel,
      
    }

    render json: fmt(ok, user_detail)
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

  def simply_user_create
    @user = User.create(simply_user_create_params)
    if @user.id == nil
      render json: fmt(internal_server_error, [], "internal_server_error")
    else 
      render json: fmt(created, @user)
    end
  end

  private

    def set_user
      @user = User.find(params[:id])
    end

    def user_params
      params.permit(:name, :email, :role_id)
    end
  
    def edit_user_info_params
      params.permit(:user_id, :name, :student_id, :grade_id, :department_id, :tel, :email)
    end

    def reset_password_params
      params.permit(:user_id, :password, :password_confirmation)
    end

    def simply_user_create_params
      params.permit(:name, :email, :password, :password_confirmation, :role_id)
    end
end
