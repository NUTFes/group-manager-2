class Api::V1::UsersController < ApplicationController
  # before_action :authenticate_api_user!

  def index

    @users = User.all
    render json: { status: 'SUCCESS', message: 'Loaded users', data: @users }
  end
  
  def show
    @user = current_api_user
    render json: { data: @user }
  end

  def update
    @user = User.find(params[:id])
    role_id = params[:role_id]
    @user.update(role_id: role_id)
    render json: @user
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

    render json: user_detail
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

    render json: user_detail
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
  end

  private
  
    def edit_user_info_params
      params.permit(:user_id, :name, :student_id, :grade_id, :department_id, :tel, :email)
    end

    def reset_password_params
      params.permit(:user_id, :password, :password_confirmation)
    end
end
