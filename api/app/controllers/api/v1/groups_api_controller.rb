class Api::V1::GroupsApiController < ApplicationController

  def get_group_name
    # 参加団体の名前を取得する
    groups = Group.all
    group_list = []
    for group in groups
      group_list << {
        id: group.id,
        name: group.name
      }
    end
    render json: group_list
  end

  def get_group_from_project_name
    # 企画名から参加団体の情報を取得する
    group = Group.find(params[:id])
    user = group.user.name
    group_category = group.group_category.name
    fes_year = group.fes_year.year_num
    group_details = {
      group: group,
      user: user,
      group_category: group_category,
      fes_year: fes_year
    }
    render json: group_details
  end

  def get_group
    group = Group.find(params[:id])
    user = group.user.name
    fes_year = group.fes_year.year_num
    group_list = []
    group_list = {
      group: group,
      user: user,
      fes_year: fes_year
    }
    render json: group_list
  end

end
