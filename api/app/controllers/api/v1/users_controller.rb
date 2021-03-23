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
    @role = @user.role.name
    @grade = @user.user_detail.grade.name
    @department = @user.user_detail.department.name
    @student_id = @user.user_detail.student_id
    @tel = @user.user_detail.tel
    @detail = @user.user_detail
    user_detail = {
      user: @user,
      role: @role,
      grade: @grade,
      department: @department,
      student_id: @student_id,
      tel: @tel,
      detail: @detail
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
  def get_user_groups
    @user = User.find(params[:id])
    @groups = @user.groups
    for group in @groups
     id = group.id
     user_id = group.user_id
     name = group.name
     project_name = group.project_name
     activity = group.activity
     category = group.group_category_id
    end
    user_groups = {
     id: id,
     user_id: user_id,
     name: name,
     project_name: project_name,
     activity: activity,
     category: category,
    }
    render json: user_groups
   end

end
