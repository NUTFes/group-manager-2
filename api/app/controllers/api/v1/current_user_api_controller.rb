class Api::V1::CurrentUserApiController < ApplicationController
  # before_action :authenticate_api_user!
  
  def show
    @user = current_api_user
    render json: { data: @user }
  end

  def get_user_detail
    @user = current_api_user
    @role = @user.role.name
    @grade = @user.user_detail.grade.name
    @department = @user.user_detail.department.name
    user_detail = {
      user: @user,
      role: @role,
      grade: @grade,
      department: @department,
      
    }
    render json: user_detail
  end

  def get_groups
    @user = current_api_user
    @groups = @user.groups
    render json: @groups
  end

  def get_groups_place_allow_list
    @user = current_api_user
    #@user = User.find(1)
    @groups = @user.groups
    data = []
    set  = []
    for i in @groups
      @category  = i.group_category.name
      @place_list = i.group_category.place_allow_lists
      set_place = []
      for j in @place_list
        if j.enable == true then
          @place = j.place.name
          set_place << { place_id: j.place.id, place: @place}
        end
      end

      set = {
        group_id: i.id,
        category: @category,
        place_list: set_place
      }
      data << set
    end
    render json: data
  end

end
